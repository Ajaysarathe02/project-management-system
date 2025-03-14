import React, { createContext, useState } from "react";
import { account, databases, ID, database_id,client } from "../lib/appwrite"; // Import Appwrite SDK
import { toast } from "react-toastify";
import { ProjectHeadContext } from "./contextApi";

const ProjectHeadContextProvider = ({ children }) => {
  const [loading, setLoading] = useState(false);

  // Signup logic for Project Head
  const signupProjectHead = async (phName, phEmail, phPassword, phDepartment, phDesignation, role) => {
    setLoading(true);
    try {
      const userId = ID.unique(); // Generate a unique ID for the user

      // Create the user account in Appwrite
      const user = await account.create(userId, phEmail, phPassword, phName);
      await account.updatePrefs(userId,{role:role})

      if(user){
        // Create a document in the "project-heads" collection
      await databases.createDocument(
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
      );
      
      }
      else{
        throw new Error("User account creation failed");

      }
    
      return true;
    } catch (error) {
      console.error("Signup failed", error);
      setLoading(false);
      return false;
    }
  };

  return (
    <ProjectHeadContext.Provider value={{ signupProjectHead, loading }}>
      {children}
    </ProjectHeadContext.Provider>
  );
};

export default ProjectHeadContextProvider;