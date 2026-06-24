import AppShell from "../components/AppShell";
import { useAppData } from "../context/AppDataContext";
import { useAuth } from "../context/AuthContext";

export default function Notifications() {
  const { currentUser } = useAuth();
  const { notifications, markNotificationRead, deleteNotification } = useAppData();
  const visibleNotifications = notifications.filter(
    (note) => note.recipientUid === "all" || note.recipientUid === currentUser.uid
  );
  const grouped = visibleNotifications.reduce((groups, note) => {
    const category = note.category || "General";
    groups[category] = groups[category] || [];
    groups[category].push(note);
    return groups;
  }, {});

  return (
    <AppShell title="Notifications" description="Review task alerts, feedback notes, resource updates, and read state.">
      <section className="panel">
        <div className="panel-header">
          <div><h2>Updates</h2><p>{visibleNotifications.length} notifications</p></div>
        </div>
        <div className="notification-groups">
          {Object.entries(grouped).map(([category, items]) => (
            <section key={category} className="notification-group" aria-labelledby={`group-${category}`}>
              <h3 id={`group-${category}`}>{category}</h3>
              <div className="stack-list roomy">
                {items.map((note) => (
                  <article key={note.id} className={`notification-item ${note.read ? "read" : "unread"}`}>
                    <div>
                      <strong>{note.title}</strong>
                      <span>{note.message}</span>
                      <small>{new Date(note.createdAt).toLocaleString()}</small>
                    </div>
                    <div className="row-actions">
                      <button className="button secondary" type="button" onClick={() => markNotificationRead(note.id)} disabled={note.read}>Mark read</button>
                      <button className="button danger" type="button" onClick={() => deleteNotification(note.id)}>Delete</button>
                    </div>
                  </article>
                ))}
              </div>
            </section>
          ))}
          {visibleNotifications.length === 0 ? <p className="empty-state">No notifications for this account.</p> : null}
        </div>
      </section>
    </AppShell>
  );
}
