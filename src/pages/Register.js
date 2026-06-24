import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const initialForm = {
  email: "",
  password: "",
  fullName: "",
  department: "",
  phone: "",
  bio: "",
};

export default function Register() {
  const [form, setForm] = useState(initialForm);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [loading, setLoading] = useState(false);
  const { register } = useAuth();
  const navigate = useNavigate();

  const updateField = (field, value) => {
    setForm((current) => ({ ...current, [field]: value }));
  };

  const handleRegister = async (event) => {
    event.preventDefault();
    setError("");
    setSuccess("");

    if (!form.email.endsWith("@softlink.com")) {
      setError("Use a Softlink work email address to register.");
      return;
    }

    setLoading(true);
    try {
      await register(form);
      setSuccess("Registration completed. Redirecting to the dashboard.");
      setTimeout(() => navigate("/dashboard"), 600);
    } catch (err) {
      setError(err.message || "Registration failed. Try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="auth-page">
      <section className="auth-panel wide" aria-labelledby="register-title">
        <div className="auth-copy">
          <div className="auth-logo">ID</div>
          <h1 id="register-title">Create intern profile</h1>
          <p>Register with a Softlink work email. New accounts start with the intern role.</p>
        </div>

        <form className="auth-form two-column" onSubmit={handleRegister}>
          <div className="field-group">
            <label htmlFor="fullName">Full name</label>
            <input id="fullName" value={form.fullName} onChange={(event) => updateField("fullName", event.target.value)} required />
          </div>
          <div className="field-group">
            <label htmlFor="department">Department</label>
            <input id="department" value={form.department} onChange={(event) => updateField("department", event.target.value)} required />
          </div>
          <div className="field-group">
            <label htmlFor="registerEmail">Work email</label>
            <input id="registerEmail" type="email" value={form.email} onChange={(event) => updateField("email", event.target.value)} required />
          </div>
          <div className="field-group">
            <label htmlFor="phone">Phone number</label>
            <input id="phone" value={form.phone} onChange={(event) => updateField("phone", event.target.value)} />
          </div>
          <div className="field-group">
            <label htmlFor="registerPassword">Password</label>
            <input id="registerPassword" type="password" value={form.password} onChange={(event) => updateField("password", event.target.value)} required minLength={6} />
          </div>
          <div className="field-group wide-field">
            <label htmlFor="bio">Personal bio</label>
            <textarea id="bio" rows="4" value={form.bio} onChange={(event) => updateField("bio", event.target.value)} />
          </div>

          {error ? <p className="form-error wide-field" role="alert">{error}</p> : null}
          {success ? <p className="form-success wide-field" role="status">{success}</p> : null}

          <button className="button primary" type="submit" disabled={loading}>
            {loading ? "Creating account" : "Register"}
          </button>
        </form>

        <p className="auth-switch">Already registered? <Link to="/login">Sign in</Link></p>
      </section>
    </main>
  );
}
