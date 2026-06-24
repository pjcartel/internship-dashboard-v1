import React, { useState, useEffect } from "react";
import { db } from "../firebase";
import { collection, addDoc, getDocs } from "firebase/firestore";
import { createNotification } from "../utils/notifications";

export default function Feedback() {
  const [tasks, setTasks] = useState([]);
  const [selectedTask, setSelectedTask] = useState("");
  const [feedbackText, setFeedbackText] = useState("");
  const [taskDetails, setTaskDetails] = useState(null);
  const [loading, setLoading] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");
  const [errorMessage, setErrorMessage] = useState("");

  const supervisorId = "supervisor123"; // Replace with AuthContext

  const fetchTasks = async () => {
    const snapshot = await getDocs(collection(db, "tasks"));
    const allTasks = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    const filteredTasks = allTasks.filter(task => task.supervisorId === supervisorId);
    setTasks(filteredTasks);
  };

  useEffect(() => { fetchTasks(); }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMessage(""); setSuccessMessage("");

    if (!selectedTask) {
      setErrorMessage("Please select a task.");
      return;
    }
    if (!feedbackText.trim()) {
      setErrorMessage("Feedback cannot be empty.");
      return;
    }

    setLoading(true);
    try {
      await addDoc(collection(db, "feedback"), {
        taskId: selectedTask,
        feedbackText,
        givenBy: supervisorId,
        timestamp: new Date(),
      });

      await createNotification(
        "New Feedback Received",
        `Feedback added for Task: ${taskDetails?.title || selectedTask}`,
        "Feedback Alerts"
      );

      setSelectedTask(""); setFeedbackText(""); setTaskDetails(null);
      setSuccessMessage("Feedback submitted successfully!");
    } catch (err) {
      setErrorMessage("Error submitting feedback. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleTaskSelect = (taskId) => {
    setSelectedTask(taskId);
    const task = tasks.find(t => t.id === taskId);
    setTaskDetails(task || null);
  };

  return (
    <div className="p-6">
      <h2 className="text-2xl font-bold mb-4">Submit Feedback</h2>
      <form onSubmit={handleSubmit} className="flex flex-col gap-2 max-w-lg">
        <select value={selectedTask} onChange={(e) => handleTaskSelect(e.target.value)}
          className="border p-2 rounded">
          <option value="">Select a Task</option>
          {tasks.map((task) => (
            <option key={task.id} value={task.id}>{task.title}</option>
          ))}
        </select>

        {taskDetails && (
          <div className="bg-gray-100 p-3 rounded mb-2">
            <p><strong>Title:</strong> {taskDetails.title}</p>
            <p><strong>Description:</strong> {taskDetails.description || "No description provided"}</p>
            <p><strong>Deadline:</strong> {taskDetails.deadline || "No deadline set"}</p>
          </div>
        )}

        <textarea placeholder="Enter feedback" value={feedbackText}
          onChange={(e) => setFeedbackText(e.target.value)} className="border p-2 rounded" />

        {errorMessage && <p className="text-red-500 text-sm">{errorMessage}</p>}
        {successMessage && <p className="text-green-600 text-sm">{successMessage}</p>}

        <button type="submit" disabled={loading}
          className="bg-green-500 text-white py-2 rounded hover:bg-green-600 disabled:opacity-50">
          {loading ? "Submitting..." : "Submit Feedback"}
        </button>
      </form>
    </div>
  );
}
