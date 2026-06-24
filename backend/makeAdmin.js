const admin = require("./firebaseAdmin");

async function makeAdmin() {
  const uid = "AMxN3a6xmUP8yX0aKSLlxFWLnrW2";

  await admin.auth().setCustomUserClaims(uid, {
    role: "admin"
  });

  console.log("User promoted to admin");
}

makeAdmin();