const admin = require("./firebaseAdmin");

console.log("Apps count:", admin.apps.length);

const app = admin.app();

console.log("App name:", app.name);

// SAFE WAY (from service account)
const serviceAccount = require("./serviceAccountKey.json");

console.log("Project ID:", serviceAccount.project_id);