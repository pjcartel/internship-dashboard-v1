# Firestore & Storage Security Rules — Setup Notes

These implement multi-tenant isolation per Section 5/6 of the Master
Specification. They are the enforcement layer — application code should
never be relied on alone to prevent cross-tenant access.

## Prerequisites: custom claims

Every authenticated user **must** have these Firebase Auth custom claims set
server-side (via the Admin SDK, in `backend/`) before these rules will work
as intended:

| Claim | Type | Example | Set for |
|---|---|---|---|
| `tenantId` | string | `"softlink-internal"` | Admin, Supervisor, Intern |
| `role` | string | `"admin"` \| `"supervisor"` \| `"intern"` | Admin, Supervisor, Intern |
| `superAdmin` | boolean | `true` | Softlink staff only |

`server.js`'s existing `/set-role` endpoint currently only sets `role` — it
needs to be extended to also set `tenantId` at user-creation time, and a new
`/tenants` (Super Admin only) endpoint is needed to set `superAdmin: true`
for Softlink staff accounts. This is called out as a Phase 2/3 task in the
Roadmap (Section 12).

## Deploying

```bash
firebase deploy --only firestore:rules,storage:rules
```

## Testing before every deploy (per NFR-1 / AC-5)

```bash
npm install -D @firebase/rules-unit-testing jest
firebase emulators:exec --only firestore "npx jest firestore.rules.test.js"
```

The included `firestore.rules.test.js` covers:
- Cross-tenant reads are blocked (Tenant B cannot read Tenant A's tasks)
- Interns can only edit their own task submission, not another intern's
- Integration config (`config/odoo`) is admin-only, even within the correct tenant
- Signed-out users get nothing
- `superAdmins` documents are never client-writable

Add a new test here **any time a new collection or rule is added** — this
suite is what should catch a future contributor (human or AI) accidentally
loosening isolation.

## Known gaps to close next (see Section 13, Known Issues)

- `tenantId` custom claim isn't set anywhere in the current backend yet —
  rules are ready, but nothing issues the claim until the backend is updated.
- No emulator test run has been executed in this environment (sandboxed,
  no network) — run the test suite locally or in CI before first deploy.
