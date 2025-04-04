import React, { useContext, useEffect, useState } from 'react'
import StatusModal from '../components/StatusModal'
import ProfilePage from '../components/ProfilePage'
import { HodContext, StudentContext, UserContext } from '../context/contextApi';
import { APPWRITE_CONFIG } from '../lib/appwriteConfig';

function HodProfile() {

    const { user } = useContext(UserContext)
   const {hodProfileData} = useContext(HodContext)
  
    const roleSpecificFields = [
        // { label: "Professor ID", value: hodProfileData?.Roll },
        { label: "Department", value: hodProfileData?.Department },
        { label: "Designation", value: hodProfileData?.Designation },

    ];


    return (
        <ProfilePage
            userData={{
                id: hodProfileData?.userid,
                name: hodProfileData?.Name,
                email: hodProfileData?.Email,
                bio: hodProfileData?.Bio,
                profilePicture: hodProfileData?.userPicture,
                profilePictureId: hodProfileData?.userPicture,
                role: hodProfileData?.Role,
            }}
            onUpdateProfilePicture={(url) => console.log("New profile picture URL:", url)}
            roleSpecificFields={roleSpecificFields}
            bucketId={APPWRITE_CONFIG.BUCKETS.FILES}
            collectionId={APPWRITE_CONFIG.COLLECTIONS.HOD}
        />
    );
}

export default HodProfile