import React, { createContext, useState, useEffect } from "react";
import { account, databases, ID, database_id, client } from "../lib/appwrite"; // Import Appwrite SDK
import { toast } from "react-toastify";
import { ProjectHeadContext } from "./contextApi";
import { useNavigate } from "react-router-dom";

const ProjectHeadContextProvider = ({ children }) => {
  const [loading, setLoading] = useState(false);
  const [projectHead, setProjectHead] = useState(null);
  const [profilePicture, setProfilePicture] = useState(null); // State for profile picture

  // Signup logic for Project Head
  const signupProjectHead = async (
    phName,
    phEmail,
    phPassword,
    phDepartment,
    phDesignation,
    role
  ) => {
    setLoading(true);
    try {
      const userId = ID.unique(); // Generate a unique ID for the user
      console.log("signed up role is ", role);
      // Create the user account in Appwrite
      const user = await account.create(userId, phEmail, phPassword, phName);

      if (user) {
        // Create a document in the "project-heads" collection
        const user1 = await databases.createDocument(
          database_id, // Replace with your database ID
          "67d08e46002ce8afea0f", // Collection ID for Project Heads 67d08e46002ce8afea0f
          userId, // Document ID
          {
            userid: userId,
            Name: phName,
            Department: phDepartment,
            Designation: phDesignation,
            Email: phEmail,
            Role: role,
          }
        )

        // set role in common database
        const userRole = await databases.createDocument(
          database_id,
          "67d72e1b0015ed5fb71d", // collection id for common db
          userId,
          {
            userid: userId,
            Role: role,
            Name: phName,
          }
        );
        console.log("user data set in common db ", userRole)
        console.log("project head signup data ", user1);

      } else {
        throw new Error("User account creation failed");
      }

      return true;
    } catch (error) {
      console.error("Signup failed", error);
      setLoading(false);
      return false;
    }
  };

  // get current project head
  const getCurrentProjectHead = async () => {
    try {
      const response = await account.get();
      return response;
    } catch (error) {
      console.error("Error getting current project head:", error);
      return null;
    }
  };

  // get project head details
  const getProjectHeadDetails = async (userId) => {
    try {
      const response = await databases.getDocument(
        database_id,
        "67d08e46002ce8afea0f", // project-head collection
        userId
      );
      
      setProjectHead(response);
      return response
    } catch (error) {
      console.error("Error getting project head:", error);
      return null
    }
  };

  // Generate file URL
  const generateFileUrl = (fileId) => {
    return `https://cloud.appwrite.io/v1/storage/buckets/67d541b9000f5101fd5d/files/${fileId}/view?project=67d013a6000a87361603`;
  };

 // Update project head profile picture
 const updateProfilePicture = async (newPictureId) => {
  try {
    const pictureUrl = generateFileUrl(newPictureId);
    setProfilePicture(pictureUrl); // Update the profile picture in the context
  } catch (error) {
    console.error("Error updating profile picture:", error);
  }
};

// useEffect(() => {
//   const fetchProjectHeadDetails = async () => {
//     try {
//       const currentHead = await getCurrentProjectHead(); // Await the current project head
//       if (currentHead?.$id) {
//         await getProjectHeadDetails(currentHead.$id); // Pass the valid user ID
//         console.log(projectHead)
//       } else {
//         console.error("No current project head found.");
//       }
//     } catch (error) {
//       console.error("Error fetching project head details:", error);
//     }
//   };

//   fetchProjectHeadDetails(); // Call the async function
// }, []);

  return (
    <ProjectHeadContext.Provider
      value={{
        signupProjectHead, loading, getCurrentProjectHead, getProjectHeadDetails, projectHead, setProjectHead, profilePicture, // Expose profile picture state
        setProfilePicture, // Expose profile picture setter
        updateProfilePicture,
      }}
    >
      {children}
    </ProjectHeadContext.Provider>
  );
};

export default ProjectHeadContextProvider;
