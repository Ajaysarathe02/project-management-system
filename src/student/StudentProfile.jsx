import React, { useContext,useEffect } from 'react'
import { UserContext } from '../context/contextApi'

function StudentProfile() {

    const {user} = useContext(UserContext);

    useEffect(() => {
      console.log(user)
    }, [])
    

  return (
    
<div className="bg-gray-900 font-sans">
    <div className="min-h-screen flex">
      
        <main className="flex-1 w-full">
          
            <div className="w-full mx-auto px-4 sm:px-6 lg:px-8 py-8">
                <div className="bg-gray-800 shadow-xl rounded-xl p-8 transform transition-all duration-300 hover:shadow-2xl">
                    <h1 className="text-3xl font-bold mb-8 text-white border-b border-gray-700 pb-4">Profile</h1>
                    <div className="space-y-8">
                        <div>
                            <h2 className="text-lg font-medium mb-4 text-white">Profile picture</h2>
                            <div className="flex items-center space-x-8 bg-gray-750 p-6 rounded-xl border border-gray-700">
                                <div className="flex-shrink-0">
                                    <img src="https://creatie.ai/ai/api/search-image?query=A professional headshot portrait of a person wearing glasses with curly hair against a neutral background, looking directly at camera with a friendly expression&width=128&height=128&orientation=squarish&flag=57b3d508-c33e-4795-8f55-769c0dc841ab&flag=f551cb51-8ad9-4c11-9680-a8c6337542ea&flag=b15b23c6-8df3-4e78-8c6f-852c45454ecc&flag=6a5b8f48-e7c9-4624-85a3-bb5d6c7d9187&flag=6f01520b-837b-46b6-9dd8-5aafd2f25762&flag=cc7b0d1e-70d5-43db-9369-87e473e21055&flag=ae1fec7d-f1c6-4ef7-8300-37a3796b36a4" alt="Profile picture" className="h-32 w-32 rounded-xl object-cover ring-4 ring-custom shadow-lg transform transition-all duration-300 hover:scale-105"/>
                                </div>
                                <div>
                                    <button className="bg-custom text-white px-6 py-2 rounded-lg shadow-md hover:bg-custom-dark transition-all duration-300 mb-2">
                                        Change picture
                                    </button>
                                    <p className="text-sm text-gray-400">
                                        Supported formats: jpg, png, or gif. Max file size: 500kb.
                                    </p>
                                </div>
                            </div>
                        </div>
                        <div className="space-y-6 bg-gray-750 p-6 rounded-xl border border-gray-700">
                            <div>
                                <label className="block text-sm font-medium text-gray-300 mb-1">
                                    Full name*
                                </label>
                                <input type="text" value={user?.name} className="w-full px-4 py-3 bg-gray-700 border-gray-600 text-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-custom focus:border-custom placeholder-gray-400 transition-all duration-300"/>
                            </div>
                            <div>
                                <div className="flex items-center justify-between mb-1">
                                    <label className="block text-sm font-medium text-gray-300">
                                        Email address
                                    </label>
                                    <button className="text-sm text-custom hover:text-custom-dark">
                                        Change email
                                    </button>
                                </div>
                                <input type="email" value={user?.email} disabled="" className="w-full px-4 py-3 bg-gray-700 border-gray-600 text-gray-400 rounded-lg transition-all duration-300"/>
                            </div>
                            <br />
                            <label>Email verification   : {user?.emailVerification ? "Verified" : "not verified" }</label>
                            <br /><br />
                            <label>Phone verification   : {user?.phoneVerification ? "Verified" : "not verified" }</label>
                        </div>
                        
                    <div className="space-y-6 mt-8 bg-gray-750 p-6 rounded-xl border border-gray-700"><h2 className="text-lg font-medium mb-4 text-white">Academic Information</h2><div className="grid grid-cols-2 gap-4"><div><label className="block text-sm font-medium text-gray-300 mb-1">Student ID/Roll</label><input type="text" value="" disabled="false" className="w-full px-4 py-2 bg-gray-700 border-gray-600 text-gray-400 rounded-lg" placeholder="Enter your student ID"/></div><div><label className="block text-sm font-medium text-gray-300 mb-1">Branch</label><input type="text" placeholder="Enter your branch" className="w-full px-4 py-2 bg-gray-700 border-gray-600 text-gray-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-custom focus:border-custom"/></div><div><label className="block text-sm font-medium text-gray-300 mb-1">Semester</label><select className="w-full px-4 py-2 bg-gray-700 border-gray-600 text-gray-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-custom focus:border-custom"><option>1st Semester</option><option>2nd Semester</option><option>3rd Semester</option><option>4th Semester</option><option>5th Semester</option><option>6th Semester</option><option>7th Semester</option><option>8th Semester</option></select></div></div><div className="flex items-center space-x-4 pt-4 mt-6"><button className="px-8 py-3 border border-gray-600 text-gray-300 rounded-lg hover:bg-gray-700 transition-all duration-300">Discard</button><button className="px-8 py-3 bg-custom text-white rounded-lg hover:bg-custom-dark transition-all duration-300 shadow-lg">Update details</button></div></div></div>
                </div>
            </div>
        </main>
    </div>
</div>
  )
}

export default StudentProfile