import { useMemo, useState } from "react";
import AppShell from "../components/AppShell";
import { useAppData } from "../context/AppDataContext";
import { useAuth } from "../context/AuthContext";

export default function Feedback() {
  const { currentUser, role } = useAuth();
  const { tasks, feedback, addFeedback } = useAppData();
  const [taskId, setTaskId] = useState("");
  const [comment, setComment] = useState("");
  const [rating, setRating] = useState("4");
  const [message, setMessage] = useState("");

  const visibleTasks = role === "intern" ? tasks.filter((task) => task.assignedToUid === currentUser.uid) : tasks;
  const selectedTask = visibleTasks.find((task) => task.id === taskId);
  const visibleFeedback = useMemo(() => {
    const taskIds = new Set(visibleTasks.map((task) => task.id));
    return feedback.filter((item) => taskIds.has(item.taskId));
  }, [feedback, visibleTasks]);

  const handleSubmit = (event) => {
    event.preventDefault();
    setMessage("");
    if (!taskId || !comment.trim()) {
      setMessage("Select a task and write feedback before submitting.");
      return;
    }
    addFeedback({ taskId, comment: comment.trim(), rating: Number(rating), supervisorId: currentUser.uid });
    setComment("");
    setTaskId("");
    setMessage("Feedback saved and notification sent.");
  };

  return (
    <AppShell title="Feedback" description="Review work, add progress notes, and keep interns informed.">
      <section className="split-layout">
        <form className="panel form-panel" onSubmit={handleSubmit}>
          <div className="panel-header"><h2>Submit feedback</h2></div>
          <div className="field-group">
            <label htmlFor="taskSelect">Task</label>
            <select id="taskSelect" value={taskId} onChange={(event) => setTaskId(event.target.value)} required>
              <option value="">Select task</option>
              {visibleTasks.map((task) => <option key={task.id} value={task.id}>{task.title}</option>)}
            </select>
          </div>
          {selectedTask ? (
            <div className="context-box">
              <strong>{selectedTask.assignedTo}</strong>
              <span>{selectedTask.description || "No description provided."}</span>
            </div>
          ) : null}
          <div className="field-group">
            <label htmlFor="rating">Progress rating</label>
            <select id="rating" value={rating} onChange={(event) => setRating(event.target.value)}>
              <option value="5">5 - Ready</option>
              <option value="4">4 - Strong progress</option>
              <option value="3">3 - Needs review</option>
              <option value="2">2 - Blocked</option>
              <option value="1">1 - At risk</option>
            </select>
          </div>
          <div className="field-group">
            <label htmlFor="comment">Feedback comment</label>
            <textarea id="comment" rows="5" value={comment} onChange={(event) => setComment(event.target.value)} required />
          </div>
          {message ? <p className={message.includes("Select") ? "form-error" : "form-success"}>{message}</p> : null}
          <button className="button primary" type="submit">Save feedback</button>
        </form>

        <div className="panel list-panel">
          <div className="panel-header"><h2>Feedback history</h2><p>{visibleFeedback.length} records</p></div>
          <div className="stack-list roomy">
            {visibleFeedback.map((item) => {
              const task = tasks.find((entry) => entry.id === item.taskId);
              return (
                <article key={item.id} className="list-item bordered">
                  <strong>{task?.title || "Archived task"}</strong>
                  <span>{item.comment}</span>
                  <small>Rating {item.rating} - {new Date(item.createdAt).toLocaleDateString()}</small>
                </article>
              );
            })}
            {visibleFeedback.length === 0 ? <p className="empty-state">No feedback has been recorded for this view.</p> : null}
          </div>
        </div>
      </section>
    </AppShell>
  );
}
