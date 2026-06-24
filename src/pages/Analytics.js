import React, { useState, useEffect } from "react";
import { db } from "../firebase";
import { collection, onSnapshot } from "firebase/firestore";
import { Bar, Pie } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement,
} from "chart.js";

// Register Chart.js components
ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend, ArcElement);

export default function Analytics() {
  const [taskStats, setTaskStats] = useState({ completed: 0, pending: 0 });
  const [feedbackStats, setFeedbackStats] = useState({});
  const [resourceStats, setResourceStats] = useState({});
  const [userStats, setUserStats] = useState([]);
  const [taskCount, setTaskCount] = useState(0);
  const [feedbackCount, setFeedbackCount] = useState(0);

  useEffect(() => {
    // 🔹 Real-time listener for tasks
    const unsubscribeTasks = onSnapshot(collection(db, "tasks"), (snapshot) => {
      let completed = 0, pending = 0;
      const tasks = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      snapshot.forEach(doc => {
        const data = doc.data();
        if (data.status === "completed") completed++;
        else pending++;
      });
      setTaskStats({ completed, pending });
      setTaskCount(snapshot.size);

      // Update per-user stats later with feedback
      setUserStats(prev => prev.map(u => ({
        ...u,
        tasks: tasks.filter(t => t.assignedTo === u.email).length
      })));
    });

    // 🔹 Real-time listener for feedback
    const unsubscribeFeedback = onSnapshot(collection(db, "feedback"), (snapshot) => {
      const feedback = snapshot.docs.map(doc => doc.data());
      const feedbackCountMap = {};
      snapshot.forEach(doc => {
        const data = doc.data();
        feedbackCountMap[data.taskId] = (feedbackCountMap[data.taskId] || 0) + 1;
      });
      setFeedbackStats(feedbackCountMap);
      setFeedbackCount(snapshot.size);

      setUserStats(prev => prev.map(u => ({
        ...u,
        feedback: feedback.filter(f => f.supervisorId === u.email).length
      })));
    });

    // 🔹 Real-time listener for resources
    const unsubscribeResources = onSnapshot(collection(db, "resources"), (snapshot) => {
      const resourceCountMap = {};
      snapshot.forEach(doc => {
        const data = doc.data();
        resourceCountMap[data.title] = (resourceCountMap[data.title] || 0) + 1;
      });
      setResourceStats(resourceCountMap);
    });

    // 🔹 Real-time listener for users
    const unsubscribeUsers = onSnapshot(collection(db, "users"), (snapshot) => {
      const users = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      setUserStats(users.map(user => ({
        email: user.email,
        tasks: 0, // updated by tasks listener
        feedback: 0, // updated by feedback listener
      })));
    });

    // Cleanup listeners
    return () => {
      unsubscribeTasks();
      unsubscribeFeedback();
      unsubscribeResources();
      unsubscribeUsers();
    };
  }, []);

  // 🔹 Chart Data
  const taskCompletionData = {
    labels: ["Completed", "Pending"],
    datasets: [{ data: [taskStats.completed, taskStats.pending], backgroundColor: ["#4CAF50", "#FF9800"] }],
  };

  const feedbackFrequencyData = {
    labels: Object.keys(feedbackStats),
    datasets: [{ label: "Feedback Count", data: Object.values(feedbackStats), backgroundColor: "#2196F3" }],
  };

  const resourceUsageData = {
    labels: Object.keys(resourceStats),
    datasets: [{ label: "Resource Count", data: Object.values(resourceStats), backgroundColor: "#9C27B0" }],
  };

  const overallData = {
    labels: ["Tasks", "Feedback"],
    datasets: [{ label: "Counts", data: [taskCount, feedbackCount], backgroundColor: ["#007bff", "#28a745"] }],
  };

  const perUserData = {
    labels: userStats.map(u => u.email),
    datasets: [
      { label: "Tasks Completed", data: userStats.map(u => u.tasks), backgroundColor: "#007bff" },
      { label: "Feedback Given", data: userStats.map(u => u.feedback), backgroundColor: "#28a745" },
    ],
  };

  const options = {
    responsive: true,
    plugins: { legend: { position: "top" }, title: { display: true, text: "Internship Dashboard Analytics" } },
  };

  return (
    <div className="p-6">
      <h2 className="text-2xl font-bold mb-6">Analytics Dashboard</h2>

      {/* Project Overview */}
      <h3 className="text-xl font-semibold mb-2">Project Overview</h3>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
        <div><h4 className="font-semibold mb-2">Task Completion</h4><Pie data={taskCompletionData} /></div>
        <div><h4 className="font-semibold mb-2">Feedback Frequency</h4><Bar data={feedbackFrequencyData} options={options} /></div>
      </div>
      <div className="mb-8"><h4 className="font-semibold mb-2">Resource Usage</h4><Bar data={resourceUsageData} options={options} /></div>

      {/* Overall Totals */}
      <h3 className="text-xl font-semibold mb-2">Overall Totals</h3>
      <div className="max-w-lg mb-4"><Bar data={overallData} options={options} /></div>
      <p>Total Tasks: {taskCount}</p>
      <p>Total Feedback: {feedbackCount}</p>

      {/* Per-User Breakdown */}
      <h3 className="text-xl font-semibold mt-8 mb-2">Per-User Breakdown</h3>
      <div className="max-w-4xl"><Bar data={perUserData} options={options} /></div>
    </div>
  );
}
