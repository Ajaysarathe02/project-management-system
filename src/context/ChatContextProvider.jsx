import React, { createContext, useState, useEffect } from "react";
import { databases, client, account } from "../lib/appwrite";
import { APPWRITE_CONFIG } from "../lib/appwriteConfig";
import { Query } from "appwrite";

export const ChatContext = createContext();

const ChatContextProvider = ({ children }) => {
  const [chatList, setChatList] = useState([]); // List of all users for chatting
  const [currentChat, setCurrentChat] = useState(null); // Current chat recipient
  const [messages, setMessages] = useState([]); // Messages in the current chat
  const [loadingMessages, setLoadingMessages] = useState(false); // Loading state for messages
  const [currentuser,setcurrentuser] = useState(null)

  useEffect(() => {
    const fetchCurrentUser = async () => {
      try {
        const user = await account.get(); // Fetch the logged-in user
        setcurrentuser(user)
      } catch (error) {
        console.error("Failed to fetch current user:", error);
      }
    };

    fetchCurrentUser(); // Fetch current user on component mount
  }, [])
  

  // Fetch all users (students, HODs, and project heads) for chatting
  const fetchAllUsers = async (loggedInUserId) => {
    try {
      const students = await databases.listDocuments(
        APPWRITE_CONFIG.DATABASE_ID,
        APPWRITE_CONFIG.COLLECTIONS.STUDENTS
      );

      const projectHeads = await databases.listDocuments(
        APPWRITE_CONFIG.DATABASE_ID,
        APPWRITE_CONFIG.COLLECTIONS.PROJECT_HEAD
      );

      const hods = await databases.listDocuments(
        APPWRITE_CONFIG.DATABASE_ID,
        APPWRITE_CONFIG.COLLECTIONS.HOD
      );

      // Combine all users into a single list
      const allUsers = [
        ...students.documents.map((user) => ({
          id: user.userid,
          name: user.Name,
          role: "student",
        })),
        ...projectHeads.documents.map((user) => ({
          id: user.userid,
          name: user.Name,
          role: "project-head",
        })),
        ...hods.documents.map((user) => ({
          id: user.userid,
          name: user.Name,
          role: "hod",
        })),
      ];

      // Fetch unread message counts for each user
    const unreadCounts = await Promise.all(
      allUsers.map(async (user) => {
        const unreadMessages = await databases.listDocuments(
          APPWRITE_CONFIG.DATABASE_ID,
          APPWRITE_CONFIG.COLLECTIONS.CHATS,
          [
            Query.equal("senderId", user.id),
            Query.equal("receiverId", loggedInUserId),
            Query.equal("isRead", false),
          ]
        );
        return { userId: user.id, unreadCount: unreadMessages.total };
      })
    );

    // Add unread counts to the user list
    const chatListWithUnreadCounts = allUsers.map((user) => {
      const unreadCount = unreadCounts.find((count) => count.userId === user.id)?.unreadCount || 0;
      return { ...user, unreadCount };
    });


      // Filter out the logged-in user
      const filteredUsers = chatListWithUnreadCounts.filter((user) => user.id !== loggedInUserId);

      setChatList(filteredUsers);
    } catch (error) {
      console.error("Failed to fetch users for chatting:", error);
    }
  };

  // Fetch messages for the current chat
  const fetchMessages = async (userId, chatPartnerId) => {
    setLoadingMessages(true);
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
    } finally {
      setLoadingMessages(false);
    }
  };

  // Real-time subscription for new messages
  useEffect(() => {
    const unsubscribe = client.subscribe(
      `databases.${APPWRITE_CONFIG.DATABASE_ID}.collections.${APPWRITE_CONFIG.COLLECTIONS.CHATS}.documents`,
      (response) => {
        if (
          (response.payload.senderId === currentChat?.userId &&
            response.payload.receiverId === currentChat?.chatPartnerId) ||
          (response.payload.senderId === currentChat?.chatPartnerId &&
            response.payload.receiverId === currentChat?.userId)
        ) {
          setMessages((prevMessages) => [...prevMessages, response.payload]);
        }
      }
    );

    return () => unsubscribe(); // Cleanup subscription on component unmount
  }, [currentChat]);

  return (
    <ChatContext.Provider
      value={{
        chatList,
        currentChat,
        setCurrentChat,
        messages,
        fetchAllUsers,
        fetchMessages,
        loadingMessages,
        currentuser,
      }}
    >
      {children}
    </ChatContext.Provider>
  );
};

export default ChatContextProvider;