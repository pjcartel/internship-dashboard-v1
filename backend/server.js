const { verifyToken, requireAdmin } = require("./middleware/auth");
const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");

const admin = require("./firebaseAdmin");

const app = express();

app.use(cors());
app.use(bodyParser.json());

/**
 * CREATE USER (ADMIN ONLY)
 */
app.post("/create-user", verifyToken, requireAdmin, async (req, res) => {
  try {
    const { email, password, role } = req.body;

    const user = await admin.auth().createUser({
      email,
      password,
    });

    await admin.auth().setCustomUserClaims(user.uid, {
      role: role || "intern",
    });

    return res.json({
      message: "User created successfully",
      uid: user.uid,
    });
  } catch (error) {
    return res.status(500).json({
      error: error.message,
    });
  }
});

/**
 * LIST USERS (ADMIN ONLY)
 */
app.get("/users", verifyToken, requireAdmin, async (req, res) => {
  try {
    const list = await admin.auth().listUsers();

    const users = list.users.map((u) => ({
      uid: u.uid,
      email: u.email,
      role: u.customClaims?.role || "none",
    }));

    return res.json(users);
  } catch (error) {
    return res.status(500).json({
      error: error.message,
    });
  }
});

/**
 * SET ROLE (ADMIN ONLY)
 */
app.post("/set-role", verifyToken, requireAdmin, async (req, res) => {
  try {
    const { uid, role } = req.body;

    await admin.auth().setCustomUserClaims(uid, { role });

    return res.json({
      message: "Role updated successfully",
      uid,
      role,
    });
  } catch (error) {
    return res.status(500).json({
      error: error.message,
    });
  }
});

/**
 * START SERVER
 */
app.listen(5000, () => {
  console.log("Server running on http://localhost:5000");
});