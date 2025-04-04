import React from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { setCredentials, fetchUserData } from '../store/authSlice';
import { toast } from 'react-toastify';

const GithubCallback = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [searchParams] = useSearchParams();

  React.useEffect(() => {
    const handleCallback = async () => {
      try {
        const token = searchParams.get('token');
        const error = searchParams.get('error');

        if (error) {
          console.error('Authentication error:', error);
          toast.error('Authentication failed. Please try again.');
          navigate('/login?error=auth_failed');
          return;
        }

        if (!token) {
          console.error('No token received');
          toast.error('No authentication token received. Please try again.');
          navigate('/login?error=no_token');
          return;
        }

        // Store token and fetch user data
        await dispatch(setCredentials({ token }));
        const resultAction = await dispatch(fetchUserData());

        if (fetchUserData.fulfilled.match(resultAction)) {
          toast.success('Successfully signed in with GitHub!');
          navigate('/');
        } else {
          throw new Error(resultAction.error?.message || 'Failed to fetch user data');
        }
      } catch (error) {
        console.error('Error handling callback:', error);
        toast.error('Failed to complete sign in. Please try again.');
        navigate('/login?error=callback_failed');
      }
    };

    handleCallback();
  }, [dispatch, navigate, searchParams]);

  return (
    <div className="min-h-[calc(100vh-4rem)] flex items-center justify-center bg-gray-50 dark:bg-gray-900">
      <div className="text-center">
        <div 
          className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-blue-500 mx-auto" 
          role="progressbar"
          aria-label="Loading"
        />
        <p className="mt-4 text-lg text-gray-600 dark:text-gray-300">
          Completing your sign in with GitHub...
        </p>
      </div>
    </div>
  );
};

export default GithubCallback; 