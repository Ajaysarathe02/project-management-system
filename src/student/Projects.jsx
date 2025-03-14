import React, { useContext, useEffect } from "react";
import { UserContext } from "../context/contextApi";
import { motion } from "motion/react";

const Projects = () => {
  const { fetchProjects, user, projects } = useContext(UserContext);

  useEffect(() => {
    if (user) {
      fetchProjects(user.$id);
    }
  }, [user, fetchProjects]);

  const cardVariants = {
    hidden: {opacity:0, y:20},
    visible:{opacity:1, y:0},
  }

  return (
    <div className="bg-gray-800 rounded-xl p-6">
      <h2 className="text-2xl font-semibold mb-6 text-white">Projects</h2>
      <p className="text-gray-400 mb-4">List of projects will be displayed here.</p>
      {projects.length > 0 ? (

        <motion.div 
        animate="visible"
        initial="hidden"
        variants={{
          visible:{
            transition:{
              staggerChildren:0.1,
            }
          }
        }}

        className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {projects.map((data, index) => (

            <motion.div 
            key={index} 
            variants={cardVariants}
            className="bg-gray-700 p-6 rounded-lg shadow-lg">
              <h3 className="text-xl font-bold text-white mb-2">{data.title}</h3>
              <p className="text-gray-400 mb-4">{data.description}</p>
              <div className="text-gray-400 mb-2">
                <strong>Category:</strong> {data.category}
              </div>
              <div className="text-gray-400 mb-2">
                <strong>Project Head:</strong> {data.head}
              </div>
              <div className="text-gray-400 mb-2">
                <strong>GitHub Link:</strong> <a href={data.githubLink} target="_blank" rel="noopener noreferrer" className="text-blue-400 underline">{data.githubLink}</a>
              </div>
              <div className="text-gray-400 mb-2">
                <strong>Due Date:</strong> {data.dueDate}
              </div>
              <div className="text-gray-400 mb-2">
                <strong>Team Members:</strong>
                <ul className="list-disc list-inside ml-4">
                  {data.teamMembers.map((member, memberIndex) => (
                    <li key={memberIndex}>{member}</li>
                  ))}
                </ul>
              </div>
            </motion.div>
          ))}
        </motion.div>

      ) : (
        <p className="text-gray-400">No projects found.</p>
      )}
    </div>
  );
};

export default Projects;