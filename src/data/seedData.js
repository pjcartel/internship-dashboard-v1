export const demoUsers = [
  {
    uid: "admin-001",
    email: "admin@softlink.com",
    role: "admin",
    fullName: "Miriam Otieno",
    department: "People Operations",
    phone: "+254 712 847 192",
    bio: "Coordinates internship placements, reporting, and program quality.",
  },
  {
    uid: "supervisor-001",
    email: "supervisor@softlink.com",
    role: "supervisor",
    fullName: "Aaron Patel",
    department: "Software Development",
    phone: "+254 722 419 680",
    bio: "Reviews intern delivery, assigns sprint work, and shares technical feedback.",
  },
  {
    uid: "intern-001",
    email: "intern@softlink.com",
    role: "intern",
    fullName: "Nia Kamau",
    department: "Frontend Engineering",
    phone: "+254 733 508 274",
    bio: "Frontend intern focused on React, accessibility, and clean UI implementation.",
  },
  {
    uid: "intern-002",
    email: "amina@softlink.com",
    role: "intern",
    fullName: "Amina Hassan",
    department: "Quality Assurance",
    phone: "+254 701 936 441",
    bio: "QA intern documenting test plans and regression notes for product releases.",
  },
];

export const demoProfiles = demoUsers.reduce((profiles, user) => {
  profiles[user.uid] = {
    email: user.email,
    fullName: user.fullName,
    department: user.department,
    phone: user.phone,
    role: user.role,
    bio: user.bio,
  };
  return profiles;
}, {});

export const demoTasks = [
  {
    id: "task-001",
    title: "Build dashboard UI shell",
    description: "Create the sidebar, header, and authenticated dashboard layout.",
    assignedToUid: "intern-001",
    assignedTo: "intern@softlink.com",
    supervisorUid: "supervisor-001",
    status: "completed",
    deadline: "2026-06-27",
    submission: "Dashboard shell pushed for review with route coverage notes.",
    createdAt: "2026-06-20T09:00:00.000Z",
    updatedAt: "2026-06-23T15:45:00.000Z",
  },
  {
    id: "task-002",
    title: "Document resource upload flow",
    description: "Write acceptance criteria for links, files, and categorization.",
    assignedToUid: "intern-002",
    assignedTo: "amina@softlink.com",
    supervisorUid: "supervisor-001",
    status: "in-progress",
    deadline: "2026-06-29",
    submission: "Draft checklist ready, pending file-state review.",
    createdAt: "2026-06-21T10:30:00.000Z",
    updatedAt: "2026-06-24T08:20:00.000Z",
  },
  {
    id: "task-003",
    title: "Validate notification states",
    description: "Confirm unread, read, and deleted notification behavior.",
    assignedToUid: "intern-001",
    assignedTo: "intern@softlink.com",
    supervisorUid: "supervisor-001",
    status: "pending",
    deadline: "2026-07-01",
    submission: "",
    createdAt: "2026-06-22T13:10:00.000Z",
    updatedAt: "2026-06-22T13:10:00.000Z",
  },
];

export const demoFeedback = [
  {
    id: "feedback-001",
    taskId: "task-001",
    comment: "Good progress. Tighten mobile spacing before the final review.",
    rating: 4,
    supervisorId: "supervisor-001",
    createdAt: "2026-06-23T16:00:00.000Z",
  },
  {
    id: "feedback-002",
    taskId: "task-002",
    comment: "Add test cases for empty resources and broken external links.",
    rating: 3,
    supervisorId: "supervisor-001",
    createdAt: "2026-06-24T11:00:00.000Z",
  },
];

export const demoResources = [
  {
    id: "resource-001",
    title: "React Fundamentals",
    link: "https://react.dev/learn",
    category: "Frontend",
    fileName: "",
    uploadedBy: "supervisor-001",
    createdAt: "2026-06-18T14:00:00.000Z",
  },
  {
    id: "resource-002",
    title: "Firestore Data Model Checklist",
    link: "https://firebase.google.com/docs/firestore/data-model",
    category: "Firebase",
    fileName: "firestore-checklist.pdf",
    uploadedBy: "admin-001",
    createdAt: "2026-06-19T12:00:00.000Z",
  },
  {
    id: "resource-003",
    title: "Accessibility Review Notes",
    link: "",
    category: "Quality Assurance",
    fileName: "a11y-review-notes.docx",
    uploadedBy: "supervisor-001",
    createdAt: "2026-06-22T08:45:00.000Z",
  },
];

export const demoNotifications = [
  {
    id: "note-001",
    title: "New Task Assigned",
    message: "Validate notification states is due on July 1.",
    category: "Task Alerts",
    recipientUid: "intern-001",
    read: false,
    createdAt: "2026-06-22T13:15:00.000Z",
  },
  {
    id: "note-002",
    title: "Feedback Added",
    message: "Feedback was added to Build dashboard UI shell.",
    category: "Feedback Alerts",
    recipientUid: "intern-001",
    read: false,
    createdAt: "2026-06-23T16:05:00.000Z",
  },
  {
    id: "note-003",
    title: "Resource Published",
    message: "Firestore Data Model Checklist is available in Resources.",
    category: "Resource Updates",
    recipientUid: "all",
    read: true,
    createdAt: "2026-06-19T12:05:00.000Z",
  },
];

export const createInitialData = () => ({
  users: demoUsers,
  profiles: demoProfiles,
  tasks: demoTasks,
  feedback: demoFeedback,
  resources: demoResources,
  notifications: demoNotifications,
});
