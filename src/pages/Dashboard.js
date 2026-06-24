import { Link } from "react-router-dom";
import AppShell from "../components/AppShell";
import { useAppData } from "../context/AppDataContext";
import { useAuth } from "../context/AuthContext";

function statusCount(tasks, status) {
  return tasks.filter((task) => task.status === status).length;
}

export default function Dashboard() {
  const { currentUser, role } = useAuth();
  const { tasks, feedback, resources, notifications, users } = useAppData();

  const relevantTasks = role === "intern" ? tasks.filter((task) => task.assignedToUid === currentUser.uid) : tasks;
  const unread = notifications.filter((note) => !note.read && (note.recipientUid === "all" || note.recipientUid === currentUser.uid));
  const dueSoon = relevantTasks.filter((task) => task.status !== "completed").slice(0, 4);

  return (
    <AppShell
      title="Dashboard"
      description="Track internship work, feedback, resources, and program activity from one workspace."
    >
      <section className="metric-row" aria-label="Program overview">
        <div className="metric-card"><span>Total tasks</span><strong>{relevantTasks.length}</strong></div>
        <div className="metric-card"><span>Completed</span><strong>{statusCount(relevantTasks, "completed")}</strong></div>
        <div className="metric-card"><span>Feedback notes</span><strong>{feedback.length}</strong></div>
        <div className="metric-card"><span>Unread updates</span><strong>{unread.length}</strong></div>
      </section>

      <section className="dashboard-grid">
        <div className="panel large-panel">
          <div className="panel-header">
            <div>
              <h2>Assigned work</h2>
              <p>Current tasks and completion status.</p>
            </div>
            <Link className="text-link" to="/tasks">Open tasks</Link>
          </div>
          <div className="table-wrap">
            <table>
              <thead>
                <tr><th>Task</th><th>Owner</th><th>Status</th><th>Deadline</th></tr>
              </thead>
              <tbody>
                {dueSoon.map((task) => (
                  <tr key={task.id}>
                    <td><strong>{task.title}</strong><span>{task.description}</span></td>
                    <td>{task.assignedTo}</td>
                    <td><span className={`status ${task.status}`}>{task.status}</span></td>
                    <td>{task.deadline || "Not set"}</td>
                  </tr>
                ))}
                {dueSoon.length === 0 ? <tr><td colSpan="4" className="empty-cell">No active tasks.</td></tr> : null}
              </tbody>
            </table>
          </div>
        </div>

        <div className="panel">
          <div className="panel-header">
            <div>
              <h2>Notifications</h2>
              <p>Unread items that need attention.</p>
            </div>
            <Link className="text-link" to="/notifications">View all</Link>
          </div>
          <div className="stack-list">
            {unread.slice(0, 4).map((note) => (
              <article key={note.id} className="list-item">
                <strong>{note.title}</strong>
                <span>{note.message}</span>
              </article>
            ))}
            {unread.length === 0 ? <p className="empty-state">No unread notifications.</p> : null}
          </div>
        </div>

        <div className="panel">
          <div className="panel-header">
            <div>
              <h2>Resources</h2>
              <p>Recently added learning materials.</p>
            </div>
            <Link className="text-link" to="/resources">Browse</Link>
          </div>
          <div className="stack-list">
            {resources.slice(0, 4).map((resource) => (
              <article key={resource.id} className="list-item">
                <strong>{resource.title}</strong>
                <span>{resource.category}</span>
              </article>
            ))}
          </div>
        </div>

        <div className="panel">
          <div className="panel-header">
            <div>
              <h2>People</h2>
              <p>Active platform users by role.</p>
            </div>
            <Link className="text-link" to="/users">Manage</Link>
          </div>
          <div className="role-summary">
            {[
              ["Interns", users.filter((user) => user.role === "intern").length],
              ["Supervisors", users.filter((user) => user.role === "supervisor").length],
              ["Admins", users.filter((user) => user.role === "admin").length],
            ].map(([label, count]) => (
              <div key={label}><span>{label}</span><strong>{count}</strong></div>
            ))}
          </div>
        </div>
      </section>
    </AppShell>
  );
}
