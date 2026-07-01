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

  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState("all");

  const visibleTasks =
    role === "intern"
      ? tasks.filter((task) => task.assignedToUid === currentUser.uid)
      : tasks;

  const selectedTask = visibleTasks.find((task) => task.id === taskId);

  const visibleFeedback = useMemo(() => {
    const taskIds = new Set(visibleTasks.map((task) => task.id));

    let list = feedback.filter((item) => taskIds.has(item.taskId));

    if (filter !== "all") {
      list = list.filter(
        (item) => item.rating === Number(filter)
      );
    }

    if (search.trim()) {
      const q = search.toLowerCase();

      list = list.filter((item) => {
        const task = tasks.find((t) => t.id === item.taskId);

        return (
          item.comment.toLowerCase().includes(q) ||
          (task?.title || "").toLowerCase().includes(q) ||
          (task?.assignedTo || "").toLowerCase().includes(q)
        );
      });
    }

    return list;
  }, [feedback, visibleTasks, filter, search, tasks]);

  const averageRating =
    visibleFeedback.length === 0
      ? 0
      : (
          visibleFeedback.reduce(
            (sum, item) => sum + item.rating,
            0
          ) / visibleFeedback.length
        ).toFixed(1);

  const stats = {
    total: visibleFeedback.length,
    five: visibleFeedback.filter((f) => f.rating === 5).length,
    four: visibleFeedback.filter((f) => f.rating === 4).length,
    pending: visibleTasks.length - visibleFeedback.length,
  };

  const renderStars = (value) => {
    let stars = "";

    for (let i = 1; i <= 5; i++) {
      stars += i <= value ? "★" : "☆";
    }

    return stars;
  };

  const ratingColor = (rating) => {
    switch (rating) {
      case 5:
        return "#16a34a";
      case 4:
        return "#2563eb";
      case 3:
        return "#d97706";
      case 2:
        return "#dc2626";
      default:
        return "#991b1b";
    }
  };

  const handleSubmit = (event) => {
    event.preventDefault();

    setMessage("");

    if (!taskId || !comment.trim()) {
      setMessage(
        "Select a task and write feedback before submitting."
      );
      return;
    }

    addFeedback({
      taskId,
      comment: comment.trim(),
      rating: Number(rating),
      supervisorId: currentUser.uid,
    });

    setTaskId("");
    setComment("");
    setRating("4");

    setMessage(
      "✔ Feedback submitted successfully."
    );
  };

  return (
    <AppShell
      title="Feedback"
      description="Review intern work, provide ratings and monitor progress."
    >
      {/* Statistics */}

      <section className="metric-row">

        <div className="metric-card">
          <span>Total Feedback</span>
          <strong>{stats.total}</strong>
        </div>

        <div className="metric-card">
          <span>Average Rating</span>
          <strong>{averageRating}</strong>
        </div>

        <div className="metric-card">
          <span>5★ Reviews</span>
          <strong>{stats.five}</strong>
        </div>

        <div className="metric-card">
          <span>Pending Reviews</span>
          <strong>{stats.pending}</strong>
        </div>

      </section>

      {/* Search + Filter */}

      <div
        className="panel"
        style={{
          display: "grid",
          gridTemplateColumns: "2fr 1fr",
          gap: 12,
          marginBottom: 20,
        }}
      >
        <input
          type="text"
          placeholder="Search feedback..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />

        <select
          value={filter}
          onChange={(e) => setFilter(e.target.value)}
        >
          <option value="all">All Ratings</option>
          <option value="5">★★★★★</option>
          <option value="4">★★★★☆</option>
          <option value="3">★★★☆☆</option>
          <option value="2">★★☆☆☆</option>
          <option value="1">★☆☆☆☆</option>
        </select>
      </div>

      <section className="split-layout">

        {/* Submit Feedback */}

        <form
          className="panel form-panel"
          onSubmit={handleSubmit}
        >

          <div className="panel-header">
            <h2>Submit Feedback</h2>
          </div>

          <div className="field-group">

            <label>Task</label>

            <select
              value={taskId}
              onChange={(e) =>
                setTaskId(e.target.value)
              }
              required
            >
              <option value="">
                Select task
              </option>

              {visibleTasks.map((task) => (
                <option
                  key={task.id}
                  value={task.id}
                >
                  {task.title}
                </option>
              ))}

            </select>

          </div>

          {selectedTask && (

            <div className="context-box">

              <strong>
                {selectedTask.assignedTo}
              </strong>

              <span>
                {selectedTask.description ||
                  "No description available."}
              </span>

            </div>

          )}

          <div className="field-group">

            <label>Rating</label>

            <select
              value={rating}
              onChange={(e) =>
                setRating(e.target.value)
              }
            >
              <option value="5">
                5 - Excellent
              </option>

              <option value="4">
                4 - Very Good
              </option>

              <option value="3">
                3 - Good
              </option>

              <option value="2">
                2 - Needs Improvement
              </option>

              <option value="1">
                1 - Poor
              </option>

            </select>

          </div>

          <div className="field-group">

            <label>Comment</label>

            <textarea
              rows="5"
              value={comment}
              onChange={(e) =>
                setComment(e.target.value)
              }
              required
            />

          </div>

          {message && (
            <div className="success-banner">
              {message}
            </div>
          )}

          <button
            className="button primary"
            type="submit"
          >
            Submit Feedback
          </button>

        </form>

                {/* Feedback History */}

                <div className="panel list-panel">

<div className="panel-header">

  <div>
    <h2>Feedback History</h2>
    <p>{visibleFeedback.length} record(s)</p>
  </div>

</div>

<div className="stack-list roomy">

  {visibleFeedback.map((item) => {

    const task = tasks.find(
      (t) => t.id === item.taskId
    );

    return (

      <article
        key={item.id}
        className="list-item bordered"
        style={{
          padding: "18px",
          borderRadius: "10px",
          marginBottom: "16px",
          transition: "0.3s",
        }}
      >

        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            marginBottom: "10px",
          }}
        >

          <div>

            <strong
              style={{
                fontSize: "18px",
              }}
            >
              {task?.title || "Archived Task"}
            </strong>

            <br />

            <small>

              Assigned to:

              {" "}

              {task?.assignedTo || "Unknown"}

            </small>

          </div>

          <div
            style={{
              color: ratingColor(item.rating),
              fontWeight: "bold",
              fontSize: "18px",
            }}
          >
            {renderStars(item.rating)}
          </div>

        </div>

        <p
          style={{
            margin: "12px 0",
          }}
        >
          {item.comment}
        </p>

        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            flexWrap: "wrap",
            marginTop: "10px",
          }}
        >

          <small>

            Rating:

            {" "}

            <strong>{item.rating}/5</strong>

          </small>

          <small>

            {item.createdAt
              ? new Date(
                  item.createdAt
                ).toLocaleDateString()
              : "Today"}

          </small>

        </div>

      </article>

    );

  })}

  {visibleFeedback.length === 0 && (

    <div
      className="empty-state"
      style={{
        textAlign: "center",
        padding: "50px 20px",
      }}
    >

      <div
        style={{
          fontSize: "48px",
        }}
      >
        💬
      </div>

      <h3>No Feedback Yet</h3>

      <p>

        Once supervisors review intern work,

        feedback will appear here.

      </p>

    </div>

  )}

</div>

</div>

</section>

</AppShell>

);

}