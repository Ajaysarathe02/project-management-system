<p align="center">
  <img src="public/assets/README-images/your-project-logo.png" alt="Project Logo" width="200">
</p>

<h1 align="center">Project Management System</h1>

<p align="center">
  A modern and efficient project management system built with React, Vite, and Appwrite. Manage projects, track submissions, and streamline workflows with ease.
</p>

<p align="center">
  <img src="https://img.shields.io/badge/React-v18.2.0-blue" alt="React Version">
  <img src="https://img.shields.io/badge/Vite-v4.0.0-purple" alt="Vite Version">
  <img src="https://img.shields.io/badge/Appwrite-Cloud-orange" alt="Appwrite">
  <img src="https://img.shields.io/badge/TailwindCSS-v4.0-blue" alt="Tailwind">
  <img src="https://img.shields.io/badge/License-MIT-green" alt="License">
</p>

---

## 🚀 Features

- 📂 **Project Management**: View, manage, and track project submissions.
- 🖼️ **File & Image Previews**: Download project files and preview images directly.
- 🌐 **Appwrite Integration**: Seamless backend integration with Appwrite for database and storage.
- 🎨 **Responsive Design**: Fully responsive UI for all devices.
- ⚡ **Fast & Lightweight**: Built with Vite for blazing-fast performance.

---

## 📸 Screenshots

  ### Dashboard 
<p align="center">
  <img style="border-radius:20" src="public/home.png" alt="Dashboard Screenshot" width="80%">
</p>

  ### Signup Page
<p align="center">
  <img src="public/signup.png" alt="Modal Screenshot" width="80%">
</p>

  ### Student Dashboard
<div align="center">
  <img src="public/student-dash.png" alt="Modal Screenshot" width="80%">
</div>

  ### Student Profile
<p align="center">
  <img src="public/student-profile.png" alt="Modal Screenshot" width="80%">
</p>

### Project Submission
<p align="center">
  <img src="public/submit-project-1.png" alt="Modal Screenshot" width="80%">
</p>
<p align="center">
  <img src="public/submit-project-2.png" alt="Modal Screenshot" width="80%">
</p>

---

## 🛠️ Tech Stack

- **Frontend**: React, TailwindCSS
- **Backend**: Appwrite (Database & Storage)
- **Build Tool**: Vite
- **Icons**: Font Awesome

---

## 📦 Installation

Follow these steps to set up the project locally:

1. Clone the repository:
   
   ```bash
   git clone https://github.com/your-username/project-management-system.git
   cd project-management-system
   ```

2. Install dependencies:

   ```bash
   npm install
   ```

3. Start the development server:
   
   ```bash
   npm run dev
   ```

4. Open your browser and navigate to:

   ```bash
   http://localhost:5173
   ```



## ⚙️ Configuration

1. Set up your Appwrite project:
   - create a database and collection for projects.
   - Configure storage for file uploads.

2. Update the Appwrite configuration in ```src/lib/appwrite.js ```:

   ```bash
   export const database_id = "<your-database-id>";
   export const storage_bucket_id = "<your-storage-bucket-id>";
   ```


## 🤝 Contributing

Contributions are welcome! Please follow these steps:

   1. Fork the repository :
   2. Create a new branch :
      
      ```bash
      git checkout -b feature/your-feature-name
      ```
  3. Commit your changes :
     
     ```bash
     git commit -m "Add your message here"
     ```
  4. Push to your changes :

     ```bash
     git push origin feature/your-feature-name
     ```

  5. Open a pull request.


## 📄 License
This project is licensed under the MIT License. See the LICENSE file for details.

## 🌟 Acknowledgements

- <a href="" > React </a>
- <a href="" > Vite </a>
- <a href="" > AppWrite </a>
- <a href="" > TailwindCSS </a>
- <a href="" > Font Awesome </a>

<p align="center"> Made with ❤️ by <a href="https://github.com/kumar21-crypto">Aniruddh</a> </p> 

## Notes:

  1. Replace ```<your-project-logo.png>``` and ```<screenshot.png>``` with actual image paths in your ```public/assets/README-images``` folder.

  2. Update placeholders like ```<your-database-id>``` and ```<your-storage-bucket-id>``` with your actual Appwrite configuration.

  3. Add your GitHub username and project link where applicable.
