import React, { useState, useEffect, useContext } from "react";
import { databases, database_id, account } from "../lib/appwrite"; // Import Appwrite configuration
import { HodContext, UserContext } from "../context/contextApi";
import { Query } from "appwrite";

function HodReports() {

  const [notifications, setNotifications] = useState([]); // State to store notifications
  const {hodUser} = useContext(HodContext);

  // Fetch notifications for the logged-in HOD
  const fetchNotifications = async () => {
    try {
      const response = await databases.listDocuments(
        database_id,
        "67d08e62003a0547f663", // Replace with your notifications collection ID
        [Query.equal("studentId", hodUser.$id)] // Fetch notifications for the logged-in HOD
      );
      setNotifications(response.documents); // Store notifications in state
    } catch (error) {
      console.error("Failed to fetch notifications:", error);
    }
  };

  useEffect(() => {
    if (hodUser) {
      fetchNotifications();
    }
  }, [hodUser]);

  return (
    <div>
      <h2 className="text-xl font-semibold text-white">Notifications</h2>
      <div className="mt-4 space-y-4">
        {notifications.length > 0 ? (
          notifications.map((notification) => (
            <div key={notification.$id} className="p-4 rounded-lg bg-gray-800">
              <p className="text-sm text-gray-300">{notification.message}</p>
              <p className="text-xs text-gray-500 mt-2">
                {notification.timestamp}
              </p>
            </div>
          ))
        ) : (
          <p className="text-gray-400">No notifications available.</p>
        )}
      </div>
    </div>
  );
}

export default HodReports