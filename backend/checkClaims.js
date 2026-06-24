const admin = require("./firebaseAdmin");

const uid = "PASTE_USER_UID_HERE";

admin.auth().getUser(uid)
  .then((user) => {
    console.log("Custom Claims:", user.customClaims);
  })
  .catch(console.error);