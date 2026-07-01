import { useMemo, useState } from "react";
import AppShell from "../components/AppShell";
import { useAppData } from "../context/AppDataContext";
import { useAuth } from "../context/AuthContext";

const initialForm = {
  title: "",
  description: "",
  assignedToUid: "",
  deadline: "",
  priority: "Medium",
};

export default function Task() {
  const { currentUser, role } = useAuth();
  const { tasks, users, addTask, updateTask } = useAppData();

  const [form, setForm] = useState(initialForm);
  const [message, setMessage] = useState("");
  const [filter, setFilter] = useState("all");
  const [search, setSearch] = useState("");
  const [sortBy, setSortBy] = useState("deadline");

  const interns = users.filter((u) => u.role === "intern");

  const canCreate = role === "admin" || role === "supervisor";

  const updateField = (field, value) => {
    setForm((prev) => ({ ...prev, [field]: value }));
  };

  const visibleTasks = useMemo(() => {
    let scoped =
      role === "intern"
        ? tasks.filter((t) => t.assignedToUid === currentUser.uid)
        : [...tasks];

    if (filter !== "all") {
      scoped = scoped.filter((t) => t.status === filter);
    }

    if (search.trim()) {
      const q = search.toLowerCase();
      scoped = scoped.filter(
        (t) =>
          t.title.toLowerCase().includes(q) ||
          (t.description || "").toLowerCase().includes(q) ||
          (t.assignedTo || "").toLowerCase().includes(q)
      );
    }

    if (sortBy === "deadline") {
      scoped.sort((a, b) =>
        (a.deadline || "").localeCompare(b.deadline || "")
      );
    } else if (sortBy === "newest") {
      scoped.sort((a, b) => new Date(b.createdAt || 0) - new Date(a.createdAt || 0));
    } else if (sortBy === "status") {
      scoped.sort((a, b) => a.status.localeCompare(b.status));
    }

    return scoped;
  }, [tasks, role, currentUser.uid, filter, search, sortBy]);

  const stats = {
    total: visibleTasks.length,
    pending: visibleTasks.filter((t) => t.status === "pending").length,
    progress: visibleTasks.filter((t) => t.status === "in-progress").length,
    submitted: visibleTasks.filter((t) => t.status === "submitted").length,
    completed: visibleTasks.filter((t) => t.status === "completed").length,
  };

  const handleCreate = (e) => {
    e.preventDefault();
    setMessage("");

    const assignee = interns.find((u) => u.uid === form.assignedToUid);

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
      priority: form.priority,
    });

    setForm(initialForm);
    setMessage("Task created successfully.");
  };

  const handleSubmission = (task, value) => {
    updateTask(task.id, {
      submission: value,
      status: value.trim() ? "in-progress" : task.status,
    });
  };
  const isOverdue = (deadline, status) => {

    if (!deadline) return false;
  
    if (status === "completed") return false;
  
    return new Date(deadline) < new Date();
  
  };
  const badge = (status) => {

    const base="status-badge";
    
    switch(status){
    
    case "completed":
    return `${base} green`;
    
    case "submitted":
    return `${base} purple`;
    
    case "in-progress":
    return `${base} blue`;
    
    default:
    return `${base} yellow`;
    
    }
    
    
  };

  return (
    <AppShell
      title="Task Management"
      description="Create, assign and track tasks across interns and supervisors."
    >
      {/* STATS */}
      <div

className="metric-row"

style={{

marginBottom:25

}}

>
        <div className="metric-card"><span>Total</span><strong>{stats.total}</strong></div>
        <div className="metric-card"><span>Pending</span><strong>{stats.pending}</strong></div>
        <div className="metric-card"><span>In Progress</span><strong>{stats.progress}</strong></div>
        <div className="metric-card"><span>Completed</span><strong>{stats.completed}</strong></div>
      </div>

      {/* CONTROLS */}
      <div className="panel" style={{ display: "grid", gap: 10, gridTemplateColumns: "2fr 1fr 1fr" }}>
        <input
          placeholder="Search tasks..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />

        <select value={filter} onChange={(e) => setFilter(e.target.value)}>
          <option value="all">All</option>
          <option value="pending">Pending</option>
          <option value="in-progress">In Progress</option>
          <option value="submitted">Submitted</option>
          <option value="completed">Completed</option>
        </select>

        <select value={sortBy} onChange={(e) => setSortBy(e.target.value)}>
          <option value="deadline">Deadline</option>
          <option value="newest">Newest</option>
          <option value="status">Status</option>
        </select>
      </div>

      <div className="split-layout">

        {/* CREATE TASK */}
        {canCreate && (
          <form className="panel" onSubmit={handleCreate}>
            <h2>Create Task</h2>

            <input
              placeholder="Title"
              value={form.title}
              onChange={(e) => updateField("title", e.target.value)}
              required
            />

            <textarea
              placeholder="Description"
              value={form.description}
              onChange={(e) => updateField("description", e.target.value)}
            />

            <select
              value={form.assignedToUid}
              onChange={(e) => updateField("assignedToUid", e.target.value)}
              required
            >
              <option value="">Assign to intern</option>
              {interns.map((u) => (
                <option key={u.uid} value={u.uid}>
                  {u.fullName} ({u.email})
                </option>
              ))}
            </select>

            <input
              type="date"
              value={form.deadline}
              onChange={(e) => updateField("deadline", e.target.value)}
            />

            <select
              value={form.priority}
              onChange={(e) => updateField("priority", e.target.value)}
            >
              <option>Low</option>
              <option>Medium</option>
              <option>High</option>
            </select>

            {message && (

<div className="success-banner">

✓ {message}

</div>

)}

            <button className="button primary" type="submit">
              Create Task
            </button>
          </form>
        )}

        {/* TASK LIST */}
        <div className="panel">
        <div className="panel-header">

<h2>

Tasks

</h2>

<span>

Showing {visibleTasks.length} task(s)

</span>

</div>
          {visibleTasks.map((task) => (
            <div

            key={task.id}
            
            className="task-card"
            
            style={{
            
            transition:"0.3s",
            
            cursor:"pointer"
            
            }}
            
            >
              <div className="task-header">
                <strong>{task.title}</strong>
                <span
style={{
marginLeft:10,
padding:"4px 10px",
borderRadius:20,
background:
task.priority==="High"
?"#fee2e2"
:task.priority==="Medium"
?"#fef3c7"
:"#dcfce7",
fontSize:12,
fontWeight:600
}}
>

{task.priority}

</span>
                <span className={badge(task.status)}>
                  {task.status}
                </span>
              </div>

              <p>{task.description}</p>
              <div className="task-progress">

<div className="progress-header">
  <span>Progress</span>

  <span>
    {task.status === "completed"
      ? "100%"
      : task.status === "submitted"
      ? "80%"
      : task.status === "in-progress"
      ? "50%"
      : "10%"}
  </span>

</div>

<div className="progress-track">

  <div
    className="progress-fill"
    style={{
      width:
        task.status === "completed"
          ? "100%"
          : task.status === "submitted"
          ? "80%"
          : task.status === "in-progress"
          ? "50%"
          : "10%"
    }}
  />

</div>

</div>
<small>
<br />

Created:

{task.createdAt
? new Date(task.createdAt).toLocaleDateString()
: "Today"}

Assigned to: {task.assignedTo}

<br />

Deadline:

<span
style={{
color: isOverdue(task.deadline, task.status)
? "#dc2626"
: "#555",
fontWeight: 600
}}
>

{task.deadline || "Not set"}

</span>

</small> 

              <textarea
                placeholder="Add progress or submission"
                value={task.submission || ""}
                onChange={(e) =>
                  handleSubmission(task, e.target.value)
                }
              />
            </div>
          ))}

          {visibleTasks.length === 0 && (
            <div className="empty-state">

            <h3>No Tasks Found</h3>
            
            <p>
            
            Try changing the search term or filter.
            
            </p>
            
            </div>
          )}
        </div>
      </div>
    </AppShell>
  );
}
