import React from 'react';
import { useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import { GithubIcon } from 'lucide-react';

const HomePage = () => {
  const { isAuthenticated, user } = useSelector((state) => state.auth);

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-900 to-gray-800 text-white">
      <div className="container mx-auto px-4 py-16">
        <div className="max-w-4xl mx-auto text-center">
          <h1 className="text-5xl font-bold mb-6">
            Welcome to GitHub OAuth App
          </h1>
          
          <p className="text-xl text-gray-300 mb-8">
            A modern authentication system built with React, Node.js, and GitHub OAuth
          </p>

          {isAuthenticated ? (
            <div className="space-y-6">
              <div className="flex items-center justify-center space-x-4">
                {user.avatar && (
                  <img
                    src={user.avatar}
                    alt={user.username}
                    className="w-16 h-16 rounded-full border-2 border-teal-500"
                  />
                )}
                <div className="text-left">
                  <h2 className="text-2xl font-semibold">
                    Welcome back, {user.username}!
                  </h2>
                  <p className="text-gray-400">{user.email}</p>
                </div>
              </div>
              
              <div className="flex justify-center space-x-4">
                <Link
                  to="/profile"
                  className="btn-primary flex items-center space-x-2"
                >
                  <span>View Profile</span>
                </Link>
                <Link
                  to="/dashboard"
                  className="btn bg-gray-700 hover:bg-gray-600 flex items-center space-x-2"
                >
                  <span>Dashboard</span>
                </Link>
              </div>
            </div>
          ) : (
            <div className="space-y-6">
              <div className="flex flex-col items-center space-y-4">
                <Link
                  to="/login"
                  className="btn-primary flex items-center space-x-2 w-64 justify-center"
                >
                  <GithubIcon size={20} />
                  <span>Continue with GitHub</span>
                </Link>
                
                <div className="relative w-64">
                  <div className="absolute inset-0 flex items-center">
                    <div className="w-full border-t border-gray-600"></div>
                  </div>
                  <div className="relative flex justify-center text-sm">
                    <span className="px-2 bg-gray-900 text-gray-400">
                      Or continue with
                    </span>
                  </div>
                </div>

                <Link
                  to="/register"
                  className="btn bg-gray-700 hover:bg-gray-600 w-64 text-center"
                >
                  Create Account
                </Link>
              </div>

              <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="bg-gray-800 p-6 rounded-lg">
                  <h3 className="text-xl font-semibold mb-2">Secure Authentication</h3>
                  <p className="text-gray-400">
                    Built with JWT and GitHub OAuth for maximum security
                  </p>
                </div>
                
                <div className="bg-gray-800 p-6 rounded-lg">
                  <h3 className="text-xl font-semibold mb-2">User Profiles</h3>
                  <p className="text-gray-400">
                    Customizable profiles with avatar support
                  </p>
                </div>
                
                <div className="bg-gray-800 p-6 rounded-lg">
                  <h3 className="text-xl font-semibold mb-2">Modern UI</h3>
                  <p className="text-gray-400">
                    Beautiful interface built with Tailwind CSS
                  </p>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default HomePage;