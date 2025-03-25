import React, { useContext } from 'react'
import { ProjectHeadContext } from '../context/contextApi';

function ProjectHeadProfile() {

const { projectHead } = useContext(ProjectHeadContext)

  return (
    <div className="bg-gray-900 min-h-screen rounded-2xl">
      <div className="max-w-8xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <h1 className="text-2xl font-semibold text-white">Profile</h1>
        <p className="mt-2 text-gray-400">View and edit your profile details</p>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-1">
            <div className="bg-gray-800 shadow rounded-lg p-6">
              <div className="text-center">
                <div className="relative inline-block">
                  <img
                    className="h-32 w-32 rounded-full object-cover mx-auto"
                    src="https://e7.pngegg.com/pngimages/799/987/png-clipart-computer-icons-avatar-icon-design-avatar-heroes-computer-wallpaper-thumbnail.png"
                    alt="Profile photo"
                  />
                  <button className="absolute bottom-0 right-0 bg-custom text-white p-2 rounded-full shadow-lg !rounded-button">
                    <i className="fas fa-camera"></i>
                  </button>
                </div>
                <h2 className="mt-4 text-xl font-semibold text-white">
                  {projectHead?.Name}
                </h2>
                <p className="text-gray-400">Professor ID : ST2023456</p>

                <div className="mt-6 space-y-4">
                  <div className="flex items-center justify-center space-x-2">
                    <i className="fas fa-envelope text-green-400"></i>
                    <span className="text-sm text-gray-300">
                      Email Verified
                    </span>
                    <i className="fas fa-check-circle text-green-400"></i>
                  </div>
                  <div className="flex items-center justify-center space-x-2">
                    <i className="fas fa-phone text-green-400"></i>
                    <span className="text-sm text-gray-300">
                      Phone Verified
                    </span>
                    <i className="fas fa-check-circle text-green-400"></i>
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-gray-800 shadow rounded-lg p-6 mt-8">
              <h3 className="text-lg font-semibold text-white mb-4">Bio</h3>
              <p className="text-gray-300">
                Passionate computer science student with a keen interest in
                artificial intelligence and machine learning. Always eager to
                learn new technologies and contribute to innovative projects.
              </p>
            </div>
          </div>

          <div className="lg:col-span-2 space-y-8">
            <div className="bg-gray-800 shadow rounded-lg p-6">
              <h3 className="text-lg font-semibold text-white mb-6">
                Personal Information
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-300">
                    Full Name
                  </label>
                  <p className="mt-1 text-white">{projectHead?.Name}</p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-300">
                    Email Address
                  </label>
                  <p className="mt-1 text-white">{projectHead?.Email}</p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-300">
                    Phone Number
                  </label>
                  <p className="mt-1 text-white">+1 (555) 123-4567</p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-300">
                    Date of Birth
                  </label>
                  <p className="mt-1 text-white">March 15, 2000</p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-300">
                    Gender
                  </label>
                  <p className="mt-1 text-white">Female</p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-300">
                    Address
                  </label>
                  <p className="mt-1 text-white">
                    123 University Ave, College Town, ST 12345
                  </p>
                </div>
              </div>
            </div>

            <div className="bg-gray-800 shadow rounded-lg p-6">
              <h3 className="text-lg font-semibold text-white mb-6">
                Academic Information
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-300">
                    Professor ID
                  </label>
                  <p className="mt-1 text-white">ST2023456</p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-300">
                    Branch/Department
                  </label>
                  <p className="mt-1 text-white">{projectHead?.Department}</p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-300">
                    Designation
                  </label>
                  <p className="mt-1 text-white">{projectHead?.Designation}</p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-300">
                    Admission Year
                  </label>
                  <p className="mt-1 text-white">2020</p>
                </div>
               
              </div>
            </div>
          </div>
        </div>

        <div className="mt-8 flex justify-center">
          <button className="bg-custom hover:bg-custom/90 text-white px-8 py-3 rounded-lg shadow-lg transition-all duration-200 !rounded-button">
            <i className="fas fa-edit mr-2"></i>
            Update Profile
          </button>
        </div>
      </div>

      <footer className="bg-gray-800 mt-12">
        <div className="max-w-8xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="text-center text-gray-400 text-sm">
            © 2024 Jec Project Portal. All rights reserved.
          </div>
        </div>
      </footer>
    </div>
  );
}

export default ProjectHeadProfile