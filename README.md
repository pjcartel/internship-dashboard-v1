# Internship Dashboard Management System

A React and Firebase internship management platform for interns, supervisors, and administrators. The app centralizes internship tasks, feedback, resources, notifications, user roles, profile data, and analytics in one dashboard workspace.

The implementation follows the requirements in `/home/blkkk/Downloads/Internship Dashboard Management System.docx` and includes a local demo mode so the application can be reviewed without live Firebase credentials.

## What It Does

- Authenticates users with Firebase email/password sign-in and registration.
- Provides protected routes with session-aware loading states.
- Supports role-aware demo access for administrator, supervisor, and intern workflows.
- Lets interns view assigned tasks, submit progress notes, access resources, view notifications, and manage their profile.
- Lets supervisors create tasks, review work, add feedback, publish resources, and track progress.
- Lets administrators manage users, assign roles, monitor analytics, manage resources, and oversee activity.
- Tracks task status, feedback, resources, notifications, profiles, and users through a shared data model.
- Provides analytics charts for task completion, feedback volume, resource categories, and users by role.

## Tech Stack

- React.js with Create React App
- React Router DOM
- Tailwind CSS and custom app CSS
- Firebase Authentication
- Firebase Firestore
- Firebase Storage
- Chart.js and `react-chartjs-2`
- Express and Firebase Admin SDK in the optional local backend
- Firebase Cloud Functions for server-side role assignment

## Project Structure

```text
.
|-- src/
|   |-- components/          # App shell, protected route, shared UI helpers
|   |-- context/             # Auth state and app data state
|   |-- data/                # Seed data for local demo mode
|   |-- pages/               # Auth, dashboard, tasks, feedback, resources, notifications, users, analytics, profile
|   |-- utils/               # Firebase notification helper
|   `-- firebase.js          # Client Firebase services
|-- backend/                 # Optional Express API using Firebase Admin SDK
|-- functions/               # Firebase Cloud Functions codebase
|-- admin-dashboard/         # Separate admin dashboard prototype
|-- firebase.json            # Firebase Functions config
|-- package.json             # Root app dependencies and scripts
`-- tailwind.config.js       # Tailwind v3 config
```

## Core Modules

| Module | Status | Notes |
| --- | --- | --- |
| Authentication | Implemented | Firebase login/register plus local role demo access. |
| Dashboard | Implemented | Sidebar navigation, user info, notification count, module summaries, logout. |
| Profile Management | Implemented | Full name, department, phone, role, bio, and local persistence. |
| Task Management | Implemented | Task creation, assignment, status tracking, progress notes, notifications. |
| Feedback | Implemented | Task-linked feedback, progress rating, history, notifications. |
| Resources | Implemented | Links, file references, categories, filtering, resource notifications. |
| Notifications | Implemented | Task, feedback, and resource updates with read/delete actions. |
| User Management | Implemented | User directory, local user creation, role assignment. |
| Analytics | Implemented | Task, feedback, user, and resource charts. |

## Demo Access

Run the app and use one of the demo buttons on the login screen:

| Demo role | Email shown in app | Purpose |
| --- | --- | --- |
| Administrator | `admin@softlink.com` | Manage users, roles, resources, analytics, and activity. |
| Supervisor | `supervisor@softlink.com` | Assign tasks, review work, add feedback, and share resources. |
| Intern | `intern@softlink.com` | View assigned work, submit progress notes, access resources, and update profile. |

Demo data is stored in `localStorage` under `internship-dashboard-data-v2`. It is intentionally local so reviewers can test workflows without changing production Firebase data.

## Firebase Setup

The client Firebase configuration currently lives in `src/firebase.js`. For another Firebase project, replace that config or move it to environment variables.

Enable these Firebase services for production use:

- Authentication with email/password provider.
- Cloud Firestore for app collections.
- Cloud Storage for uploaded resource documents.
- Cloud Functions if using server-side custom role assignment.

The local backend requires a Firebase Admin service account file at:

```text
backend/serviceAccountKey.json
```

Do not commit that file. It is ignored by `.gitignore`.

## Firestore Collections

The DOCX and implementation use these collections/entities:

| Collection | Purpose | Key fields |
| --- | --- | --- |
| `users` | App user records and roles | `email`, `role`, `fullName`, `department` |
| `profiles` | Personal profile details | `email`, `fullName`, `department`, `phone`, `role`, `bio` |
| `tasks` | Internship work assignments | `title`, `description`, `assignedTo`, `assignedToUid`, `supervisorUid`, `status`, `deadline` |
| `feedback` | Supervisor comments and progress evaluation | `taskId`, `comment`, `rating`, `supervisorId` |
| `resources` | Links and document metadata | `title`, `link`, `category`, `fileName`, `uploadedBy` |
| `notifications` | Real-time user updates | `title`, `message`, `category`, `recipientUid`, `read` |

## Install and Run

From the repository root:

```bash
npm install
npm start
```

The app runs at:

```text
http://localhost:3000
```

## Verify

```bash
npm test -- --watchAll=false
npm run build
```

Current verification status:

- `npm test -- --watchAll=false` passes.
- `npm run build` compiles successfully.

## Optional Local Admin API

The `backend/` directory contains an Express API for Firebase Admin tasks:

```bash
cd backend
npm install
npm start
```

It runs on `http://localhost:5000` and exposes:

| Method | Path | Purpose |
| --- | --- | --- |
| `GET` | `/users` | List Firebase Auth users and custom role claims. |
| `POST` | `/create-user` | Create a Firebase Auth user and assign a role. |
| `POST` | `/set-role` | Update a Firebase Auth user's role claim. |

The root app currently uses local demo role management for review and Firebase client registration for live accounts. Wire the root app to the backend or Cloud Function before relying on production custom-claim role changes.

## Firebase Cloud Functions

The `functions/` package defines a callable `setUserRole` function that only allows authenticated admins to assign `intern`, `supervisor`, or `admin` roles.

```bash
cd functions
npm install
npm run serve
npm run deploy
```

## Production Notes

- Add and deploy Firestore and Storage security rules before storing real internship data.
- `firebase.json` currently configures Cloud Functions only; Firebase Hosting is not configured.
- Resource uploads in local demo mode store file names. Production file storage should upload files to Firebase Storage and persist download URLs in Firestore.
- Role changes in local demo mode update local app data. Production role authorization should use Firebase custom claims through Cloud Functions or the backend API.
- npm currently reports dependency audit findings from the installed tree. Review them before production deployment.
