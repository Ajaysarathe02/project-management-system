// filepath: /src/context/ProfileContext.js
import React, {  useState, useEffect, useContext } from "react";
import { StudentContext, UserContext } from "./contextApi";
import { APPWRITE_CONFIG } from "../lib/appwriteConfig";
import { account, databases } from "../lib/appwrite";
import { Query } from "appwrite";

// Create a context for the profile data
export const StudentContextProvider = ({ children }) => {
  
    const {user} = useContext(UserContext)
    const [studentProfileData, setStudentProfileData] = useState(null);
    const [loading, setLoading] = useState(true);

    const fetchStudentData = async (userId) => {
        try {
          const response = await databases.listDocuments(
            APPWRITE_CONFIG.DATABASE_ID,
            APPWRITE_CONFIG.COLLECTIONS.STUDENTS,
            [Query.equal("userid", userId)]
          );
    
          if (response.documents.length > 0) {
            const document = response.documents[0];
            setStudentProfileData(document);
            return document;

          } else {
            console.error("Document not found");
            return null;
          }
        } catch (error) {
          console.error("Failed to fetch student data", error);
          return null;
        }
      }

       useEffect(() => {
              const fetchData = async () => {
                const res = await account.get();
                
                  const data = await fetchStudentData(res.$id);
                  setStudentProfileData(data);
      
              };
      
              fetchData();
          }, [studentProfileData]);

      

    return (
        <StudentContext.Provider value={{ studentProfileData, setStudentProfileData,fetchStudentData, loading }}>
            {children}
        </StudentContext.Provider>
    );
};