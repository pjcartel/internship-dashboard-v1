const admin = require("firebase-admin");

// Load your service account key
const serviceAccount = require("../serviceAccountKey.json");

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
});

// Function to list users
async function listAllUsers() {
  try {
    let nextPageToken;
    do {
      const result = await admin.auth().listUsers(1000, nextPageToken);
      result.users.forEach((userRecord) => {
        console.log(`UID: ${userRecord.uid}, Email: ${userRecord.email}`);
      });
      nextPageToken = result.pageToken;
    } while (nextPageToken);
  } catch (error) {
    console.error("Error listing users:", error);
  }
}

listAllUsers();
