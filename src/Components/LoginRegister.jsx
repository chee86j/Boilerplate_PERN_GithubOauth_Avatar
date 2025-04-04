import React, { useState } from 'react';
import { useDispatch } from 'react-redux';
import { setCredentials } from '../store/authSlice';
import { GithubIcon } from 'lucide-react';

const LoginRegister = () => {
  const [githubState] = useState(() => Math.random().toString(36).substring(7));
  
  const handleGithubLogin = () => {
    localStorage.setItem('githubState', githubState);
    window.location.href = `https://github.com/login/oauth/authorize?client_id=${import.meta.env.VITE_GITHUB_CLIENT_ID}&redirect_uri=${encodeURIComponent(import.meta.env.VITE_GITHUB_CALLBACK_URL)}&scope=user:email&state=${githubState}`;
  };

  return (
    <div className="flex items-center justify-center min-h-screen">
      <div className="w-full max-w-md p-8 space-y-8 bg-white rounded-lg shadow">
        <button
          onClick={handleGithubLogin}
          className="flex items-center justify-center w-full px-4 py-2 space-x-2 text-white bg-gray-800 rounded-md hover:bg-gray-700"
        >
          <GithubIcon size={20} />
          <span>Continue with GitHub</span>
        </button>
      </div>
    </div>
  );
};

export default LoginRegister;