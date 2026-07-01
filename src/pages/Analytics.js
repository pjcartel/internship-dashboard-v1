import AppShell from "../components/AppShell";
import { useAppData } from "../context/AppDataContext";
import { Bar, Pie } from "react-chartjs-2";
import {
  ArcElement,
  BarElement,
  CategoryScale,
  Chart as ChartJS,
  Legend,
  LinearScale,
  Tooltip,
} from "chart.js";

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Tooltip,
  Legend,
  ArcElement
);

export default function Analytics() {
  const { tasks, feedback, resources, users } = useAppData();

  const statuses = [
    "pending",
    "in-progress",
    "submitted",
    "completed",
  ];

  const roleLabels = [
    "intern",
    "supervisor",
    "admin",
  ];

  const statusCounts = statuses.map(
    (status) =>
      tasks.filter(
        (task) => task.status === status
      ).length
  );

  const completed =
    tasks.filter(
      (task) => task.status === "completed"
    ).length;

  const completionRate =
    tasks.length === 0
      ? 0
      : Math.round(
          (completed / tasks.length) * 100
        );

  const averageRating =
    feedback.length === 0
      ? 0
      : (
          feedback.reduce(
            (sum, item) => sum + item.rating,
            0
          ) / feedback.length
        ).toFixed(1);

  const resourceCategories = Array.from(
    new Set(
      resources.map(
        (resource) => resource.category
      )
    )
  );

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: "bottom",
      },
    },
  };

  const statusData = {
    labels: [
      "Pending",
      "In Progress",
      "Submitted",
      "Completed",
    ],
    datasets: [
      {
        data: statusCounts,
        backgroundColor: [
          "#F59E0B",
          "#3B82F6",
          "#8B5CF6",
          "#22C55E",
        ],
      },
    ],
  };

  const feedbackData = {
    labels: tasks.map(
      (task) => task.title
    ),
    datasets: [
      {
        label: "Feedback",
        data: tasks.map(
          (task) =>
            feedback.filter(
              (item) =>
                item.taskId === task.id
            ).length
        ),
        backgroundColor: "#2563EB",
      },
    ],
  };

  const resourcesData = {
    labels: resourceCategories,
    datasets: [
      {
        label: "Resources",
        data: resourceCategories.map(
          (category) =>
            resources.filter(
              (resource) =>
                resource.category === category
            ).length
        ),
        backgroundColor: "#10B981",
      },
    ],
  };

  const usersData = {
    labels: roleLabels.map(
      (role) =>
        role.charAt(0).toUpperCase() +
        role.slice(1)
    ),
    datasets: [
      {
        label: "Users",
        data: roleLabels.map(
          (role) =>
            users.filter(
              (user) =>
                user.role === role
            ).length
        ),
        backgroundColor: "#6366F1",
      },
    ],
  };

  const latestTask = tasks.at(-1);
  const latestFeedback = feedback.at(-1);
  const latestResource = resources.at(-1);

  return (
    <AppShell
      title="Analytics"
      description="Monitor internship performance, task completion, feedback, resources and user growth."
    >

      {/* Executive Summary */}

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
          <span>Completed</span>
          <strong>{completed}</strong>
        </div>

        <div className="metric-card">
          <span>Completion Rate</span>
          <strong>{completionRate}%</strong>
        </div>

        <div className="metric-card">
          <span>Resources</span>
          <strong>{resources.length}</strong>
        </div>

        <div className="metric-card">
          <span>Average Rating</span>
          <strong>{averageRating}/5</strong>
        </div>

      </section>

      {/* Progress Overview */}

      <section className="dashboard-grid">

        <div className="panel">

          <div className="panel-header">

            <h2>Task Completion</h2>

          </div>

          <div className="progress-track">

            <div
              className="progress-fill"
              style={{
                width: `${completionRate}%`,
              }}
            />

          </div>

          <p
            style={{
              marginTop: 10,
            }}
          >
            {completionRate}% of all assigned tasks
            have been completed.
          </p>

        </div>

        <div className="panel">

          <div className="panel-header">

            <h2>Recent Activity</h2>

          </div>

          <div className="stack-list">

            <div className="list-item">

              <strong>Latest Task</strong>

              <span>
                {latestTask
                  ? latestTask.title
                  : "No tasks"}
              </span>

            </div>

            <div className="list-item">

              <strong>Latest Feedback</strong>

              <span>
                {latestFeedback
                  ? `${latestFeedback.rating}/5 Rating`
                  : "No feedback"}
              </span>

            </div>

            <div className="list-item">

              <strong>Latest Resource</strong>

              <span>
                {latestResource
                  ? latestResource.title
                  : "No resources"}
              </span>

            </div>

          </div>

        </div>

      </section>

      {/* Charts */}

      <section className="analytics-grid">
                {/* Task Status */}

                <div className="panel chart-panel">

<div className="panel-header">
  <h2>Task Status</h2>
</div>

<div style={{ height: "320px" }}>
  <Pie data={statusData} options={options} />
</div>

</div>

{/* Feedback Distribution */}

<div className="panel chart-panel">

<div className="panel-header">
  <h2>Feedback by Task</h2>
</div>

<div style={{ height: "320px" }}>
  <Bar data={feedbackData} options={options} />
</div>

</div>

{/* Resources */}

<div className="panel chart-panel">

<div className="panel-header">
  <h2>Resources by Category</h2>
</div>

<div style={{ height: "320px" }}>
  <Bar
    data={resourcesData}
    options={options}
  />
</div>

</div>

{/* Users */}

<div className="panel chart-panel">

<div className="panel-header">
  <h2>User Distribution</h2>
</div>

<div style={{ height: "320px" }}>
  <Bar
    data={usersData}
    options={options}
  />
</div>

</div>

</section>

{/* Bottom Summary */}

<section
className="dashboard-grid"
style={{ marginTop: "30px" }}
>

<div className="panel">

<div className="panel-header">
  <h2>Task Summary</h2>
</div>

<div className="stack-list">

  <div className="list-item">
    <strong>Pending</strong>
    <span>{statusCounts[0]}</span>
  </div>

  <div className="list-item">
    <strong>In Progress</strong>
    <span>{statusCounts[1]}</span>
  </div>

  <div className="list-item">
    <strong>Submitted</strong>
    <span>{statusCounts[2]}</span>
  </div>

  <div className="list-item">
    <strong>Completed</strong>
    <span>{statusCounts[3]}</span>
  </div>

</div>

</div>

<div className="panel">

<div className="panel-header">
  <h2>User Breakdown</h2>
</div>

<div className="stack-list">

  <div className="list-item">
    <strong>Interns</strong>
    <span>
      {
        users.filter(
          (u) => u.role === "intern"
        ).length
      }
    </span>
  </div>

  <div className="list-item">
    <strong>Supervisors</strong>
    <span>
      {
        users.filter(
          (u) =>
            u.role === "supervisor"
        ).length
      }
    </span>
  </div>

  <div className="list-item">
    <strong>Administrators</strong>
    <span>
      {
        users.filter(
          (u) => u.role === "admin"
        ).length
      }
    </span>
  </div>

</div>

</div>

<div className="panel">

<div className="panel-header">
  <h2>Platform Overview</h2>
</div>

<div className="stack-list">

  <div className="list-item">
    <strong>Total Feedback</strong>
    <span>{feedback.length}</span>
  </div>

  <div className="list-item">
    <strong>Total Resources</strong>
    <span>{resources.length}</span>
  </div>

  <div className="list-item">
    <strong>Completion Rate</strong>
    <span>{completionRate}%</span>
  </div>

  <div className="list-item">
    <strong>Average Rating</strong>
    <span>{averageRating}/5</span>
  </div>

</div>

</div>

</section>

</AppShell>

);

}
