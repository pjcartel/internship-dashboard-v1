const functions = require("firebase-functions");
const admin = require("firebase-admin");

admin.initializeApp();

exports.setUserRole = functions.https.onCall(async (data, context) => {
  // 1. Must be authenticated
  if (!context.auth) {
    throw new functions.https.HttpsError(
      "unauthenticated",
      "User must be logged in"
    );
  }

  // 2. Must be admin (from token, NOT request body)
  if (context.auth.token.role !== "admin") {
    throw new functions.https.HttpsError(
      "permission-denied",
      "Only admins can assign roles"
    );
  }

  const { uid, role } = data;

  const validRoles = ["intern", "supervisor", "admin"];

  if (!validRoles.includes(role)) {
    throw new functions.https.HttpsError(
      "invalid-argument",
      "Invalid role"
    );
  }

  await admin.auth().setCustomUserClaims(uid, { role });

  return {
    message: `Role ${role} assigned to ${uid}`,
  };
});