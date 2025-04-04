import React, { useState, useEffect, useRef } from "react";
import { databases, client } from "../lib/appwrite"; // Adjust the import path as needed
import { Query } from "appwrite";
import { APPWRITE_CONFIG } from "../lib/appwriteConfig";
import "./Chat.css"; // Import your CSS file for custom scrollbar styles

const Chat = ({ userId, chatPartnerId, userType }) => {
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState("");
  const messagesEndRef = useRef(null); // Create a reference for the end of the message list

  // Fetch initial chat messages between the current user and the chat partner
  const fetchMessages = async () => {
    try {
      const sentMessages = await databases.listDocuments(
        APPWRITE_CONFIG.DATABASE_ID,
        APPWRITE_CONFIG.COLLECTIONS.CHATS,
        [Query.equal("senderId", userId), Query.equal("receiverId", chatPartnerId)]
      );

      const receivedMessages = await databases.listDocuments(
        APPWRITE_CONFIG.DATABASE_ID,
        APPWRITE_CONFIG.COLLECTIONS.CHATS,
        [Query.equal("senderId", chatPartnerId), Query.equal("receiverId", userId)]
      );

      const allMessages = [...sentMessages.documents, ...receivedMessages.documents].sort(
        (a, b) => new Date(a.timestamp) - new Date(b.timestamp)
      );

      setMessages(allMessages);
    } catch (error) {
      console.error("Failed to fetch messages:", error);
    }
  };

  // Send a new message
  const sendMessage = async () => {
    if (!newMessage.trim()) return;

    try {
      await databases.createDocument(
        APPWRITE_CONFIG.DATABASE_ID,
        APPWRITE_CONFIG.COLLECTIONS.CHATS,
        "unique()", // Auto-generate a unique ID
        {
          senderId: userId,
          receiverId: chatPartnerId,
          message: newMessage,
          timestamp: new Date().toISOString(),
        }
      );

      setNewMessage(""); // Clear the input field
    } catch (error) {
      console.error("Failed to send message:", error);
    }
  };

  // Real-time subscription for new messages
  useEffect(() => {
    fetchMessages(); // Fetch initial messages

    const unsubscribe = client.subscribe(
      `databases.${APPWRITE_CONFIG.DATABASE_ID}.collections.${APPWRITE_CONFIG.COLLECTIONS.CHATS}.documents`,
      (response) => {
        if (
          (response.payload.senderId === userId && response.payload.receiverId === chatPartnerId) ||
          (response.payload.senderId === chatPartnerId && response.payload.receiverId === userId)
        ) {
          setMessages((prevMessages) => [...prevMessages, response.payload]);
        }
      }
    );

    return () => unsubscribe(); // Cleanup subscription on component unmount
  }, [chatPartnerId]);

  // Scroll to the latest message whenever the messages array changes
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  return (
    <div className="p-6 bg-gray-800 rounded-lg">
      <h2 className="text-2xl font-semibold text-white mb-4">
        Chat with {userType === "student" ? "Project Head" : "Student"}
      </h2>
      <div 
      className="bg-gray-700 p-4 rounded-lg h-64 overflow-y-auto custom-scrollbar"
        style={{ maxHeight: "400px" }} // Set a max height for the chat area>
        >
        {messages.length > 0 ? (
          <>
            {messages.map((msg) => (
              <div
                key={msg.$id}
                className={`mb-2 p-2 rounded-lg max-w-xs ${
                  msg.senderId === userId
                    ? "bg-blue-500 text-white self-end ml-auto" // Right side for current user
                    : "bg-gray-500 text-white self-start mr-auto" // Left side for chat partner
                }`}
              >
                <p>{msg.message}</p>
                <p className="text-xs text-gray-300 text-right">
                  {new Date(msg.timestamp).toLocaleString()}
                </p>
              </div>
            ))}
            {/* Add a div at the end of the message list to scroll to */}
            <div ref={messagesEndRef}></div>
          </>
        ) : (
          <p className="text-gray-400">No messages yet.</p>
        )}
      </div>
      <div className="mt-4 flex">
        <input
          type="text"
          value={newMessage}
          onChange={(e) => setNewMessage(e.target.value)}
          className="flex-1 bg-gray-700 text-white p-2 rounded-lg"
          placeholder="Type your message..."
        />
        <button
          onClick={sendMessage}
          className="ml-2 px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600"
        >
          Send
        </button>
      </div>
    </div>
  );
};

export default Chat;