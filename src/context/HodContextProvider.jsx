import React, { createContext, useState } from "react";
import { account, databases, ID, database_id } from "../lib/appwrite";
import { HodContext } from "./contextApi";

const HodContextProvider = ({ children }) => {

  const [loading, setLoading] = useState(false);
  const [hodUser, setHodUser] = useState("");

  // HOD Signup Logic
  const signupHod = async (hodName, hodEmail, hodPassword, hodDepartment, hodDesignation, role) => {

    setLoading(true);
    try {
      const userId = ID.unique(); // Generate a unique ID for the user

      // Create the user account in Appwrite
      const user = await account.create(userId, hodEmail, hodPassword, hodName);

      if (user) {
        // Create a document in the "hods" collection
        const hodDocument = await databases.createDocument(
          database_id, // Replace with your database ID
          "67d08e2f000dbc9c89a1", // Collection ID for HODs
          userId, // Document ID
          {
            userid: userId,
            Name: hodName,
            Department: hodDepartment,
            Designation: hodDesignation,
            Email: hodEmail,
            Role: role,
          }
        );

        // Set role in the common database
        const userRole = await databases.createDocument(
          database_id,
          "67d72e1b0015ed5fb71d", // Collection ID for common roles
          userId,
          {
            userid: userId,
            Role: role,
            Name: hodName,
          }
        );

        console.log("HOD signup data:", hodDocument);
        console.log("User role data:", userRole);

        setLoading(false);
        return true;
      } else {
        throw new Error("User account creation failed");
      }
    } catch (error) {
      console.error("Signup failed:", error);
      setLoading(false);
      return false;
    }
  };

  // 
  const getHodUser = async () => {
    try {

      const res = await account.get();
      setHodUser(res);

    } catch (error) {
      console.log("error getting hod")
    }
  }

  return (
    <HodContext.Provider value={{ signupHod, loading, getHodUser, setHodUser,hodUser }}>
      {children}
    </HodContext.Provider>
  );
};

export default HodContextProvider;