import { useMemo, useState } from "react";
import AppShell from "../components/AppShell";
import { useAppData } from "../context/AppDataContext";
import { useAuth } from "../context/AuthContext";

const initialForm = { title: "", description: "", assignedToUid: "", deadline: "" };

export default function Task() {
  const { currentUser, role } = useAuth();
  const { tasks, users, addTask, updateTask } = useAppData();
  const [form, setForm] = useState(initialForm);
  const [message, setMessage] = useState("");
  const [filter, setFilter] = useState("all");

  const interns = users.filter((user) => user.role === "intern");
  const visibleTasks = useMemo(() => {
    const scoped = role === "intern" ? tasks.filter((task) => task.assignedToUid === currentUser.uid) : tasks;
    return filter === "all" ? scoped : scoped.filter((task) => task.status === filter);
  }, [tasks, role, currentUser.uid, filter]);

  const canCreate = role === "admin" || role === "supervisor";

  const updateField = (field, value) => setForm((current) => ({ ...current, [field]: value }));

  const handleCreate = (event) => {
    event.preventDefault();
    setMessage("");
    const assignee = interns.find((user) => user.uid === form.assignedToUid);
    if (!form.title.trim() || !assignee) {
      setMessage("Task title and assignee are required.");
      return;
    }
    addTask({
      title: form.title.trim(),
      description: form.description.trim(),
      assignedToUid: assignee.uid,
      assignedTo: assignee.email,
      supervisorUid: currentUser.uid,
      deadline: form.deadline,
    });
    setForm(initialForm);
    setMessage("Task created and notification sent.");
  };

  const handleSubmission = (task, submission) => {
    updateTask(task.id, { submission, status: submission.trim() ? "in-progress" : task.status });
  };

  return (
    <AppShell title="Tasks" description="Create, assign, submit, and track internship work.">
      <section className="split-layout">
        {canCreate ? (
          <form className="panel form-panel" onSubmit={handleCreate}>
            <div className="panel-header"><h2>Create task</h2></div>
            <div className="field-group">
              <label htmlFor="taskTitle">Task title</label>
              <input id="taskTitle" value={form.title} onChange={(event) => updateField("title", event.target.value)} required />
            </div>
            <div className="field-group">
              <label htmlFor="taskDescription">Description</label>
              <textarea id="taskDescription" rows="4" value={form.description} onChange={(event) => updateField("description", event.target.value)} />
            </div>
            <div className="field-group">
              <label htmlFor="assignedTo">Assign to intern</label>
              <select id="assignedTo" value={form.assignedToUid} onChange={(event) => updateField("assignedToUid", event.target.value)} required>
                <option value="">Select intern</option>
                {interns.map((intern) => <option key={intern.uid} value={intern.uid}>{intern.fullName} - {intern.email}</option>)}
              </select>
            </div>
            <div className="field-group">
              <label htmlFor="deadline">Deadline</label>
              <input id="deadline" type="date" value={form.deadline} onChange={(event) => updateField("deadline", event.target.value)} />
            </div>
            {message ? <p className={message.includes("required") ? "form-error" : "form-success"}>{message}</p> : null}
            <button className="button primary" type="submit">Add task</button>
          </form>
        ) : null}

        <div className="panel list-panel">
          <div className="panel-header aligned">
            <div><h2>Task list</h2><p>{visibleTasks.length} visible tasks</p></div>
            <select aria-label="Filter tasks" value={filter} onChange={(event) => setFilter(event.target.value)}>
              <option value="all">All statuses</option>
              <option value="pending">Pending</option>
              <option value="in-progress">In progress</option>
              <option value="submitted">Submitted</option>
              <option value="completed">Completed</option>
            </select>
          </div>

          <div className="task-list">
            {visibleTasks.map((task) => (
              <article key={task.id} className="task-row">
                <div>
                  <h3>{task.title}</h3>
                  <p>{task.description || "No description provided."}</p>
                  <dl className="inline-meta">
                    <div><dt>Owner</dt><dd>{task.assignedTo}</dd></div>
                    <div><dt>Deadline</dt><dd>{task.deadline || "Not set"}</dd></div>
                  </dl>
                </div>
                <div className="task-actions">
                  <label htmlFor={`status-${task.id}`}>Status</label>
                  <select id={`status-${task.id}`} value={task.status} onChange={(event) => updateTask(task.id, { status: event.target.value })}>
                    <option value="pending">Pending</option>
                    <option value="in-progress">In progress</option>
                    <option value="submitted">Submitted</option>
                    <option value="completed">Completed</option>
                  </select>
                  <label htmlFor={`submission-${task.id}`}>Work note</label>
                  <textarea id={`submission-${task.id}`} rows="3" value={task.submission || ""} onChange={(event) => handleSubmission(task, event.target.value)} placeholder="Add submission or progress note" />
                </div>
              </article>
            ))}
            {visibleTasks.length === 0 ? <p className="empty-state">No tasks match this view.</p> : null}
          </div>
        </div>
      </section>
    </AppShell>
  );
}
