import React, { useState, useEffect, useContext } from "react";
import { databases, database_id } from "../lib/appwrite"; // Import Appwrite configuration
import { Query } from "appwrite";
import { UserContext } from "../context/contextApi";

function StudentNotifications() {
  const [notifications, setNotifications] = useState([]); // State to store notifications
  const [loading, setLoading] = useState(true); // State to handle loading
  const {user} = useContext(UserContext);

  // Fetch notifications for the logged-in student
  const fetchNotifications = async () => {
    try {
      setLoading(true);
      const response = await databases.listDocuments(
        database_id,
        "67d08e62003a0547f663", // Replace with your notifications collection ID
        [Query.equal("studentId", user.$id)] // Replace with the logged-in student's ID
      );
      setNotifications(response.documents); // Store notifications in state
      console.log(response.documents);
    } catch (error) {
      console.error("Failed to fetch notifications:", error);
    } finally {
      setLoading(false);
    }
  };

 // Mark all unread notifications as read
 const markAllAsRead = async (studentId) => {
  try {
    const response = await databases.listDocuments(
      database_id,
      "67d08e62003a0547f663", // Replace with your notifications collection ID
      [Query.equal("studentId", studentId), Query.equal("isRead", false)] // Fetch unread notifications
    );

    const unreadNotifications = response.documents;

    // Update each unread notification to mark it as read
    const updatePromises = unreadNotifications.map((notification) =>
      databases.updateDocument(
        database_id,
        "67d08e62003a0547f663", // Replace with your notifications collection ID
        notification.$id,
        { isRead: true }
      )
    );

    await Promise.all(updatePromises); // Wait for all updates to complete
  } catch (error) {
    console.error("Failed to mark notifications as read:", error);
  }
};

  useEffect(() => {
    fetchNotifications(); // Fetch notifications on component mount
    markAllAsRead(user.$id)
  }, []);

  return (
    <div className="bg-gray-900 min-h-screen text-white">
      <div className="max-w-4xl mx-auto px-4 py-8">
        <h1 className="text-2xl font-semibold mb-6">Notifications</h1>
        {loading ? (
          <p className="text-gray-400">Loading notifications...</p>
        ) : notifications.length > 0 ? (
          <div className="space-y-4">
            {notifications.map((notification) => (
              <div
                key={notification.$id}
                className="bg-gray-800 rounded-lg shadow p-4 flex items-start space-x-4"
                onClick={()=>{
                    markAllAsRead(notification.studentId)
                }}
              >
                <div className="flex-shrink-0">
                  <i className="fas fa-bell text-yellow-400 text-2xl"></i>
                </div>
                <div className="flex-1">
                  <p className="text-sm text-gray-300">
                    <strong>{notification.message}</strong>
                  </p>
                  <p className="text-xs text-gray-500 mt-1">
                    {notification.timestamp}
                  </p>
                </div>
                {!notification.isRead && (
                  <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-900 text-blue-300">
                    New
                  </span>
                )}
              </div>
            ))}
          </div>
        ) : (
          <p className="text-gray-400">No notifications available.</p>
        )}
      </div>
    </div>
  );
}

export default StudentNotifications;