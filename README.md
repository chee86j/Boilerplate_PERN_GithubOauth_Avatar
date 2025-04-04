# GitHub OAuth Boilerplate with Avatar Management

##  A Production-Ready Authentication System

This boilerplate provides a robust, secure, and scalable authentication system with GitHub OAuth integration and avatar management. Built with modern best practices and security in mind, it's perfect for developers who need a solid foundation for their next PERN Stack project.

###  Key Features

- **GitHub OAuth Integration**: Seamless login with GitHub accounts
- **Custom Authentication**: Traditional email/password authentication
- **Avatar Management**: Upload, crop, and manage user avatars
- **Secure JWT Authentication**: Industry-standard token-based authentication
- **Rate Limiting**: Protection against brute force attacks
- **Comprehensive Error Handling**: Detailed error messages for debugging
- **Modern UI with TailwindCSS**: Clean, responsive design out of the box
- **Redux State Management**: Predictable state management for complex applications
- **Form Validation**: Client and server-side validation for data integrity
- **Toast Notifications**: User-friendly feedback for actions

##  Tech Stack

- **Frontend**: React 18, Vite, Redux Toolkit, React Router, TailwindCSS
- **Backend**: Express.js, Sequelize ORM, PostgreSQL
- **Authentication**: JWT, GitHub OAuth
- **Security**: Helmet, Rate Limiting, Input Validation
- **Styling**: TailwindCSS, PostCSS

##  Getting Started

### Prerequisites

- Node.js (v16 or higher)
- PostgreSQL
- GitHub OAuth credentials (for GitHub login)

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/yourusername/github-oauth-boilerplate.git
   cd github-oauth-boilerplate
   ```

2. **Install dependencies**
   ```bash
   # Install frontend dependencies
   npm install
   
   # Install backend dependencies
   cd server
   npm install
   cd ..
   ```

3. **Set up environment variables**
   Create a `.env` file in the root directory with the following variables:
   ```
   # Server Configuration
   PORT=5000
   NODE_ENV=development
   
   # Database Configuration
   DB_HOST=localhost
   DB_USER=your_db_user
   DB_PASSWORD=your_db_password
   DB_NAME=your_db_name
   
   # JWT Configuration
   JWT_SECRET=your_jwt_secret
   JWT_EXPIRES_IN=7d
   
   # GitHub OAuth Configuration
   GITHUB_CLIENT_ID=your_github_client_id
   GITHUB_CLIENT_SECRET=your_github_client_secret
   GITHUB_CALLBACK_URL=http://localhost:5000/api/auth/github/callback
   ```

4. **Set up the database**
   ```bash
   # Start PostgreSQL service
   # Create a new database
   createdb your_db_name
   
   # The application will automatically create tables on first run
   ```

5. **Start the development servers**
   ```bash
   # Start the backend server
   cd server
   npm run dev
   
   # In a new terminal, start the frontend
   cd ..
   npm run dev
   ```

6. **Access the application**
   Open your browser and navigate to `http://localhost:5173`

##  Security Features

- **JWT Authentication**: Secure token-based authentication
- **Password Hashing**: Bcrypt for password security
- **Rate Limiting**: Protection against brute force attacks
- **Input Validation**: Both client and server-side validation
- **Error Handling**: Comprehensive error handling with detailed logs
- **Security Headers**: Helmet for secure HTTP headers
- **CSRF Protection**: Built-in CSRF protection
- **XSS Prevention**: Input sanitization and output encoding

##  User Interface

The application features a clean, modern UI built with TailwindCSS:

- **Responsive Design**: Works on all device sizes
- **Dark/Light Mode**: Automatic theme switching based on system preferences
- **Toast Notifications**: User-friendly feedback for actions
- **Form Validation**: Real-time validation with helpful error messages
- **Loading States**: Visual feedback during asynchronous operations

##  API Endpoints

- `POST /api/auth/register` - Register a new user
- `POST /api/auth/login` - Login with email/password
- `GET /api/auth/github` - Initiate GitHub OAuth flow
- `GET /api/auth/github/callback` - GitHub OAuth callback
- `GET /api/users/profile` - Get user profile
- `PUT /api/users/profile` - Update user profile
- `DELETE /api/users/profile` - Delete user account
- `POST /api/users/avatar` - Upload user avatar

##  Testing

```bash
# Run frontend tests
npm test

# Run backend tests
cd server
npm test
```

##  Deployment

The application is designed to be deployed to any modern hosting platform:

1. **Build the frontend**
   ```bash
   npm run build
   ```

2. **Deploy the backend**
   ```bash
   cd server
   npm run build
   ```

3. **Set up environment variables** on your hosting platform

4. **Configure your database** and update connection details

