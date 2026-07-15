/**
 * Tenant isolation tests for firestore.rules.
 *
 * Run with the Firebase emulator:
 *   firebase emulators:exec --only firestore "npm test"
 *
 * Requires: @firebase/rules-unit-testing (npm i -D @firebase/rules-unit-testing)
 */
const {
  initializeTestEnvironment,
  assertFails,
  assertSucceeds,
} = require("@firebase/rules-unit-testing");
const fs = require("fs");

let testEnv;

beforeAll(async () => {
  testEnv = await initializeTestEnvironment({
    projectId: "internship-dashboard-test",
    firestore: {
      rules: fs.readFileSync("firestore.rules", "utf8"),
    },
  });
});

afterAll(async () => {
  await testEnv.cleanup();
});

beforeEach(async () => {
  await testEnv.clearFirestore();
});

function authedAs(claims) {
  return testEnv.authenticatedContext(claims.uid || "user-1", claims).firestore();
}

describe("Tenant isolation", () => {
  test("a user cannot read another tenant's task documents", async () => {
    // Seed a task under tenant-a, bypassing rules.
    await testEnv.withSecurityRulesDisabled(async (ctx) => {
      await ctx
        .firestore()
        .doc("tenants/tenant-a/tasks/task-1")
        .set({ title: "Tenant A Task", assignedToUid: "intern-a", status: "pending" });
    });

    const tenantBAdmin = authedAs({ uid: "admin-b", tenantId: "tenant-b", role: "admin" });
    await assertFails(tenantBAdmin.doc("tenants/tenant-a/tasks/task-1").get());

    const tenantAAdmin = authedAs({ uid: "admin-a", tenantId: "tenant-a", role: "admin" });
    await assertSucceeds(tenantAAdmin.doc("tenants/tenant-a/tasks/task-1").get());
  });

  test("an intern cannot update another intern's task submission", async () => {
    await testEnv.withSecurityRulesDisabled(async (ctx) => {
      await ctx
        .firestore()
        .doc("tenants/tenant-a/tasks/task-1")
        .set({ title: "Task", assignedToUid: "intern-a", status: "pending" });
    });

    const otherIntern = authedAs({ uid: "intern-b", tenantId: "tenant-a", role: "intern" });
    await assertFails(
      otherIntern.doc("tenants/tenant-a/tasks/task-1").update({ submission: "sneaky edit" })
    );

    const ownerIntern = authedAs({ uid: "intern-a", tenantId: "tenant-a", role: "intern" });
    await assertSucceeds(
      ownerIntern.doc("tenants/tenant-a/tasks/task-1").update({ submission: "my work" })
    );
  });

  test("supervisor cannot read another tenant's config/odoo secrets ref", async () => {
    await testEnv.withSecurityRulesDisabled(async (ctx) => {
      await ctx
        .firestore()
        .doc("tenants/tenant-a/config/odoo")
        .set({ url: "https://a.odoo.com", apiKeyRef: "secret-ref-a" });
    });

    const tenantBSupervisor = authedAs({
      uid: "sup-b",
      tenantId: "tenant-b",
      role: "supervisor",
    });
    await assertFails(tenantBSupervisor.doc("tenants/tenant-a/config/odoo").get());

    // Even within the correct tenant, a supervisor (not admin) cannot read
    // integration config.
    const tenantASupervisor = authedAs({
      uid: "sup-a",
      tenantId: "tenant-a",
      role: "supervisor",
    });
    await assertFails(tenantASupervisor.doc("tenants/tenant-a/config/odoo").get());

    const tenantAAdmin = authedAs({ uid: "admin-a", tenantId: "tenant-a", role: "admin" });
    await assertSucceeds(tenantAAdmin.doc("tenants/tenant-a/config/odoo").get());
  });

  test("a signed-out user cannot read anything", async () => {
    await testEnv.withSecurityRulesDisabled(async (ctx) => {
      await ctx
        .firestore()
        .doc("tenants/tenant-a/tasks/task-1")
        .set({ title: "Task" });
    });

    const anon = testEnv.unauthenticatedContext().firestore();
    await assertFails(anon.doc("tenants/tenant-a/tasks/task-1").get());
  });

  test("superAdmins collection is never client-writable", async () => {
    const superAdmin = authedAs({ uid: "sa-1", superAdmin: true });
    await assertFails(superAdmin.doc("superAdmins/sa-1").set({ role: "owner" }));
  });
});
