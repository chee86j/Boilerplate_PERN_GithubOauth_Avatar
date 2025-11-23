import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Provider } from 'react-redux';
import { ToastContainer } from 'react-toastify';
import { store } from './store';
import Navbar from './components/layout/Navbar';
import Home from './components/home/Home';
import LoginRegister from './components/auth/LoginRegister';
import EditAccount from './components/profile/EditAccount';
import GithubCallback from './components/auth/GithubCallback';
import AuthProvider from './components/auth/AuthProvider';
import 'react-toastify/dist/ReactToastify.css';
import './styles/index.css';

const App = () => {
  return (
    <Provider store={store}>
      <AuthProvider>
        <Router>
          <div className="min-h-screen bg-gray-100 dark:bg-gray-900">
            <Navbar />
            <ToastContainer
              position="top-right"
              autoClose={3000}
              hideProgressBar={false}
              newestOnTop
              closeOnClick
              rtl={false}
              pauseOnFocusLoss
              draggable
              pauseOnHover
              theme="colored"
            />
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/login" element={<LoginRegister />} />
              <Route path="/register" element={<LoginRegister />} />
              <Route path="/profile" element={<EditAccount />} />
              <Route path="/auth/callback" element={<GithubCallback />} />
            </Routes>
          </div>
        </Router>
      </AuthProvider>
    </Provider>
  );
};

export default App;
