import { NavLink, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { useAppData } from "../context/AppDataContext";

const navItems = [
  { to: "/admin", label: "Admin Dashboard" },
  { to: "/dashboard", label: "Dashboard" },
  { to: "/tasks", label: "Tasks" },
  { to: "/feedback", label: "Feedback" },
  { to: "/resources", label: "Resources" },
  { to: "/notifications", label: "Notifications" },
  { to: "/users", label: "Users" },
  { to: "/analytics", label: "Analytics" },
  { to: "/profile", label: "Profile" },
];

function roleLabel(role) {
  return role.charAt(0).toUpperCase() + role.slice(1);
}

export default function AppShell({ title, description, actions, children }) {
  const { currentUser, role, logout, isDemo } = useAuth();
  const { notifications } = useAppData();
  const navigate = useNavigate();

  const unreadCount = notifications.filter(
    (note) => !note.read && (note.recipientUid === "all" || note.recipientUid === currentUser?.uid)
  ).length;

  const handleLogout = async () => {
    await logout();
    navigate("/login");
  };

  return (
    <div className="app-shell">
      <aside className="sidebar" aria-label="Primary navigation">
        <div className="sidebar-brand">
          <div className="brand-mark" aria-hidden="true">ID</div>
          <div>
            <strong>Internship Dashboard</strong>
            <span>{roleLabel(role)} workspace</span>
          </div>
        </div>

        <nav className="sidebar-nav">
          {navItems.map((item) => (
            <NavLink key={item.to} to={item.to} className={({ isActive }) => (isActive ? "active" : undefined)}>
              <span>{item.label}</span>
              {item.to === "/notifications" && unreadCount > 0 ? <em>{unreadCount}</em> : null}
            </NavLink>
          ))}
        </nav>
      </aside>

      <div className="workspace">
        <header className="topbar">
          <div>
            <h1>{title}</h1>
            {description ? <p>{description}</p> : null}
          </div>
          <div className="topbar-actions">
            {actions}
            <div className="user-chip">
              <strong>{currentUser?.displayName || currentUser?.email}</strong>
              <span>{roleLabel(role)}{isDemo ? " demo" : ""}</span>
            </div>
            <button className="button secondary" type="button" onClick={handleLogout}>Sign out</button>
          </div>
        </header>
        <main className="content-area">{children}</main>
      </div>
    </div>
  );
}
