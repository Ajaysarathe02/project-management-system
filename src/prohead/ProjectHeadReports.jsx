import React, { useContext, useEffect, useState } from "react";
import { databases } from "../lib/appwrite"; // Adjust the import path as needed
import { Query } from "appwrite";
import { ProjectHeadContext } from "../context/contextApi";
import { APPWRITE_CONFIG } from "../lib/appwriteConfig";

function ProjectHeadReports() {
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);

  const {projectHead} = useContext(ProjectHeadContext)

  const projectHeadId = "project-head-user-id"; // Replace with the actual project head's user ID (e.g., from context or props)

  const fetchNotifications = async () => {
    try {
      setLoading(true);
      const response = await databases.listDocuments(
        APPWRITE_CONFIG.DATABASE_ID,
        APPWRITE_CONFIG.COLLECTIONS.NOTIFICATIONS,
        [Query.equal("projectHeadId", projectHead.userid)] // Filter notifications by project head ID
      );
      setNotifications(response.documents);
    } catch (error) {
      console.error("Failed to fetch notifications:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchNotifications();
  }, []);

  return (
    <div className="p-6 bg-gray-800 rounded-lg">
      <h2 className="text-2xl font-semibold text-white mb-4">Notifications</h2>
      {loading ? (
        <p className="text-gray-400">Loading notifications...</p>
      ) : notifications.length > 0 ? (
        <ul className="space-y-4">
          {notifications.map((notification) => (
            <li
              key={notification.$id}
              className="p-4 bg-gray-700 rounded-lg shadow-md text-white"
            >
              <p className="mb-2">
                <strong>Message:</strong> {notification.message}
              </p>
              <p className="text-sm text-gray-400">
                <strong>Timestamp:</strong> {notification.timestamp}
              </p>
              <p className="text-sm text-gray-400">
                <strong>Student ID:</strong> {notification.studentId}
              </p>
            </li>
          ))}
        </ul>
      ) : (
        <p className="text-gray-400">No notifications found.</p>
      )}
    </div>
  );
}

export default ProjectHeadReports;