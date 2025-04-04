import React, { useContext, useEffect, useState } from "react";
import { ChatContext } from "../context/ChatContextProvider";
import { UserContext } from "../context/contextApi";
import { ID, Query } from "appwrite";
import { databases } from "../lib/appwrite";
import { APPWRITE_CONFIG } from "../lib/appwriteConfig";

const ChatUI = () => {
  const { user } = useContext(UserContext); // Get the logged-in user
  const {
    chatList,
    currentChat,
    setCurrentChat,
    messages,
    fetchAllUsers,
    fetchMessages,
    loadingMessages,
    currentuser,
  } = useContext(ChatContext);

  const [newMessage, setNewMessage] = useState("");

  // Fetch all users for chatting on component mount
  useEffect(() => {
    if (currentuser) {
      console.log("chatlist is ", chatList)
      fetchAllUsers(currentuser.$id); // Fetch all users except the logged-in user
    }
  }, [currentuser]);

  // Fetch messages when a chat is selected
  useEffect(() => {
    if (currentChat) {
      fetchMessages(currentuser.$id, currentChat.chatPartnerId);
    }
  }, [currentChat]);

  const sendMessage = async () => {
    if (!newMessage.trim()) return;

    try {
      await databases.createDocument(
        APPWRITE_CONFIG.DATABASE_ID,
        APPWRITE_CONFIG.COLLECTIONS.CHATS,
        ID.unique(),
        {
          senderId: currentuser.$id,
          receiverId: currentChat.chatPartnerId,
          message: newMessage,
          timestamp: new Date().toISOString(),
          isRead: false,
        }
      );

      setNewMessage(""); // Clear the input field
    } catch (error) {
      console.error("Failed to send message:", error);
    }
  };

  const markMessagesAsRead = async (chatPartnerId) => {
    try {
      const unreadMessages = await databases.listDocuments(
        APPWRITE_CONFIG.DATABASE_ID,
        APPWRITE_CONFIG.COLLECTIONS.CHATS,
        [
          Query.equal("senderId", chatPartnerId),
          Query.equal("receiverId", currentuser.$id),
          Query.equal("isRead", false),
        ]
      );

      // Update all unread messages to mark them as read
      const updatePromises = unreadMessages.documents.map((message) =>
        databases.updateDocument(
          APPWRITE_CONFIG.DATABASE_ID,
          APPWRITE_CONFIG.COLLECTIONS.CHATS,
          message.$id,
          { isRead: true }
        )
      );

      await Promise.all(updatePromises);

      // Refresh the chat list to update unread counts
      fetchAllUsers(currentuser.$id);
    } catch (error) {
      console.error("Failed to mark messages as read:", error);
    }
  };



  return (
    <div className="flex h-screen">
      {/* Chat List */}
      <div className="w-1/4 bg-gray-800 p-4">
        <h2 className="text-xl font-semibold text-white mb-4">Chats</h2>
        <ul>
          {chatList.map((chatPartner) => (
            <li
              key={chatPartner.id}
              className={`p-2 rounded-lg cursor-pointer ${currentChat?.chatPartnerId === chatPartner.id
                ? "bg-blue-500 text-white"
                : "bg-gray-700 text-gray-300"
                }`}
              onClick={() => {
                setCurrentChat({
                  userId: currentuser.$id,
                  chatPartnerId: chatPartner.id,
                  chatPartnerName: chatPartner.name,
                });
                markMessagesAsRead(chatPartner.id); // Mark messages as read when chat is opened
              }}
            >
              <div className="flex justify-between items-center">
                <span>
                  {chatPartner.name} ({chatPartner.role})
                </span>
                {chatPartner.unreadCount > 0 && (
                  <span className="bg-red-500 text-white text-xs font-bold px-2 py-1 rounded-full">
                    {chatPartner.unreadCount}
                  </span>
                )}
              </div>
            </li>
          ))}
        </ul>
      </div>

      {/* Chat Window */}
      <div className="w-3/4 bg-gray-900 p-6 flex flex-col">
        {currentChat ? (
          <>
            <h2 className="text-2xl font-semibold text-white mb-4">
              Chat with {currentChat.chatPartnerName}
            </h2>
            <div
              className="flex-1 bg-gray-700 p-4 rounded-lg overflow-y-auto"
              style={{ maxHeight: "400px" }}
            >
              {loadingMessages ? (
                <p className="text-gray-400">Loading messages...</p>
              ) : messages.length > 0 ? (
                messages.map((msg) => (
                  <div
                    key={msg.$id}
                    className={`mb-2 p-2 rounded-lg max-w-xs ${msg.senderId === currentuser.$id
                        ? "bg-blue-500 text-white self-end ml-auto"
                        : "bg-gray-500 text-white self-start mr-auto"
                      }`}
                  >
                    <p>{msg.message}</p>
                    <p className="text-xs text-gray-300 text-right">
                      {new Date(msg.timestamp).toLocaleString()}
                    </p>
                  </div>
                ))
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
          </>
        ) : (
          <p className="text-gray-400">Select a chat to start messaging.</p>
        )}
      </div>
    </div>
  );
};

export default ChatUI;