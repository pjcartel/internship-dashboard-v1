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

ChartJS.register(CategoryScale, LinearScale, BarElement, Tooltip, Legend, ArcElement);

export default function Analytics() {
  const { tasks, feedback, resources, users } = useAppData();
  const statuses = ["pending", "in-progress", "submitted", "completed"];
  const statusCounts = statuses.map((status) => tasks.filter((task) => task.status === status).length);
  const resourceCategories = Array.from(new Set(resources.map((resource) => resource.category)));
  const roleLabels = ["intern", "supervisor", "admin"];

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: { legend: { position: "bottom" } },
  };

  const statusData = {
    labels: ["Pending", "In progress", "Submitted", "Completed"],
    datasets: [{ data: statusCounts, backgroundColor: ["#d9d2c5", "#b7c7b4", "#8aa899", "#2f6f5e"] }],
  };

  const feedbackData = {
    labels: tasks.map((task) => task.title),
    datasets: [{ label: "Feedback", data: tasks.map((task) => feedback.filter((item) => item.taskId === task.id).length), backgroundColor: "#2f6f5e" }],
  };

  const resourcesData = {
    labels: resourceCategories,
    datasets: [{ label: "Resources", data: resourceCategories.map((category) => resources.filter((resource) => resource.category === category).length), backgroundColor: "#7b8d7a" }],
  };

  const usersData = {
    labels: roleLabels.map((label) => label.charAt(0).toUpperCase() + label.slice(1)),
    datasets: [{ label: "Users", data: roleLabels.map((item) => users.filter((user) => user.role === item).length), backgroundColor: "#3d443f" }],
  };

  return (
    <AppShell title="Analytics" description="Monitor task completion, feedback activity, resource usage, and user distribution.">
      <section className="analytics-grid">
        <div className="panel chart-panel"><div className="panel-header"><h2>Task completion</h2></div><Pie data={statusData} options={options} /></div>
        <div className="panel chart-panel"><div className="panel-header"><h2>Feedback by task</h2></div><Bar data={feedbackData} options={options} /></div>
        <div className="panel chart-panel"><div className="panel-header"><h2>Resources by category</h2></div><Bar data={resourcesData} options={options} /></div>
        <div className="panel chart-panel"><div className="panel-header"><h2>Users by role</h2></div><Bar data={usersData} options={options} /></div>
      </section>
    </AppShell>
  );
}
