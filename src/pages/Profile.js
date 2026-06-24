import { useState } from "react";
import AppShell from "../components/AppShell";
import { useAppData } from "../context/AppDataContext";
import { useAuth } from "../context/AuthContext";

export default function Profile() {
  const { currentUser, role } = useAuth();
  const { profiles, updateProfile } = useAppData();
  const currentProfile = profiles[currentUser.uid] || {
    email: currentUser.email,
    fullName: currentUser.displayName || "",
    department: "",
    phone: "",
    role,
    bio: "",
  };
  const [form, setForm] = useState(currentProfile);
  const [message, setMessage] = useState("");

  const updateField = (field, value) => setForm((current) => ({ ...current, [field]: value }));

  const handleSubmit = (event) => {
    event.preventDefault();
    updateProfile(currentUser.uid, { ...form, role });
    setMessage("Profile saved.");
  };

  return (
    <AppShell title="Profile" description="Maintain personal information used across the internship workspace.">
      <section className="panel profile-panel">
        <form className="profile-form" onSubmit={handleSubmit}>
          <div className="field-group">
            <label htmlFor="profileName">Full name</label>
            <input id="profileName" value={form.fullName || ""} onChange={(event) => updateField("fullName", event.target.value)} required />
          </div>
          <div className="field-group">
            <label htmlFor="profileEmail">Email</label>
            <input id="profileEmail" value={form.email || currentUser.email} readOnly />
          </div>
          <div className="field-group">
            <label htmlFor="profileDepartment">Department</label>
            <input id="profileDepartment" value={form.department || ""} onChange={(event) => updateField("department", event.target.value)} />
          </div>
          <div className="field-group">
            <label htmlFor="profilePhone">Phone</label>
            <input id="profilePhone" value={form.phone || ""} onChange={(event) => updateField("phone", event.target.value)} />
          </div>
          <div className="field-group">
            <label htmlFor="profileRole">Role</label>
            <input id="profileRole" value={role} readOnly />
          </div>
          <div className="field-group wide-field">
            <label htmlFor="profileBio">Personal bio</label>
            <textarea id="profileBio" rows="5" value={form.bio || ""} onChange={(event) => updateField("bio", event.target.value)} />
          </div>
          {message ? <p className="form-success wide-field" role="status">{message}</p> : null}
          <button className="button primary" type="submit">Save profile</button>
        </form>
      </section>
    </AppShell>
  );
}
