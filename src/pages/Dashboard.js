import { useAuth } from "../context/AuthContext";
import { useState, useEffect } from "react";
import { db } from "../firebase";
import { collection, onSnapshot } from "firebase/firestore";

export default function Dashboard() {
  const { currentUser, logout } = useAuth();
  const [unreadCount, setUnreadCount] = useState(0);

  useEffect(() => {
    // Listen to notifications collection in Firestore
    const unsubscribe = onSnapshot(collection(db, "notifications"), (snapshot) => {
      // Count only unread notifications (if you add a 'read' field later)
      const count = snapshot.docs.filter(doc => !doc.data().read).length;
      setUnreadCount(count);
    });
    return () => unsubscribe();
  }, []);

  return (
    <div className="flex h-screen">
      {/* Sidebar */}
      <aside className="w-64 bg-gray-800 text-white p-4">
        <h2 className="text-xl font-bold mb-6">Internship Dashboard</h2>
        <nav>
          <ul>
            <li className="mb-4"><a href="/tasks">Tasks</a></li>
            <li className="mb-4"><a href="/feedback">Feedback</a></li>
            <li className="mb-4"><a href="/analytics">Analytics</a></li>
            <li className="mb-4"><a href="/users">User Management</a></li>
            <li className="mb-4"><a href="/resources">Resources</a></li>
            <li className="mb-4 flex items-center gap-2">
              <a href="/notifications">Notifications</a>
              {unreadCount > 0 && (
                <span className="bg-red-500 text-white text-xs px-2 py-1 rounded-full">
                  {unreadCount}
                </span>
              )}
            </li>
          </ul>
        </nav>
      </aside>

      {/* Main Content */}
      <main className="flex-1 p-6 bg-gray-50">
        <h1 className="text-2xl font-semibold mb-4">Welcome to your dashboard</h1>

        {currentUser && (
          <div className="mb-4">
            <p className="text-lg">Logged in as:</p>
            <p className="font-semibold">{currentUser.email}</p>
          </div>
        )}

        <button
          onClick={logout}
          className="bg-red-500 text-white px-4 py-2 rounded"
        >
          Logout
        </button>
      </main>
    </div>
  );
}

  