const admin = require("./firebaseAdmin");

async function createUser() {
  try {
    const user = await admin.auth().createUser({
      email: "intern1@gmail.com",
      password: "12345678",
      displayName: "Intern One",
    });

    console.log("User created:", user.uid);
  } catch (err) {
    console.error(err);
  }
}

createUser();