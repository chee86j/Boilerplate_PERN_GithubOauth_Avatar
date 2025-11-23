import React, { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { updateUser, deleteUser, clearError } from '../../store/userSlice';
import { fetchUserData, logoutUser } from '../../store/authSlice';
import { usernameValidator, passwordValidator, emailValidator } from '../../utils/validators';
import { defaultAvatar, processImageUrl, resizeImage, avatarImage2 } from '../../utils/images';
import Modal from '../ui/Modal';
import Avatar from 'react-avatar-edit';
import { toast } from 'react-toastify';

// Keep the profile feature self-contained (validation, avatar handling, persistence) so routes can stay thin.
const EditAccount = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { user, loading: authLoading, error: authError, isAuthenticated } = useSelector((state) => state.auth);
  const { loading: userLoading, error: userError } = useSelector((state) => state.user);
  const [isInitialized, setIsInitialized] = useState(false);

  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: '',
    confirmPassword: '',
  });
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [preview, setPreview] = useState(null);
  const [avatarUrl, setAvatarUrl] = useState(avatarImage2);
  const [showPassword, setShowPassword] = useState(false);
  const [validationErrors, setValidationErrors] = useState({});
  const [isDirty, setIsDirty] = useState({
    username: false,
    email: false,
    password: false,
    confirmPassword: false,
  });

  // Load user data if not present but we have authentication
  useEffect(() => {
    const loadUserData = async () => {
      // Only try to load user data if we're authenticated but don't have user data
      if (isAuthenticated && !user && !authLoading) {
        try {
          await dispatch(fetchUserData()).unwrap();
        } catch (error) {
          console.error('Failed to load user data:', error);
          // Only show error toast for non-401 errors
          if (!error.includes('No valid token')) {
            toast.error(error || 'Failed to load user data');
          }
          navigate('/login');
        }
      } else if (!isAuthenticated) {
        // If not authenticated, just redirect without error
        navigate('/login');
      }
      setIsInitialized(true);
    };

    loadUserData();
  }, [user, authLoading, isAuthenticated, dispatch, navigate]);

  // Handle auth errors
  useEffect(() => {
    if (authError && !authError.includes('No valid token')) {
      toast.error(authError);
      navigate('/login');
    }
  }, [authError, navigate]);

  // Handle user errors
  useEffect(() => {
    if (userError) {
      toast.error(userError);
      dispatch(clearError());
    }
  }, [userError, dispatch]);

  // Update form data when user data changes
  useEffect(() => {
    if (user) {
      setFormData(prev => ({
        ...prev,
        username: user.username || '',
        email: user.email || '',
      }));
      // Process the user's avatar URL to base64
      if (user.avatar) {
        processImageUrl(user.avatar).then(setAvatarUrl);
      }
    }
  }, [user]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    setIsDirty(prev => ({
      ...prev,
      [name]: true
    }));
    validateField(name, value);
  };

  const validateField = (name, value) => {
    let error = null;

    switch (name) {
      case 'username':
        if (isDirty.username) {
          error = usernameValidator(value);
        }
        break;
      case 'email':
        if (isDirty.email) {
          error = emailValidator(value);
        }
        break;
      case 'password':
        if (isDirty.password) {
          error = passwordValidator(value);
          // Only check password match if both password fields are filled
          if (formData.password && formData.confirmPassword) {
            if (value !== formData.confirmPassword) {
              setValidationErrors(prev => ({
                ...prev,
                confirmPassword: 'Passwords do not match'
              }));
            } else {
              setValidationErrors(prev => ({
                ...prev,
                confirmPassword: null
              }));
            }
          }
        }
        break;
      case 'confirmPassword':
        if (isDirty.confirmPassword && formData.password) {
          error = value !== formData.password ? 'Passwords do not match' : null;
        }
        break;
      default:
        break;
    }

    return error;
  };

  const validateForm = () => {
    const fields = ['username', 'email'];
    
    // Only validate password fields if either is filled
    if (formData.password || formData.confirmPassword) {
      fields.push('password', 'confirmPassword');
    }

    const errors = {};
    let isValid = true;

    fields.forEach(field => {
      const error = validateField(field, formData[field]);
      if (error) {
        errors[field] = error;
        isValid = false;
      }
    });

    setValidationErrors(errors);
    return isValid;
  };

  const handleSubmit = async (e) => {
    if (e) e.preventDefault();
    
    // Mark all fields as dirty before validation
    setIsDirty({
      username: true,
      email: true,
      password: Boolean(formData.password),
      confirmPassword: Boolean(formData.confirmPassword),
    });

    console.log('Starting form validation...', formData);
    if (!validateForm()) {
      console.log('Form validation failed:', validationErrors);
      return;
    }
    console.log('Form validation passed');

    // Check if any fields have actually changed, safely handling null user
    const hasChanges = !user || 
      formData.username !== user.username ||
      formData.email !== user.email ||
      formData.password ||
      preview;

    if (!hasChanges) {
      toast.info('No changes to save');
      return;
    }

    // If user is null, we can't proceed
    if (!user) {
      toast.error('Unable to update profile: User data not loaded');
      return;
    }

    const updateData = {
      username: formData.username,
      email: formData.email
    };
    
    if (formData.password) {
      updateData.password = formData.password;
    }
    
    if (preview) {
      try {
        // Resize the image before sending
        const resizedAvatar = await resizeImage(preview, 400, 400);
        updateData.avatar = resizedAvatar;
      } catch (error) {
        console.error('Failed to resize avatar:', error);
        toast.error('Failed to process avatar image');
        return;
      }
    }

    console.log('Submitting update with data:', { 
      ...updateData, 
      password: updateData.password ? '[REDACTED]' : undefined,
      avatar: updateData.avatar ? '[BASE64]' : undefined
    });

    try {
      const result = await dispatch(updateUser({ id: user.id, ...updateData })).unwrap();
      console.log('Update successful:', result);
      
      if (preview) {
        setAvatarUrl(preview);
        setPreview(null);
      }
      
      toast.success('Profile updated successfully');
      setFormData(prev => ({
        ...prev,
        password: '',
        confirmPassword: ''
      }));
      setIsDirty(prev => ({
        ...prev,
        password: false,
        confirmPassword: false
      }));
      setIsModalOpen(false);
    } catch (error) {
      console.error('Update failed:', error);
      toast.error(error?.message || 'Failed to update profile');
    }
  };

  const handleDeleteAccount = async () => {
    if (window.confirm('Are you sure you want to delete your account? This action cannot be undone.')) {
      try {
        await dispatch(deleteUser(user.id)).unwrap();
        toast.success('Account deleted successfully');
        navigate('/login');
      } catch (error) {
        toast.error('Failed to delete account');
      }
    }
  };

  const onClose = () => {
    setPreview(null);
  };

  const onCrop = async (previewUrl) => {
    setPreview(previewUrl);
  };

  const onBeforeFileLoad = (elem) => {
    if (elem.target.files[0].size > 5000000) {
      toast.error('File is too large (max 5MB)');
      elem.target.value = '';
    }
  };

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

  if (!isInitialized || authLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-teal-500"></div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-800 mb-4">Access Denied</h2>
          <p className="text-gray-600 mb-4">Please log in to edit your profile.</p>
          <button
            onClick={() => navigate('/login')}
            className="inline-flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-teal-600 hover:bg-teal-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-teal-500"
          >
            Go to Login
          </button>
        </div>
      </div>
    );
  }

  if (userLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-teal-500 mx-auto mb-4"></div>
          <p className="text-gray-600">Saving changes...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100 py-12">
      <div className="container mx-auto px-4">
        <div className="max-w-2xl mx-auto bg-white rounded-lg shadow-md p-8">
          <div className="flex items-center space-x-6 mb-8">
            <div className="relative">
              <img
                src={preview || avatarUrl}
                alt={user?.username || 'Profile'}
                className="w-24 h-24 rounded-full border-4 border-teal-500 object-cover"
                onError={() => setAvatarUrl(defaultAvatar)}
              />
              <button
                onClick={() => setIsModalOpen(true)}
                className="absolute bottom-0 right-0 bg-teal-500 text-white rounded-full p-2 hover:bg-teal-600 transition-colors"
                title="Change avatar"
              >
                <svg
                  className="w-4 h-4"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z"
                  />
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M15 13a3 3 0 11-6 0 3 3 0 016 0z"
                  />
                </svg>
              </button>
            </div>
            <div>
              <h1 className="text-2xl font-bold">Edit Account</h1>
              <p className="text-gray-600">Update your profile information</p>
            </div>
          </div>

          <div className="flex justify-end mb-6">
            <button
              onClick={handleLogout}
              className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
            >
              Logout
            </button>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label htmlFor="username" className="block text-sm font-medium text-gray-700">
                Username
              </label>
              <input
                id="username"
                type="text"
                name="username"
                value={formData.username}
                onChange={handleInputChange}
                placeholder={user?.username || 'Enter username'}
                aria-label="Username"
                className={`mt-1 block w-full rounded-md shadow-sm ${
                  validationErrors.username
                    ? 'border-red-500 focus:border-red-500 focus:ring-red-500'
                    : 'border-gray-300 focus:border-teal-500 focus:ring-teal-500'
                }`}
              />
              {validationErrors.username && (
                <p className="mt-1 text-sm text-red-600" role="alert">
                  {validationErrors.username}
                </p>
              )}
            </div>

            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                Email
              </label>
              <input
                id="email"
                type="email"
                name="email"
                value={formData.email}
                onChange={handleInputChange}
                placeholder={user?.email || 'Enter email'}
                aria-label="Email address"
                className={`mt-1 block w-full rounded-md shadow-sm ${
                  validationErrors.email
                    ? 'border-red-500 focus:border-red-500 focus:ring-red-500'
                    : 'border-gray-300 focus:border-teal-500 focus:ring-teal-500'
                }`}
              />
              {validationErrors.email && (
                <p className="mt-1 text-sm text-red-600" role="alert">
                  {validationErrors.email}
                </p>
              )}
            </div>

            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-700">
                New Password
              </label>
              <div className="relative">
                <input
                  id="password"
                  type={showPassword ? 'text' : 'password'}
                  name="password"
                  value={formData.password}
                  onChange={handleInputChange}
                  placeholder="Enter new password (optional)"
                  aria-label="New password"
                  className={`mt-1 block w-full rounded-md shadow-sm ${
                    validationErrors.password
                      ? 'border-red-500 focus:border-red-500 focus:ring-red-500'
                      : 'border-gray-300 focus:border-teal-500 focus:ring-teal-500'
                  }`}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute inset-y-0 right-0 pr-3 flex items-center"
                  aria-label={showPassword ? 'Hide password' : 'Show password'}
                >
                  <svg
                    className={`h-5 w-5 ${
                      showPassword ? 'text-gray-400' : 'text-gray-500'
                    }`}
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                    aria-hidden="true"
                  >
                    {showPassword ? (
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                      />
                    ) : (
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21"
                      />
                    )}
                  </svg>
                </button>
              </div>
              {validationErrors.password && (
                <p className="mt-1 text-sm text-red-600" role="alert">
                  {validationErrors.password}
                </p>
              )}
            </div>

            <div>
              <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700">
                Confirm New Password
              </label>
              <input
                id="confirmPassword"
                type="password"
                name="confirmPassword"
                value={formData.confirmPassword}
                onChange={handleInputChange}
                placeholder="Confirm new password"
                aria-label="Confirm new password"
                className={`mt-1 block w-full rounded-md shadow-sm ${
                  validationErrors.confirmPassword
                    ? 'border-red-500 focus:border-red-500 focus:ring-red-500'
                    : 'border-gray-300 focus:border-teal-500 focus:ring-teal-500'
                }`}
              />
              {validationErrors.confirmPassword && (
                <p className="mt-1 text-sm text-red-600" role="alert">
                  {validationErrors.confirmPassword}
                </p>
              )}
            </div>

            <div className="flex justify-between">
              <button
                type="submit"
                disabled={userLoading}
                className="inline-flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-teal-600 hover:bg-teal-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-teal-500 disabled:opacity-50"
              >
                {userLoading ? 'Saving...' : 'Save Changes'}
              </button>
              <button
                type="button"
                onClick={handleDeleteAccount}
                className="inline-flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
              >
                Delete Account
              </button>
            </div>
          </form>
        </div>
      </div>

      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)}>
        <div className="p-6">
          <h2 className="text-2xl font-bold mb-4">Update Avatar</h2>
          <Avatar
            width={400}
            height={300}
            onCrop={onCrop}
            onClose={onClose}
            onBeforeFileLoad={onBeforeFileLoad}
            label="Choose an image"
          />
          <div className="mt-4 flex justify-end">
            <button
              onClick={handleSubmit}
              disabled={!preview}
              className={`ml-3 inline-flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white ${
                preview
                  ? 'bg-blue-600 hover:bg-blue-700'
                  : 'bg-gray-400 cursor-not-allowed'
              } focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500`}
            >
              Save Avatar
            </button>
          </div>
        </div>
      </Modal>
    </div>
  );
};

export default EditAccount;