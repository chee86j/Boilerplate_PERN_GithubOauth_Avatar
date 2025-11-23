import React from 'react';
import { useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import { GithubIcon, User as UserIcon } from 'lucide-react';

const Home = () => {
  const { isAuthenticated, user } = useSelector((state) => state.auth);

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800">
      <div className="container mx-auto px-4 py-8 md:py-16">
        <div className="max-w-2xl mx-auto">
          {isAuthenticated && user ? (
            <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-6 md:p-8 space-y-6">
              {/* User Welcome Section */}
              <div className="flex flex-col md:flex-row items-center gap-6 pb-6 border-b border-gray-200 dark:border-gray-700">
                <div className="relative">
                  {user?.avatar ? (
                    <img
                      src={user.avatar}
                      alt={user.username || 'User avatar'}
                      className="w-24 h-24 md:w-32 md:h-32 rounded-full object-cover border-4 border-blue-500 shadow-lg"
                    />
                  ) : (
                    <div className="w-24 h-24 md:w-32 md:h-32 rounded-full bg-gray-200 dark:bg-gray-700 flex items-center justify-center">
                      <UserIcon size={48} className="text-gray-400 dark:text-gray-500" />
                    </div>
                  )}
                  <div className="absolute -bottom-2 -right-2 bg-green-500 w-6 h-6 rounded-full border-4 border-white dark:border-gray-800"></div>
                </div>
                <div className="text-center md:text-left">
                  <h1 className="text-2xl md:text-3xl font-bold text-gray-900 dark:text-white">
                    Welcome back, {user.username || 'User'}!
                  </h1>
                  <p className="text-gray-600 dark:text-gray-400 mt-2">
                    {user.email || 'Loading...'}
                  </p>
                </div>
              </div>

              {/* Quick Actions */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Link
                  to="/profile"
                  className="flex items-center justify-center gap-2 px-6 py-3 bg-blue-500 hover:bg-blue-600 text-white rounded-lg transition-colors duration-200"
                >
                  <UserIcon size={20} />
                  <span>View Profile</span>
                </Link>
                <Link
                  to="/settings"
                  className="flex items-center justify-center gap-2 px-6 py-3 bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600 text-gray-700 dark:text-gray-200 rounded-lg transition-colors duration-200"
                >
                  <GithubIcon size={20} />
                  <span>GitHub Settings</span>
                </Link>
              </div>

              {/* Recent Activity or Stats */}
              <div className="mt-8 grid grid-cols-2 md:grid-cols-3 gap-4">
                <div className="bg-gray-50 dark:bg-gray-700/50 p-4 rounded-lg text-center">
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Profile Views</h3>
                  <p className="text-2xl font-bold text-blue-500">-</p>
                </div>
                <div className="bg-gray-50 dark:bg-gray-700/50 p-4 rounded-lg text-center">
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Repositories</h3>
                  <p className="text-2xl font-bold text-blue-500">-</p>
                </div>
                <div className="hidden md:block bg-gray-50 dark:bg-gray-700/50 p-4 rounded-lg text-center">
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Contributions</h3>
                  <p className="text-2xl font-bold text-blue-500">-</p>
                </div>
              </div>
            </div>
          ) : (
            <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-6 md:p-8 space-y-6">
              <div className="text-center space-y-4">
                <GithubIcon size={48} className="mx-auto text-gray-700 dark:text-gray-300" />
                <h1 className="text-2xl md:text-3xl font-bold text-gray-900 dark:text-white">
                  Welcome to GitHub OAuth App
                </h1>
                <p className="text-gray-600 dark:text-gray-400 max-w-md mx-auto">
                  Connect with GitHub to manage your profile, view repositories, and more.
                </p>
              </div>

              <div className="flex flex-col sm:flex-row gap-4 justify-center mt-8">
                <Link
                  to="/login"
                  className="flex items-center justify-center gap-2 px-6 py-3 bg-gray-900 hover:bg-gray-800 dark:bg-gray-700 dark:hover:bg-gray-600 text-white rounded-lg transition-colors duration-200"
                >
                  <GithubIcon size={20} />
                  <span>Continue with GitHub</span>
                </Link>
                <Link
                  to="/register"
                  className="flex items-center justify-center gap-2 px-6 py-3 bg-blue-500 hover:bg-blue-600 text-white rounded-lg transition-colors duration-200"
                >
                  <span>Create Account</span>
                </Link>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Home;