import React, { useState, useEffect } from "react";
import { db } from "../firebase";
import { collection, getDocs, updateDoc, doc } from "firebase/firestore";

export default function UserManagement() {
  const [users, setUsers] = useState([]);

  // Fetch users from Firestore
  const fetchUsers = async () => {
    const querySnapshot = await getDocs(collection(db, "users"));
    setUsers(
      querySnapshot.docs.map((docSnap) => ({
        id: docSnap.id,
        ...docSnap.data(),
      }))
    );
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  // Update user role
  const handleRoleChange = async (userId, newRole) => {
    const userRef = doc(db, "users", userId);
    await updateDoc(userRef, { role: newRole });
    fetchUsers(); // refresh list
  };

  return (
    <div style={{ padding: "20px" }}>
      <h2 style={{ fontSize: "24px", fontWeight: "bold", marginBottom: "20px" }}>
        User Management
      </h2>

      <table style={{ width: "100%", borderCollapse: "collapse" }}>
        <thead>
          <tr style={{ backgroundColor: "#f0f0f0" }}>
            <th style={{ border: "1px solid #ccc", padding: "10px" }}>Email</th>
            <th style={{ border: "1px solid #ccc", padding: "10px" }}>Role</th>
            <th style={{ border: "1px solid #ccc", padding: "10px" }}>Actions</th>
          </tr>
        </thead>
        <tbody>
          {users.map((user) => (
            <tr key={user.id}>
              <td style={{ border: "1px solid #ccc", padding: "10px" }}>
                {user.email}
              </td>
              <td style={{ border: "1px solid #ccc", padding: "10px" }}>
                {user.role || "intern"}
              </td>
              <td style={{ border: "1px solid #ccc", padding: "10px" }}>
                <select
                  value={user.role || "intern"}
                  onChange={(e) => handleRoleChange(user.id, e.target.value)}
                  style={{ padding: "6px" }}
                >
                  <option value="intern">Intern</option>
                  <option value="supervisor">Supervisor</option>
                  <option value="admin">Admin</option>
                </select>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
