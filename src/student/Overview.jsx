import React, { useContext, useEffect } from 'react';
import { UserContext } from '../context/contextApi';
import { Link } from 'react-router-dom';

function Overview() {
  const { user, recentProjects, fetchRecentProjects } = useContext(UserContext);

  useEffect(() => {
    if (user) {
      fetchRecentProjects(user.$id);
    }
  }, [user]);

  return (
    <div className="space-y-8">
      <header className="mb-8">
                  <h1 className="text-3xl text-white font-bold mb-6">Welcome back, {user ? user.name : "Students"}</h1>
                </header>
      <section className="bg-gray-800 shadow rounded-lg p-6">
        <h2 className="text-xl font-semibold text-white mb-4">Recent Submitted Projects</h2>
        <ul className="space-y-2">
          {recentProjects.map((project) => (
            <li key={project.$id} className="text-gray-300 flex">

              <p className='px-3 py-1 text-sm bg-green-500 bg-opacity-20 text-green-500 rounded'>{project.title}</p>
              <p className='ml-10'>{new Date(project.$createdAt).toLocaleString()}</p>
               
            </li>
          ))}
        </ul>
      </section>

      <section className="bg-gray-800 shadow rounded-lg p-6">
        <h2 className="text-xl font-semibold text-white mb-4">Upcoming Deadlines</h2>
        <ul className="space-y-2">
          <li className="text-gray-300">Project submission for Web Development - March 20, 2025</li>
          <li className="text-gray-300">Mid-term exams - April 5, 2025</li>
          <li className="text-gray-300">Hackathon registration - April 10, 2025</li>
        </ul>
      </section>

      <section className="bg-gray-800 shadow rounded-lg p-6">
        <h2 className="text-xl font-semibold text-white mb-4">Quick Links</h2>
        <ul className="space-y-2">
          <li>
            <Link to="/student-dash/profile" className="text-blue-400 hover:underline">View Profile</Link>
          </li>
          <li>
            <Link to="/student-dash/projects" className="text-blue-400 hover:underline">View Projects</Link>
          </li>
          <li>
            <Link to="/student-dash/submit-project" className="text-blue-400 hover:underline">Submit a Project</Link>
          </li>
        </ul>
      </section>
    </div>
  );
}

export default Overview;