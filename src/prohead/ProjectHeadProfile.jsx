import React, { useContext } from "react";
import ProfilePage from "../components/ProfilePage";
import { ProjectHeadContext } from "../context/contextApi";
import { APPWRITE_CONFIG } from "../lib/appwriteConfig";

function ProjectHeadProfile() {
  const { projectHead, setProjectHeadPicture } = useContext(ProjectHeadContext);

  const roleSpecificFields = [
    { label: "Professor ID", value: projectHead?.ProjectHeadID },
    { label: "Department", value: projectHead?.Department },
    { label: "Designation", value: projectHead?.Designation },
  ];

  return (
    <ProfilePage
      userData={{
        id: projectHead?.userid,
        name: projectHead?.Name,
        email: projectHead?.Email,
        bio: projectHead?.Bio,
        profilePicture: projectHead?.profilePictureId,
        profilePictureId: projectHead?.profilePictureId,
        role: "project-head",
      }}
      onUpdateProfilePicture={(url) => console.log("New profile picture URL:", url)}
      roleSpecificFields={roleSpecificFields}
      bucketId={APPWRITE_CONFIG.BUCKETS.FILES}
      collectionId={APPWRITE_CONFIG.COLLECTIONS.PROJECT_HEAD}
    />
  );
}

export default ProjectHeadProfile;