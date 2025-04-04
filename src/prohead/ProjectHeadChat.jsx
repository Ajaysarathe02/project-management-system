// import React from "react";
// import Chat from "../components/Chat"; // Adjust the import path as needed

// const ProjectHeadChat = () => {
//   const currentUserId = "67d731860017ce261a4f"; // Replace with the logged-in project head's user ID
//   const chatPartnerId = "67e28853000370e9003f"; // Replace with the student's user ID

//   return (
//     <div className="p-6">
//       <Chat userId={currentUserId} chatPartnerId={chatPartnerId} userType="project-head" />
//     </div>
//   );
// };

// export default ProjectHeadChat;


import React, { useContext } from "react";
import ChatUI from "../components/ChatUI";
import { UserContext } from "../context/contextApi";

const ProjectHeadChat = () => {
  const { user } = useContext(UserContext); // Get the logged-in user

  // if (!user) {
  //   return <p>Loading user data...</p>;
  // }

  return <ChatUI />;
};

export default ProjectHeadChat;

