import React, { useState, useEffect } from 'react';
import { madeByAPI } from '../services/api';
import Navbar from '../components/Navbar';
import { FiGithub, FiInstagram, FiMail, FiExternalLink } from 'react-icons/fi';

const MadeBy = () => {
  const [developer, setDeveloper] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDeveloperInfo();
  }, []);

  const fetchDeveloperInfo = async () => {
    try {
      const response = await madeByAPI.getDeveloperInfo();
      setDeveloper(response.data);
    } catch (error) {
      console.error('Error fetching developer info:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Navbar />
        <div className="flex justify-center py-12">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
        </div>
      </div>
    );
  }

  if (!developer) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Navbar />
        <div className="max-w-4xl mx-auto px-4 py-8">
          <div className="bg-white rounded-lg shadow-md p-12 text-center">
            <p className="text-gray-500 text-lg">Developer information not available</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      
      <div className="max-w-4xl mx-auto px-4 py-8">
        <div className="bg-white rounded-lg shadow-xl p-8 md:p-12">
          {/* Header */}
          <div className="text-center mb-8">
            <h1 className="text-4xl font-bold text-gray-900 mb-2">About CampusCircle</h1>
            <p className="text-gray-600 text-lg">Made with passion for our college community</p>
          </div>

          {/* Developer Info */}
          <div className="max-w-2xl mx-auto">
            {/* Avatar */}
            <div className="flex justify-center mb-6">
              <div className="w-32 h-32 rounded-full bg-gradient-to-br from-primary-500 to-primary-700 flex items-center justify-center text-white font-bold text-5xl shadow-lg">
                {developer.developerName?.charAt(0).toUpperCase()}
              </div>
            </div>

            {/* Name */}
            <h2 className="text-3xl font-bold text-gray-900 text-center mb-2">
              {developer.developerName}
            </h2>
            <p className="text-center text-gray-600 mb-8">Full Stack Developer</p>

            {/* Message */}
            <div className="bg-primary-50 border-l-4 border-primary-600 p-6 rounded-lg mb-8">
              <p className="text-gray-700 leading-relaxed">{developer.message}</p>
            </div>

            {/* Links */}
            <div className="space-y-4">
              {developer.github && (
                <a
                  href={developer.github}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center justify-between p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
                >
                  <div className="flex items-center space-x-3">
                    <FiGithub className="text-2xl text-gray-700" />
                    <div>
                      <p className="font-semibold text-gray-900">GitHub</p>
                      <p className="text-sm text-gray-600">Check out my projects</p>
                    </div>
                  </div>
                  <FiExternalLink className="text-gray-400" />
                </a>
              )}

              {developer.instagram && (
                <a
                  href={developer.instagram}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center justify-between p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
                >
                  <div className="flex items-center space-x-3">
                    <FiInstagram className="text-2xl text-pink-600" />
                    <div>
                      <p className="font-semibold text-gray-900">Instagram</p>
                      <p className="text-sm text-gray-600">Follow me on Instagram</p>
                    </div>
                  </div>
                  <FiExternalLink className="text-gray-400" />
                </a>
              )}

              {developer.email && (
                <a
                  href={`mailto:${developer.email}`}
                  className="flex items-center justify-between p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
                >
                  <div className="flex items-center space-x-3">
                    <FiMail className="text-2xl text-primary-600" />
                    <div>
                      <p className="font-semibold text-gray-900">Email</p>
                      <p className="text-sm text-gray-600">{developer.email}</p>
                    </div>
                  </div>
                  <FiExternalLink className="text-gray-400" />
                </a>
              )}

              {developer.portfolio && (
                <a
                  href={developer.portfolio}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center justify-between p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
                >
                  <div className="flex items-center space-x-3">
                    <FiExternalLink className="text-2xl text-primary-600" />
                    <div>
                      <p className="font-semibold text-gray-900">Portfolio</p>
                      <p className="text-sm text-gray-600">Visit my portfolio</p>
                    </div>
                  </div>
                  <FiExternalLink className="text-gray-400" />
                </a>
              )}
            </div>

            {/* Tech Stack */}
            <div className="mt-12 pt-8 border-t border-gray-200">
              <h3 className="text-xl font-bold text-gray-900 mb-4 text-center">Built With</h3>
              <div className="flex flex-wrap justify-center gap-3">
                {['React', 'Node.js', 'Express', 'MongoDB', 'Tailwind CSS', 'JWT'].map((tech) => (
                  <span
                    key={tech}
                    className="px-4 py-2 bg-primary-100 text-primary-700 rounded-full font-semibold text-sm"
                  >
                    {tech}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MadeBy;



