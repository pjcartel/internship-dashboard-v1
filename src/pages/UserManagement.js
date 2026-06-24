import { useState } from "react";
import AppShell from "../components/AppShell";
import { useAppData } from "../context/AppDataContext";
import { useAuth } from "../context/AuthContext";

export default function UserManagement() {
  const { role } = useAuth();
  const { users, updateUserRole, addUser } = useAppData();
  const [form, setForm] = useState({ email: "", fullName: "", role: "intern", department: "" });
  const [message, setMessage] = useState("");
  const canManage = role === "admin";

  const updateField = (field, value) => setForm((current) => ({ ...current, [field]: value }));

  const handleCreate = (event) => {
    event.preventDefault();
    setMessage("");
    if (!canManage) {
      setMessage("Only administrators can create users.");
      return;
    }
    if (!form.email.endsWith("@softlink.com") || !form.fullName.trim()) {
      setMessage("Add a full name and Softlink work email.");
      return;
    }
    addUser({ ...form, phone: "", bio: "" });
    setForm({ email: "", fullName: "", role: "intern", department: "" });
    setMessage("User added to the local workspace.");
  };

  return (
    <AppShell title="Users" description="View users, assign roles, and update permissions for the internship platform.">
      <section className="split-layout">
        <form className="panel form-panel" onSubmit={handleCreate}>
          <div className="panel-header"><h2>Add user</h2><p>Admin-only in production.</p></div>
          <div className="field-group">
            <label htmlFor="fullName">Full name</label>
            <input id="fullName" value={form.fullName} onChange={(event) => updateField("fullName", event.target.value)} disabled={!canManage} required />
          </div>
          <div className="field-group">
            <label htmlFor="email">Work email</label>
            <input id="email" type="email" value={form.email} onChange={(event) => updateField("email", event.target.value)} disabled={!canManage} required />
          </div>
          <div className="field-group">
            <label htmlFor="department">Department</label>
            <input id="department" value={form.department} onChange={(event) => updateField("department", event.target.value)} disabled={!canManage} />
          </div>
          <div className="field-group">
            <label htmlFor="role">Role</label>
            <select id="role" value={form.role} onChange={(event) => updateField("role", event.target.value)} disabled={!canManage}>
              <option value="intern">Intern</option>
              <option value="supervisor">Supervisor</option>
              <option value="admin">Administrator</option>
            </select>
          </div>
          {message ? <p className={message.includes("added") ? "form-success" : "form-error"}>{message}</p> : null}
          <button className="button primary" type="submit" disabled={!canManage}>Create user</button>
        </form>

        <div className="panel list-panel">
          <div className="panel-header"><h2>User directory</h2><p>{users.length} users</p></div>
          <div className="table-wrap">
            <table>
              <thead><tr><th>Name</th><th>Email</th><th>Department</th><th>Role</th></tr></thead>
              <tbody>
                {users.map((user) => (
                  <tr key={user.uid}>
                    <td><strong>{user.fullName || "Unnamed user"}</strong></td>
                    <td>{user.email}</td>
                    <td>{user.department || "Not set"}</td>
                    <td>
                      <select aria-label={`Role for ${user.email}`} value={user.role} onChange={(event) => updateUserRole(user.uid, event.target.value)} disabled={!canManage}>
                        <option value="intern">Intern</option>
                        <option value="supervisor">Supervisor</option>
                        <option value="admin">Administrator</option>
                      </select>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </section>
    </AppShell>
  );
}
