import { createContext, useContext, useState } from "react";
import { createInitialData } from "../data/seedData";

const STORAGE_KEY = "internship-dashboard-data-v2";
const AppDataContext = createContext(null);

function loadData() {
  try {
    const saved = window.localStorage.getItem(STORAGE_KEY);
    if (saved) {
      return JSON.parse(saved);
    }
  } catch (error) {
    console.warn("Unable to load saved dashboard data", error);
  }
  return createInitialData();
}

function persistData(nextData) {
  try {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(nextData));
  } catch (error) {
    console.warn("Unable to persist dashboard data", error);
  }
}

function makeId(prefix) {
  return `${prefix}-${Date.now()}-${Math.random().toString(16).slice(2, 8)}`;
}

function nowIso() {
  return new Date().toISOString();
}

export function AppDataProvider({ children }) {
  const [data, setData] = useState(loadData);

  const updateData = (recipe) => {
    setData((current) => {
      const next = recipe(current);
      persistData(next);
      return next;
    });
  };

  const addUser = (user) => {
    const uid = user.uid || makeId("user");
    updateData((current) => ({
      ...current,
      users: [...current.users, { ...user, uid }],
      profiles: {
        ...current.profiles,
        [uid]: {
          email: user.email,
          fullName: user.fullName || "",
          department: user.department || "",
          phone: user.phone || "",
          role: user.role || "intern",
          bio: user.bio || "",
        },
      },
    }));
    return uid;
  };

  const updateUserRole = (uid, role) => {
    updateData((current) => ({
      ...current,
      users: current.users.map((user) => (user.uid === uid ? { ...user, role } : user)),
      profiles: {
        ...current.profiles,
        [uid]: {
          ...(current.profiles[uid] || {}),
          role,
        },
      },
    }));
  };

  const updateProfile = (uid, profile) => {
    updateData((current) => ({
      ...current,
      profiles: {
        ...current.profiles,
        [uid]: {
          ...(current.profiles[uid] || {}),
          ...profile,
        },
      },
      users: current.users.map((user) =>
        user.uid === uid
          ? {
              ...user,
              fullName: profile.fullName ?? user.fullName,
              department: profile.department ?? user.department,
              phone: profile.phone ?? user.phone,
              bio: profile.bio ?? user.bio,
            }
          : user
      ),
    }));
  };

  const addNotification = ({ title, message, category, recipientUid = "all" }) => {
    updateData((current) => ({
      ...current,
      notifications: [
        {
          id: makeId("note"),
          title,
          message,
          category,
          recipientUid,
          read: false,
          createdAt: nowIso(),
        },
        ...current.notifications,
      ],
    }));
  };

  const addTask = (task) => {
    const id = makeId("task");
    updateData((current) => ({
      ...current,
      tasks: [
        {
          id,
          status: "pending",
          submission: "",
          createdAt: nowIso(),
          updatedAt: nowIso(),
          ...task,
        },
        ...current.tasks,
      ],
      notifications: [
        {
          id: makeId("note"),
          title: "New Task Assigned",
          message: `${task.title} is assigned to ${task.assignedTo || "an intern"}.`,
          category: "Task Alerts",
          recipientUid: task.assignedToUid || "all",
          read: false,
          createdAt: nowIso(),
        },
        ...current.notifications,
      ],
    }));
    return id;
  };

  const updateTask = (id, updates) => {
    updateData((current) => ({
      ...current,
      tasks: current.tasks.map((task) =>
        task.id === id ? { ...task, ...updates, updatedAt: nowIso() } : task
      ),
    }));
  };

  const addFeedback = (feedback) => {
    updateData((current) => {
      const task = current.tasks.find((item) => item.id === feedback.taskId);
      return {
        ...current,
        feedback: [
          {
            id: makeId("feedback"),
            createdAt: nowIso(),
            ...feedback,
          },
          ...current.feedback,
        ],
        notifications: [
          {
            id: makeId("note"),
            title: "Feedback Added",
            message: task ? `Feedback was added to ${task.title}.` : "New feedback is available.",
            category: "Feedback Alerts",
            recipientUid: task?.assignedToUid || "all",
            read: false,
            createdAt: nowIso(),
          },
          ...current.notifications,
        ],
      };
    });
  };

  const addResource = (resource) => {
    updateData((current) => ({
      ...current,
      resources: [
        {
          id: makeId("resource"),
          createdAt: nowIso(),
          ...resource,
        },
        ...current.resources,
      ],
      notifications: [
        {
          id: makeId("note"),
          title: "Resource Published",
          message: `${resource.title} was added to the resource library.`,
          category: "Resource Updates",
          recipientUid: "all",
          read: false,
          createdAt: nowIso(),
        },
        ...current.notifications,
      ],
    }));
  };

  const markNotificationRead = (id) => {
    updateData((current) => ({
      ...current,
      notifications: current.notifications.map((note) =>
        note.id === id ? { ...note, read: true } : note
      ),
    }));
  };

  const deleteNotification = (id) => {
    updateData((current) => ({
      ...current,
      notifications: current.notifications.filter((note) => note.id !== id),
    }));
  };

  const resetDemoData = () => {
    const initial = createInitialData();
    persistData(initial);
    setData(initial);
  };

  const value = {
    ...data,
    addUser,
    updateUserRole,
    updateProfile,
    addTask,
    updateTask,
    addFeedback,
    addResource,
    addNotification,
    markNotificationRead,
    deleteNotification,
    resetDemoData,
  };

  return <AppDataContext.Provider value={value}>{children}</AppDataContext.Provider>;
}

export function useAppData() {
  const context = useContext(AppDataContext);
  if (!context) {
    throw new Error("useAppData must be used inside AppDataProvider");
  }
  return context;
}
