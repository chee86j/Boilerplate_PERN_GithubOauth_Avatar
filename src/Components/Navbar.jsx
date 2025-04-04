import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { logoutUser } from '../store/authSlice';
import { toast } from 'react-toastify';

const Navbar = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { isAuthenticated, user, loading } = useSelector((state) => state.auth);

  const handleLogout = async () => {
    try {
      await dispatch(logoutUser()).unwrap();
      toast.success('Logged out successfully');
      navigate('/login');
    } catch (error) {
      console.error('Logout failed:', error);
      toast.error('Failed to logout');
    }
  };

  return (
    <nav className="bg-gray-800 text-white p-4">
      <div className="container mx-auto flex justify-between items-center">
        <Link to="/" className="text-xl font-bold">
          GitHub OAuth App
        </Link>
        
        <div className="flex items-center space-x-4">
          {!loading && (
            <>
              {isAuthenticated && user ? (
                <>
                  <Link 
                    to="/profile" 
                    className="hover:text-gray-300 flex items-center"
                  >
                    {user.avatar && (
                      <img 
                        src={user.avatar} 
                        alt="Profile" 
                        className="w-8 h-8 rounded-full mr-2"
                        onError={(e) => {
                          e.target.onerror = null;
                          e.target.style.display = 'none';
                        }}
                      />
                    )}
                    <span>{user.username}</span>
                  </Link>
                  <button
                    onClick={handleLogout}
                    className="bg-red-500 hover:bg-red-600 px-4 py-2 rounded transition-colors duration-200"
                  >
                    Logout
                  </button>
                </>
              ) : (
                <Link 
                  to="/login" 
                  className="bg-blue-500 hover:bg-blue-600 px-4 py-2 rounded transition-colors duration-200"
                >
                  Sign In
                </Link>
              )}
            </>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;