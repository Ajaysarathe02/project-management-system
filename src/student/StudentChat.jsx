
import React, { useContext } from "react";
import ChatUI from "../components/ChatUI";
import { UserContext } from "../context/contextApi";

const StudentChat = () => {
  const { user } = useContext(UserContext); // Get the logged-in user

  if (!user) {
    return <p>Loading user data...</p>;
  }

  return <ChatUI />;
};

export default StudentChat;

