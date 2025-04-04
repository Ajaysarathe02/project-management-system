import React, { useContext, useEffect, useState } from 'react'
import StatusModal from '../components/StatusModal'
import ProfilePage from '../components/ProfilePage'
import { StudentContext, UserContext } from '../context/contextApi';
import { APPWRITE_CONFIG } from '../lib/appwriteConfig';
import { s } from 'motion/react-m';
import { Query } from 'appwrite';

function StudentProfile() {

    const { user } = useContext(UserContext)
    const { studentProfileData } = useContext(StudentContext)

  
    const roleSpecificFields = [
        { label: "Student ID", value: studentProfileData?.Roll },
        { label: "Branch", value: studentProfileData?.Branch },

    ];



    return (
        <ProfilePage
            userData={{
                id: studentProfileData?.userid,
                name: studentProfileData?.Name,
                email: studentProfileData?.Email,
                bio: studentProfileData?.Bio,
                profilePicture: studentProfileData?.userPicture,
                profilePictureId: studentProfileData?.userPicture,
                role: studentProfileData?.Role,
            }}
            onUpdateProfilePicture={(url) => console.log("New profile picture URL:", url)}
            roleSpecificFields={roleSpecificFields}
            bucketId={APPWRITE_CONFIG.BUCKETS.FILES}
            collectionId={APPWRITE_CONFIG.COLLECTIONS.STUDENTS}
        />
    );
}

export default StudentProfile