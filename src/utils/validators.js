/*
 * Validates a username
 * @param {string} username - The username to validate
 * @returns {string|null} Error message if invalid, null if valid
 */
export const usernameValidator = (username) => {
  if (!username) return 'Username is required';
  if (username.length < 2) return 'Username must be at least 2 characters long';
  if (username.length > 15) return 'Username must be less than 15 characters';
  if (!/^[a-zA-Z0-9_]+$/.test(username)) return 'Username can only contain letters, numbers, and underscores';
  return null;
};

/*
 * Validates a password
 * @param {string} password - The password to validate
 * @returns {string|null} Error message if invalid, null if valid
 */
export const passwordValidator = (password) => {
  if (!password) return null; // Password is optional for updates
  if (password.length < 8) return 'Password must be at least 8 characters long';
  if (!/[a-z]/.test(password)) return 'Password must contain at least one lowercase letter';
  if (!/[A-Z]/.test(password)) return 'Password must contain at least one uppercase letter';
  if (!/\d/.test(password)) return 'Password must contain at least one number';
  if (!/[@$!%*?&]/.test(password)) return 'Password must contain at least one special character (@$!%*?&)';
  return null;
};

/*
 * Validates an email address
 * @param {string} email - The email to validate
 * @returns {string|null} Error message if invalid, null if valid
 */
export const emailValidator = (email) => {
  if (!email) return 'Email is required';
  if (!/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/.test(email)) {
    return 'Please enter a valid email address';
  }
  return null;
};
