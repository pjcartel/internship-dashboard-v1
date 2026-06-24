import React, { useState, useEffect } from "react";
import { db } from "../firebase";
import { collection, onSnapshot, query, orderBy } from "firebase/firestore";

export default function Notifications() {
  const [notifications, setNotifications] = useState([]);
  const [openCategories, setOpenCategories] = useState({});

  useEffect(() => {
    const q = query(collection(db, "notifications"), orderBy("timestamp", "desc"));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      setNotifications(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })));
    });
    return () => unsubscribe();
  }, []);

  // Group notifications by category
  const grouped = notifications.reduce((acc, note) => {
    const cat = note.category || "General";
    if (!acc[cat]) acc[cat] = [];
    acc[cat].push(note);
    return acc;
  }, {});

  const toggleCategory = (cat) => {
    setOpenCategories(prev => ({ ...prev, [cat]: !prev[cat] }));
  };

  // Icon + color mapping
  const categoryStyles = {
    "Task Alerts": { icon: "📋", color: "bg-blue-300" },
    "Feedback Alerts": { icon: "💬", color: "bg-green-300" },
    "Resource Updates": { icon: "📂", color: "bg-orange-300" },
    "General": { icon: "🔔", color: "bg-gray-300" }
  };

  return (
    <div className="p-6">
      <h2 className="text-2xl font-bold mb-4">Notifications</h2>

      {Object.keys(grouped).map((cat) => {
        const { icon, color } = categoryStyles[cat] || categoryStyles["General"];
        return (
          <div key={cat} className="mb-6 border rounded shadow">
            <button
              onClick={() => toggleCategory(cat)}
              className={`w-full text-left px-4 py-2 font-semibold flex justify-between items-center ${color}`}
            >
              <span>
                {icon} {cat}
              </span>
              <span>{openCategories[cat] ? "▲" : "▼"}</span>
            </button>

            {openCategories[cat] && (
              <ul className="p-4">
                {grouped[cat].map((note) => (
                  <li key={note.id} className="mb-3 border-b pb-2">
                    <p className="font-semibold">{note.title}</p>
                    <p className="text-sm text-gray-600">{note.message}</p>
                    <p className="text-xs text-gray-400">
                      {new Date(note.timestamp?.toDate()).toLocaleString()}
                    </p>
                  </li>
                ))}
              </ul>
            )}
          </div>
        );
      })}
    </div>
  );
}
