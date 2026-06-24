import { useEffect, useState } from "react";
import axios from "axios";

export default function Dashboard({ user, setUser }) {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState("intern");

  const authHeader = {
    headers: {
      Authorization: `Bearer ${user.token}`,
    },
  };

  const fetchUsers = async () => {
    try {
      setLoading(true);
      const res = await axios.get(
        "http://localhost:5000/users",
        authHeader
      );
      setUsers(res.data);
    } catch (err) {
      console.log(err);
    }
    setLoading(false);
  };

  const createUser = async () => {
    try {
      await axios.post(
        "http://localhost:5000/create-user",
        { email, password, role },
        authHeader
      );

      setEmail("");
      setPassword("");
      setRole("intern");

      fetchUsers();
      alert("User created successfully");
    } catch (err) {
      alert(err.response?.data?.error || err.message);
    }
  };

  const setUserRole = async (uid, newRole) => {
    try {
      await axios.post(
        "http://localhost:5000/set-role",
        { uid, role: newRole },
        authHeader
      );

      fetchUsers();
    } catch (err) {
      console.log(err);
    }
  };

  const logout = () => {
    setUser(null);
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  return (
    <div style={styles.container}>
      {/* SIDEBAR */}
      <div style={styles.sidebar}>
        <h2>Admin Panel</h2>
        <p>{user.email}</p>

        <button onClick={logout} style={styles.logout}>
          Logout
        </button>
      </div>

      {/* MAIN */}
      <div style={styles.main}>
        <h2>Dashboard</h2>

        {/* CREATE USER */}
        <div style={styles.card}>
          <h3>Create User</h3>

          <input
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            style={styles.input}
          />

          <input
            placeholder="Password"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            style={styles.input}
          />

          <select
            value={role}
            onChange={(e) => setRole(e.target.value)}
            style={styles.input}
          >
            <option value="intern">Intern</option>
            <option value="admin">Admin</option>
          </select>

          <button onClick={createUser} style={styles.button}>
            Create User
          </button>
        </div>

        {/* USERS TABLE */}
        <div style={styles.card}>
          <h3>Users</h3>

          {loading ? (
            <p>Loading...</p>
          ) : (
            <table style={styles.table}>
              <thead>
                <tr>
                  <th>Email</th>
                  <th>UID</th>
                  <th>Role</th>
                  <th>Action</th>
                </tr>
              </thead>

              <tbody>
                {users.map((u) => (
                  <tr key={u.uid}>
                    <td>{u.email}</td>
                    <td>{u.uid}</td>
                    <td>{u.role}</td>
                    <td>
                      <button
                        onClick={() => setUserRole(u.uid, "admin")}
                        style={styles.smallBtn}
                      >
                        Make Admin
                      </button>

                      <button
                        onClick={() => setUserRole(u.uid, "intern")}
                        style={styles.smallBtn2}
                      >
                        Make Intern
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>
    </div>
  );
}

const styles = {
  container: {
    display: "flex",
    height: "100vh",
    fontFamily: "Arial",
  },

  sidebar: {
    width: "250px",
    background: "#111827",
    color: "white",
    padding: "20px",
  },

  main: {
    flex: 1,
    padding: "20px",
    background: "#f3f4f6",
    overflowY: "auto",
  },

  card: {
    background: "white",
    padding: "20px",
    marginBottom: "20px",
    borderRadius: "10px",
  },

  input: {
    display: "block",
    width: "100%",
    padding: "10px",
    margin: "10px 0",
  },

  button: {
    padding: "10px",
    background: "green",
    color: "white",
    border: "none",
    width: "100%",
  },

  table: {
    width: "100%",
    borderCollapse: "collapse",
  },

  smallBtn: {
    marginRight: "10px",
    padding: "5px",
    background: "blue",
    color: "white",
    border: "none",
  },

  smallBtn2: {
    padding: "5px",
    background: "orange",
    color: "white",
    border: "none",
  },

  logout: {
    marginTop: "20px",
    padding: "10px",
    width: "100%",
    background: "red",
    color: "white",
    border: "none",
  },
};