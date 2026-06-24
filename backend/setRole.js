const admin = require("./firebaseAdmin");

const uid = "3jPG9QVQLfTbA7x30g9fUq3fWzq2"; // REAL UID

async function setRole() {
  try {
    await admin.auth().setCustomUserClaims(uid, {
      role: "admin"
    });

    console.log("Role assigned successfully");
  } catch (error) {
    console.error("Error setting role:", error);
  }
}

setRole();