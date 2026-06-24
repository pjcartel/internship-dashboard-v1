import { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export default function Login() {
  const [email, setEmail] = useState("admin@softlink.com");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const { login, demoLogin } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const nextPath = location.state?.from?.pathname || "/dashboard";

  const handleLogin = async (event) => {
    event.preventDefault();
    setError("");
    setLoading(true);
    try {
      await login(email, password);
      navigate(nextPath, { replace: true });
    } catch (err) {
      setError(err.message || "Unable to sign in. Check the account and password.");
    } finally {
      setLoading(false);
    }
  };

  const handleDemo = (role) => {
    demoLogin(role);
    navigate(nextPath, { replace: true });
  };

  return (
    <main className="auth-page">
      <section className="auth-panel" aria-labelledby="login-title">
        <div className="auth-copy">
          <div className="auth-logo">ID</div>
          <h1 id="login-title">Internship Dashboard</h1>
          <p>Sign in to manage internship tasks, feedback, resources, users, notifications, and analytics.</p>
        </div>

        <form className="auth-form" onSubmit={handleLogin}>
          <div className="field-group">
            <label htmlFor="email">Work email</label>
            <input
              id="email"
              type="email"
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              autoComplete="email"
              required
            />
          </div>
          <div className="field-group">
            <label htmlFor="password">Password</label>
            <input
              id="password"
              type="password"
              value={password}
              onChange={(event) => setPassword(event.target.value)}
              autoComplete="current-password"
              placeholder="Use Firebase credentials or demo access"
            />
          </div>

          {error ? <p className="form-error" role="alert">{error}</p> : null}

          <button className="button primary full" type="submit" disabled={loading}>
            {loading ? "Signing in" : "Sign in"}
          </button>
        </form>

        <div className="demo-access" aria-label="Demo access">
          <button type="button" className="button secondary" onClick={() => handleDemo("admin")}>Admin demo</button>
          <button type="button" className="button secondary" onClick={() => handleDemo("supervisor")}>Supervisor demo</button>
          <button type="button" className="button secondary" onClick={() => handleDemo("intern")}>Intern demo</button>
        </div>

        <p className="auth-switch">Need an account? <Link to="/register">Register with a work email</Link></p>
      </section>
    </main>
  );
}
