import { db } from "../firebase";
import { collection, addDoc } from "firebase/firestore";

/**
 * Create a notification in Firestore
 * @param {string} title - Notification title
 * @param {string} message - Notification message
 * @param {string} category - Notification category (Task Alerts, Feedback Alerts, Resource Updates)
 */
export const createNotification = async (title, message, category) => {
  try {
    await addDoc(collection(db, "notifications"), {
      title,
      message,
      category,
      timestamp: new Date(),
      read: false,
    });
  } catch (err) {
    console.error("Error creating notification:", err);
  }
};
