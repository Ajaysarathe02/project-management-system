import React, { useState, useEffect } from "react";
import { UserContext } from "./contextApi";
import { account, client, ID, database_id, databases } from "../lib/appwrite";
import { Query } from "appwrite";

const UserContextProvider = ({ children }) => {
  const [user, setUser] = useState("");
  const [loading, setLoading] = useState(true);
  const [projects, setProjects] = useState([]);

  // for user login
  const login = async (email, password) => {
    try {
      await account.createEmailPasswordSession(
        email,
        password
      ).then(()=>{return true})
      
    } catch (error) {
      console.error("Login failed", error);
      return false
    }
  };

  // for signup
  const signup = async (email, password, name, roll, branch, role) => {
    try {
      console.log("the role is ",role)
      if (!role) {
        throw new Error("Role is required for signup");
        return
      }

      const userID = ID.unique();
      const res = await account.create(userID, email, password, name);
      const pref = await account.updatePrefs({role:role}) // Explicitly set the role in prefs
       // create a document in the students collection
      await databases.createDocument(database_id,'67d08e060038dec0bac3',userID,
        {
          userid: userID,
          Name:name,
          Roll:roll,
          Branch:branch,
          Email:email,
          Role:role,
      });

      console.log("pref",pref)
      return true

    } catch (error) {
      console.error("Signup failed", error);
      return false
    }
  };

  // for logout
  const logout = async () => {
    try {
      await account.deleteSession("current");
      setUser(null);
    } catch (error) {
      console.error("Logout failed", error);
    }
  };

 

  // for uploading projects
  const uploadProject = async (userId, projectData) => {
    try {
      const response = await databases.listDocuments(
        database_id,
        "67d08e060038dec0bac3",
        [Query.equal("userid", userId)]
      );


      if (response.documents.length > 0) {
        const document = response.documents[0];
        const projectDataString = JSON.stringify(projectData)
        const updatedProjects = [...document.Projects, projectDataString];

        // under students collection
        await databases.updateDocument(
          database_id, // Replace with your database ID
          "67d08e060038dec0bac3", // Collection ID of students
          userId, // Document ID
          { Projects: updatedProjects }
        ).then(()=>{console.log("project submitted under students collection")});

        // under projects collection
        const projectId = ID.unique();
        await databases.createDocument(
          database_id,
          "67d08e5700221884ebb9", // projects collection
          projectId, // unique id for project
          {
            uploadBy:userId,
            title:projectData.title,
            description:projectData.description,
            category:projectData.category,
            projectHead:projectData.head,
            teamMembers:projectData.teamMembers,
            dueDate:projectData.dueDate,
            githubLink:projectData.githubLink,
            hodStatus:projectData.hodStatus,
            proheadStatus:projectData.proheadStatus,
            hodComment:projectData.hodComment,
            proheadComment:projectData.proheadComment,
            
          }
        ).then(()=>{console.log("project submitted under projects collection")});

        setProjects(updatedProjects);
      } else {
        console.error("document not found");
      }

    } catch (error) {
      console.error("Failed to upload project", error);
    }
  };

  // for fetching projects
  const fetchProjects = async (userId) => {
    try {
      const response = await databases.listDocuments(
        database_id,
        "67d08e060038dec0bac3",
        [Query.equal("userid", userId)]
      );

      if (response.documents.length > 0) {
        const document = response.documents[0];
        setProjects(document.Projects.map(project => JSON.parse(project)));
      } else {
        console.error("Document not found");
      }
    } catch (error) {
      console.error("Failed to fetch projects", error);
    }
  };

  // for getting current user
  const getCurrentUser = async () => {
    try {
      const res = await account.getSession('current');
      const res1 = await account.get();
      console.log("res1",res1)
      setUser(res)
    } catch (error) {
      setUser(null)
    }
    
  }


  return (
    <UserContext.Provider
      value={{
        user,
        setUser,
        loading,
        getCurrentUser,
        login,
        signup,
        logout,
        uploadProject,
        projects,
        fetchProjects,
      }}
    >
      {children}
    </UserContext.Provider>
  );
};

export default UserContextProvider;
