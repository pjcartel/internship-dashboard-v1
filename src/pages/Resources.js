import { useMemo, useState } from "react";
import AppShell from "../components/AppShell";
import { useAppData } from "../context/AppDataContext";
import { useAuth } from "../context/AuthContext";

const initialForm = { title: "", link: "", category: "Frontend", fileName: "" };

export default function Resources() {
  const { currentUser, role } = useAuth();
  const { resources, addResource } = useAppData();
  const [form, setForm] = useState(initialForm);
  const [category, setCategory] = useState("all");
  const [message, setMessage] = useState("");
  const canManage = role === "admin" || role === "supervisor";

  const categories = useMemo(() => ["all", ...Array.from(new Set(resources.map((resource) => resource.category)))], [resources]);
  const visibleResources = category === "all" ? resources : resources.filter((resource) => resource.category === category);

  const updateField = (field, value) => setForm((current) => ({ ...current, [field]: value }));

  const handleAdd = (event) => {
    event.preventDefault();
    setMessage("");
    if (!form.title.trim() || (!form.link.trim() && !form.fileName.trim())) {
      setMessage("Add a title and either a link or file reference.");
      return;
    }
    addResource({ ...form, title: form.title.trim(), link: form.link.trim(), uploadedBy: currentUser.uid });
    setForm(initialForm);
    setMessage("Resource added and shared with the team.");
  };

  return (
    <AppShell title="Resources" description="Upload documents, store links, categorize materials, and keep references easy to access.">
      <section className="split-layout">
        {canManage ? (
          <form className="panel form-panel" onSubmit={handleAdd}>
            <div className="panel-header"><h2>Add resource</h2></div>
            <div className="field-group">
              <label htmlFor="resourceTitle">Title</label>
              <input id="resourceTitle" value={form.title} onChange={(event) => updateField("title", event.target.value)} required />
            </div>
            <div className="field-group">
              <label htmlFor="resourceCategory">Category</label>
              <input id="resourceCategory" value={form.category} onChange={(event) => updateField("category", event.target.value)} required />
            </div>
            <div className="field-group">
              <label htmlFor="resourceLink">Resource link</label>
              <input id="resourceLink" type="url" value={form.link} onChange={(event) => updateField("link", event.target.value)} placeholder="https://" />
            </div>
            <div className="field-group">
              <label htmlFor="resourceFile">Document upload</label>
              <input id="resourceFile" type="file" onChange={(event) => updateField("fileName", event.target.files?.[0]?.name || "")} />
              {form.fileName ? <span className="helper-text">Selected: {form.fileName}</span> : <span className="helper-text">Local demo stores the file name; Firebase Storage can store the file in production.</span>}
            </div>
            {message ? <p className={message.startsWith("Add") ? "form-error" : "form-success"}>{message}</p> : null}
            <button className="button primary" type="submit">Add resource</button>
          </form>
        ) : null}

        <div className="panel list-panel">
          <div className="panel-header aligned">
            <div><h2>Resource library</h2><p>{visibleResources.length} materials</p></div>
            <select aria-label="Filter resources" value={category} onChange={(event) => setCategory(event.target.value)}>
              {categories.map((item) => <option key={item} value={item}>{item === "all" ? "All categories" : item}</option>)}
            </select>
          </div>
          <div className="resource-grid">
            {visibleResources.map((resource) => (
              <article key={resource.id} className="resource-card">
                <div>
                  <strong>{resource.title}</strong>
                  <span>{resource.category}</span>
                </div>
                <p>{resource.fileName ? `File: ${resource.fileName}` : "External learning link"}</p>
                {resource.link ? <a className="button secondary" href={resource.link} target="_blank" rel="noreferrer">Open resource</a> : <button className="button secondary" type="button" disabled>File reference saved</button>}
              </article>
            ))}
            {visibleResources.length === 0 ? <p className="empty-state">No resources in this category.</p> : null}
          </div>
        </div>
      </section>
    </AppShell>
  );
}
