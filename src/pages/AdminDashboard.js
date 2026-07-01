import { Link } from "react-router-dom";
import AppShell from "../components/AppShell";
import { useAppData } from "../context/AppDataContext";

function statusCount(tasks, status) {
  return tasks.filter((task) => task.status === status).length;
}

export default function AdminDashboard() {
  const {
    users,
    tasks,
    feedback,
    resources,
    notifications,
  } = useAppData();

  const interns = users.filter(
    (user) => user.role === "intern"
  ).length;

  const supervisors = users.filter(
    (user) => user.role === "supervisor"
  ).length;

  const admins = users.filter(
    (user) => user.role === "admin"
  ).length;

  const completed = statusCount(tasks, "completed");
  const pending = statusCount(tasks, "pending");
  const inProgress = statusCount(tasks, "in-progress");

  const unread = notifications.filter(
    (note) => !note.read
  );

  const latestTasks = [...tasks]
    .sort(
      (a, b) =>
        new Date(b.updatedAt) -
        new Date(a.updatedAt)
    )
    .slice(0, 5);

  const latestResources = [...resources]
    .sort(
      (a, b) =>
        new Date(b.createdAt) -
        new Date(a.createdAt)
    )
    .slice(0, 5);

  const latestFeedback = [...feedback]
    .sort(
      (a, b) =>
        new Date(b.createdAt) -
        new Date(a.createdAt)
    )
    .slice(0, 5);

  return (
    <AppShell
      title="Admin Dashboard"
      description="Administrative overview of the Internship Management System."
    >

      {/* Statistics */}

      <section className="metric-row">

        <div className="metric-card">
          <span>Total Users</span>
          <strong>{users.length}</strong>
        </div>

        <div className="metric-card">
          <span>Total Tasks</span>
          <strong>{tasks.length}</strong>
        </div>

        <div className="metric-card">
          <span>Resources</span>
          <strong>{resources.length}</strong>
        </div>

        <div className="metric-card">
          <span>Unread Notifications</span>
          <strong>{unread.length}</strong>
        </div>

      </section>

      <section className="dashboard-grid">

        {/* LEFT PANEL */}

        <div className="panel large-panel">

          <div className="panel-header">
            <div>
              <h2>Platform Overview</h2>
              <p>
                Current internship programme statistics.
              </p>
            </div>
          </div>

          <div className="role-summary">

            <div>
              <span>Interns</span>
              <strong>{interns}</strong>
            </div>

            <div>
              <span>Supervisors</span>
              <strong>{supervisors}</strong>
            </div>

            <div>
              <span>Administrators</span>
              <strong>{admins}</strong>
            </div>

            <div>
              <span>Total Feedback</span>
              <strong>{feedback.length}</strong>
            </div>

            <div>
              <span>Total Resources</span>
              <strong>{resources.length}</strong>
            </div>

          </div>

          <br />

<div className="panel">

  <div className="panel-header">
    <div>
      <h2>System Health</h2>
      <p>Live overview of platform data integrity.</p>
    </div>
  </div>

  <div className="role-summary">

    <div>
      <span>Total Records</span>
      <strong>
        {users.length +
          tasks.length +
          feedback.length +
          resources.length}
      </strong>
    </div>

    <div>
      <span>Active Users</span>
      <strong>{users.length}</strong>
    </div>

    <div>
      <span>Notifications</span>
      <strong>{notifications.length}</strong>
    </div>

    <div>
      <span>Status</span>
      <strong style={{ color: "green" }}>
        Healthy
      </strong>
    </div>

    <div>
      <span>Last Update</span>
      <strong>
        {new Date().toLocaleDateString()}
      </strong>
    </div>

  </div>

</div>


          <br />

<div className="panel">

  <div className="panel-header">
    <div>
      <h2>Overall Completion</h2>
      <p>Internship task completion progress.</p>
    </div>
  </div>

  <h1
    style={{
      fontSize: "48px",
      color: "#2563eb",
      marginBottom: "10px",
    }}
  >
    {tasks.length === 0
      ? 0
      : Math.round((completed / tasks.length) * 100)}
    %
  </h1>

  <progress
    value={completed}
    max={tasks.length || 1}
    style={{
      width: "100%",
      height: "20px",
    }}
  />

  <p
    style={{
      marginTop: "12px",
      color: "#666",
    }}
  >
    {completed} of {tasks.length} tasks have been completed.
  </p>

</div>

          <br />

          <div className="panel-header">
            <div>
              <h2>Task Summary</h2>
              <p>
                Overall progress across all internship tasks.
              </p>
            </div>
          </div>

          <table>

            <thead>

              <tr>
                <th>Status</th>
                <th>Total</th>
              </tr>

            </thead>

            <tbody>

              <tr>
                <td>Completed</td>
                <td>{completed}</td>
              </tr>

              <tr>
                <td>In Progress</td>
                <td>{inProgress}</td>
              </tr>

              <tr>
                <td>Pending</td>
                <td>{pending}</td>
              </tr>

              <tr>
                <td>Total Tasks</td>
                <td>{tasks.length}</td>
              </tr>

            </tbody>

          </table>

          <br />

          <div className="panel-header">
            <div>
              <h2>Latest Tasks</h2>
              <p>
                Recently updated internship work.
              </p>
            </div>

            <Link
              className="text-link"
              to="/tasks"
            >
              View All
            </Link>

          </div>

          <div className="stack-list">

            {latestTasks.map((task) => (

              <article
                key={task.id}
                className="list-item"
              >

                <strong>
                  {task.title}
                </strong>

                <span>
                  {task.description}
                </span>

                <small>
                  Status: {task.status}
                </small>

              </article>

            ))}

          </div>

        </div>

                {/* RIGHT COLUMN */}

                <div>

{/* Recent Resources */}

<div className="panel">

  <div className="panel-header">
    <div>
      <h2>Recent Resources</h2>
      <p>Latest learning materials.</p>
    </div>

    <Link
      className="text-link"
      to="/resources"
    >
      Browse
    </Link>
  </div>

  <div className="stack-list">

    {latestResources.length > 0 ? (
      latestResources.map((resource) => (
        <article
          key={resource.id}
          className="list-item"
        >
          <strong>{resource.title}</strong>

          <span>
            {resource.category}
          </span>

          <small>
            {resource.fileName || "External Link"}
          </small>

        </article>
      ))
    ) : (
      <p className="empty-state">
        No resources available.
      </p>
    )}

  </div>

</div>

<br />

{/* Recent Feedback */}

<div className="panel">

  <div className="panel-header">

    <div>
      <h2>Latest Feedback</h2>
      <p>Supervisor comments.</p>
    </div>

    <Link
      className="text-link"
      to="/feedback"
    >
      View
    </Link>

  </div>

  <div className="stack-list">

    {latestFeedback.length > 0 ? (
      latestFeedback.map((item) => (
        <article
          key={item.id}
          className="list-item"
        >

          <strong>
            Rating: {item.rating}/5
          </strong>

          <span>
            {item.comment}
          </span>

        </article>
      ))
    ) : (
      <p className="empty-state">
        No feedback yet.
      </p>
    )}

  </div>

</div>

<br />

{/* Notifications */}

<div className="panel">

  <div className="panel-header">

    <div>
      <h2>Notifications</h2>
      <p>Most recent updates.</p>
    </div>

    <Link
      className="text-link"
      to="/notifications"
    >
      Open
    </Link>

  </div>

  <div className="stack-list">

    {notifications.slice(0,5).map((note)=>(
      <article
        key={note.id}
        className="list-item"
      >

        <strong>
          {note.title}
        </strong>

        <span>
          {note.message}
        </span>

        <small>
          {note.category}
        </small>

      </article>
    ))}

  </div>

</div>

<br />

{/* Quick Actions */}

<div className="panel">

  <div className="panel-header">
    <div>
      <h2>Quick Actions</h2>
      <p>Administrative shortcuts.</p>
    </div>
  </div>

  <div
    style={{
      display:"grid",
      gridTemplateColumns:"repeat(2,1fr)",
      gap:"10px"
    }}
  >

    <Link
      className="button primary"
      to="/users"
    >
      Manage Users
    </Link>

    <Link
      className="button primary"
      to="/tasks"
    >
      Manage Tasks
    </Link>

    <Link
      className="button secondary"
      to="/analytics"
    >
      Analytics
    </Link>

    <Link
      className="button secondary"
      to="/resources"
    >
      Resources
    </Link>

  </div>

</div>

</div>

</section>

</AppShell>

);
}