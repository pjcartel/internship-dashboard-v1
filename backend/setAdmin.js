const admin = require("./firebaseAdmin");

// replace with the real Firebase Auth UID
const uid = "USER_UID_HERE";

async function makeAdmin() {
  try {
    await admin.auth().setCustomUserClaims(uid, { role: "admin" });
    console.log("Admin role assigned successfully");
    process.exit(0);
  } catch (error) {
    console.error("Error setting admin role:", error);
    process.exit(1);
  }
}

makeAdmin();