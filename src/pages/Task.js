import React, { useState } from "react";
import { db } from "../firebase";
import { collection, addDoc } from "firebase/firestore";
import { createNotification } from "../utils/notifications";

export default function Task() {
  const [taskTitle, setTaskTitle] = useState("");
  const [taskDescription, setTaskDescription] = useState("");
  const [assignedTo, setAssignedTo] = useState("");
  const [deadline, setDeadline] = useState("");
  const [loading, setLoading] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");
  const [errorMessage, setErrorMessage] = useState("");

  const supervisorId = "supervisor123"; // Replace with AuthContext

  const handleAddTask = async (e) => {
    e.preventDefault();
    setErrorMessage(""); setSuccessMessage("");

    if (!taskTitle.trim() || !assignedTo) {
      setErrorMessage("Task title and assignee are required.");
      return;
    }

    setLoading(true);
    try {
      await addDoc(collection(db, "tasks"), {
        title: taskTitle,
        description: taskDescription,
        assignedTo,
        deadline,
        supervisorId,
        timestamp: new Date(),
      });

      await createNotification(
        "New Task Assigned",
        `Task "${taskTitle}" has been assigned.`,
        "Task Alerts"
      );

      setTaskTitle(""); setTaskDescription(""); setAssignedTo(""); setDeadline("");
      setSuccessMessage("Task created successfully!");
    } catch (err) {
      setErrorMessage("Error creating task. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-6">
      <h2 className="text-2xl font-bold mb-4">Create Task</h2>
      <form onSubmit={handleAddTask} className="flex flex-col gap-2 max-w-lg">
        <input type="text" placeholder="Task Title" value={taskTitle}
          onChange={(e) => setTaskTitle(e.target.value)} className="border p-2 rounded" />
        <textarea placeholder="Task Description" value={taskDescription}
          onChange={(e) => setTaskDescription(e.target.value)} className="border p-2 rounded" />
        <input type="text" placeholder="Assign To (User ID)" value={assignedTo}
          onChange={(e) => setAssignedTo(e.target.value)} className="border p-2 rounded" />
        <input type="date" value={deadline}
          onChange={(e) => setDeadline(e.target.value)} className="border p-2 rounded" />

        {errorMessage && <p className="text-red-500 text-sm">{errorMessage}</p>}
        {successMessage && <p className="text-green-600 text-sm">{successMessage}</p>}

        <button type="submit" disabled={loading}
          className="bg-blue-500 text-white py-2 rounded hover:bg-blue-600 disabled:opacity-50">
          {loading ? "Submitting..." : "Add Task"}
        </button>
      </form>
    </div>
  );
}
