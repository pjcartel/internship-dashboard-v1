# Internship Dashboard Product Audit

Audit date: 2026-06-24
Capture tool: Playwright browser against `http://localhost:3000`
Destination: local folder `audit/internship-dashboard/`

## Audit Scope

The audit covers the implemented root React app after the DOCX-driven build pass. The reviewed flow includes login/demo entry, admin dashboard, task management, resources, notifications, analytics, mobile dashboard reflow, and a short role-scoped interaction path.

## Screenshot Steps

1. `01-login.png` - Login and demo entry screen. Health: good.
2. `02-dashboard.png` - Admin dashboard overview. Health: good.
3. `03-tasks.png` - Task creation and task list. Health: good.
4. `04-resources.png` - Resource creation and library. Health: good.
5. `05-notifications.png` - Notification groups and read/delete actions. Health: good.
6. `06-analytics.png` - Task, feedback, resource, and user charts. Health: good.
7. `07-mobile-dashboard.png` - Mobile dashboard reflow at 390px width. Health: good.

## UX Strengths

- The app starts with a clear login screen and three role demo actions, so reviewers can enter admin, supervisor, or intern workflows without Firebase credentials.
- The sidebar preserves the DOCX module structure: Dashboard, Tasks, Feedback, Resources, Notifications, Users, Analytics, and Profile.
- Task and resource forms use visible labels, inline success/error messages, and clear required fields.
- Notifications support read/delete actions and are scoped by recipient; an admin-created task notification appeared in the intern notification view.
- Mobile reflow keeps the sidebar, metrics, tables, and panels within the viewport with no horizontal overflow in the checked 390px viewport.

## UX Risks

- Production role changes are still represented locally in the root app. Real Firebase custom-claim updates need the Cloud Function or Express backend wired into the UI.
- Resource uploads in demo mode store the selected file name only. Production file handling should upload to Firebase Storage and store a download URL in Firestore.
- The app has useful demo data but no explicit reset control in the UI. Repeated reviews can accumulate localStorage records.
- Notifications are recipient-scoped, which is correct, but admins may expect to see all system notifications. A future admin filter could clarify that distinction.

## Accessibility Risks

- The main forms and navigation are label-driven and reachable by semantic selectors in Playwright, which is a good baseline.
- Chart.js canvases are visual-first. Add text summaries or data tables for task completion, feedback, resources, and user role counts before relying on analytics for assistive-technology users.
- The local audit did not include a full keyboard-only pass, screen reader pass, or automated contrast measurement. Screenshot evidence alone is not enough to claim WCAG compliance.
- Disabled file-reference buttons communicate state visually, but production upload/download states should include explicit status text for assistive technologies.

## Interaction Checks

- Admin demo login navigated to the dashboard.
- Admin task creation succeeded and the new task appeared in the task list.
- Admin resource creation succeeded and the new resource appeared in the resources list.
- Task assignment generated a notification scoped to the assigned intern.
- Intern demo login exposed the assigned task notification.
- Mobile dashboard had `scrollWidth` equal to `clientWidth` at 390px, so no horizontal overflow was detected.

## Evidence Limits

- `view_image` could not open saved screenshot files because the environment's filesystem sandbox repeatedly failed with `bwrap: Creating new namespace failed`. Screenshot existence, dimensions, live browser DOM, and Playwright captures were verified instead.
- Product Design Figma placement was not performed because no Figma destination was provided; evidence was saved locally.
- Firebase production behavior was not fully exercised because demo mode is intentionally local. Build and UI behavior were verified, but Firestore security rules, Storage uploads, and custom claims still need deployment-level validation.
