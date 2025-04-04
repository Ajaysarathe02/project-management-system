
import React, { useContext } from "react";
import ChatUI from "../components/ChatUI";
import { UserContext } from "../context/contextApi";

const HodChat = () => {
  const { user } = useContext(UserContext); // Get the logged-in user


  return <ChatUI />;
};

export default HodChat;

