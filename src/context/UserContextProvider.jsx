import React, { useState, useEffect, use } from "react";
import { UserContext } from "./contextApi";
import { account, client, ID, database_id, databases } from "../lib/appwrite";
import { Query } from "appwrite";
import { storage } from "../lib/appwrite";
import { useNavigate } from "react-router-dom";
import { a, pre } from "motion/react-client";

const UserContextProvider = ({ children }) => {
  const [user, setUser] = useState("");
  const [loading, setLoading] = useState(true);
  const [projects, setProjects] = useState([]);
  const [currentRole, setCurrentRole] = useState({});
  const [recentProjects, setRecentProjects] = useState([]);

  const [projectFileAttachments, setProjectFileAttachments] =
    useState({
      files: [],
    });
  const [projectImagesAttachments, setProjectImagesAttachments] =
    useState({
      images: [],
    });

  // for user login
  const login = async (email, password) => {
    try {
      await account.createEmailPasswordSession(email, password).then(() => {
        return true;
      });
    } catch (error) {
      console.error("Login failed", error);
      return false;
    }
  };

  // recent projects
  const fetchRecentProjects = async (userId) => {
    try {
      const response = await databases.listDocuments(
        database_id,
        "67d08e5700221884ebb9", // projects collection
        [
          Query.equal("uploadBy", userId),
          Query.orderDesc("$createdAt"),
          Query.limit(5),
        ]
      );
      setRecentProjects(response.documents);
    } catch (error) {
      console.error("Failed to fetch recent projects:", error);
    }
  };

  // for signup
  const signup = async (email, password, name, roll, branch, role) => {
    try {
      console.log("the role is ", role);

      const userID = ID.unique();

      await account.create(userID, email, password, name);
      // create a document in the students collection
      const docs = await databases.createDocument(
        database_id,
        "67d08e060038dec0bac3",
        userID,
        {
          userid: userID,
          Name: name,
          Roll: roll,
          Branch: branch,
          Email: email,
          Role: role,
        }
      );

      // set role in common database
      const userRole = await databases.createDocument(
        database_id,
        "67d72e1b0015ed5fb71d", // collection id for common db
        userID,
        {
          userid: userID,
          Role: role,
          Name: name,
        }
      );

      console.log("user signup data ", docs);
      console.log("user in common db ", userRole);

      return true;
    } catch (error) {
      console.error("Signup failed", error);
      return false;
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

  // fetch user role
  const fetchUserRole = async (userId) => {
    try {
      const document = await databases.getDocument(
        database_id, // Replace with your database ID
        "67d08e060038dec0bac3", // Replace with your collection ID for students
        userId // The document ID should match the user's ID
      );

      console.log("User Role:", document.Role); // Access the Role attribute
      return document.Role; // Return the role
    } catch (error) {
      console.error("Failed to fetch user role:", error);
      return null; // Return null if fetching fails
    }
  };

 
  // for uploading projects
  const uploadProject = async (userId, projectData) => {
    try {
      console.log("now final project data is : ", projectData);
      // find student data in student collection
      const response1 = await databases.listDocuments(
        database_id,
        "67d08e060038dec0bac3",
        [Query.equal("userid", userId)]
      );

      if (response1.documents.length > 0) {
        // uploading files
        const files = projectData.attachments;
        const projectImages = projectData.images;
        const uploadedFiles = [];
        const uploadedImages = [];
        // upload project files
        for (const file of files) {
          try {
            // Upload project file to Appwrite storage
            const response = await storage.createFile(
              "67d541b9000f5101fd5d", // Replace with your bucket ID
              ID.unique(), // Generate a unique ID for the file
              file
            );
            // Add file metadata to the uploadedFiles array
            // setProjectFileAttachments(response);
            uploadedFiles.push({
              fileId: response.$id,
              fileName: file.name,
              fileSize: file.size,
              fileType: file.type,
            });



          } catch (error) {
            console.error("File upload failed:", error);
            console.error(`Failed to upload file: ${file.name}`);
          }
        }
        // Upload project images
        for (const image of projectImages) {
          try {
            const response = await storage.createFile(
              "67d541b9000f5101fd5d", // Replace with your bucket ID
              ID.unique(), // Generate a unique ID for the image
              image
            );
            console.log("image uploaded successfully", response);
            // Add image metadata to the uploadedImages array
            uploadedImages.push({
              imageId: response.$id,
              imageName: image.name,
              imageSize: image.size,
              imageType: image.type,
            });
            // setProjectImagesAttachments(response);

          } catch (error) {
            console.error("Image upload failed:", error);
            console.error(`Failed to upload image: ${image.name}`);
          }
        }
        // under projects collection
        const projectId = ID.unique();
        await databases
          .createDocument(
            database_id,
            "67d08e5700221884ebb9", // projects collection
            projectId, // unique id for project
            {
              projectId: projectId,
              uploadBy: userId,
              title: projectData.title,
              description: projectData.description,
              category: projectData.category,
              projectHead: projectData.head,
              teamMembers: projectData.teamMembers,
              dueDate: projectData.dueDate,
              githubLink: projectData.githubLink,
              hodStatus: projectData.hodStatus,
              proheadStatus: projectData.proheadStatus,
              hodComment: projectData.hodComment,
              proheadComment: projectData.proheadComment,
              attachments: [],
              images: [],
            }
          )
          .then(() => {
            console.log("project submitted under projects collection");
          });

          const projectCollectionRes = await databases.listDocuments(
            database_id,
            "67d08e5700221884ebb9",
            [Query.equal("projectId", projectId)]
          );

          if (projectCollectionRes.documents.length > 0) {

            const document = projectCollectionRes.documents[0];

            const updatedProjectFiles = [
              ...document.attachments,
              JSON.stringify(uploadedFiles),
            ];
            const updatedProjectImages = [
              ...document.images,
              JSON.stringify(uploadedImages),
            ];
            await databases.updateDocument(
              database_id,
              "67d08e5700221884ebb9",
              projectId,
              {
                attachments: updatedProjectFiles,
                images: updatedProjectImages,
              }
            );

            console.log("project collection data is ", document);
          } else {
            console.error("Document not found");
          }

        
         
  
        const document = response1.documents[0];
        const updatedProjects = [
          ...document.Projects,
          JSON.stringify(
            {
              ...projectData,
              projectId: projectId,
              attachments: uploadedFiles,
              images: uploadedImages,
            }),
        ];

        // under students collection
        await databases
          .updateDocument(
            database_id, // Replace with your database ID
            "67d08e060038dec0bac3", // Collection ID of students
            userId, // Document ID
            { Projects: updatedProjects }
          )
          .then(() => {
            console.log("project submitted under students collection");
          });

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
        setProjects(document.Projects.map((project) => JSON.parse(project)));
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
      const res1 = await account.get();
      setUser(res1);
    } catch (error) {
      setUser(null);
    }
  };

  // fetch user role from common db
  const fetchUserRoleFromCommonDB = async (userId) => {
    try {
      const response = await databases.listDocuments(
        database_id,
        "67d72e1b0015ed5fb71d", // collection id for common db
        [Query.equal("userid", userId)]
      );

      if (response.documents.length > 0) {
        const document = response.documents[0];
        return document.Role;
      } else {
        console.error("Document not found");
        return null;
      }
    } catch (error) {
      console.error("Failed to fetch user role from common db", error);
      return null;
    }
  };

  // check user role
  const getUserRole = async (userID) => {
    try {
      const role = await fetchUserRoleFromCommonDB(userID);
      return role;
    } catch (error) {
      console.log("no getting user role ", error);
      return null;
    }
  };

  const checkRole = async () => {
    const current = await account.get();
    const currentrole = await getUserRole(current.$id);
    setCurrentRole(currentrole);
    console.log("current user is ", current);
    console.log("current role is ", currentrole);
  };

  useEffect(() => {
    checkRole();
  }, [user]);

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
        fetchUserRole,
        currentRole,
        setCurrentRole,
        fetchRecentProjects,
        recentProjects,
        fetchUserRoleFromCommonDB,
        getUserRole,
      }}
    >
      {children}
    </UserContext.Provider>
  );
};

export default UserContextProvider;
