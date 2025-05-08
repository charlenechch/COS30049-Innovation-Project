// Get decoded JWT token from localStorage
export const getDecodedToken = () => {
    const token = localStorage.getItem('token');
    if (!token) return null;
  
    try {
      return JSON.parse(atob(token.split('.')[1]));
    } catch (error) {
      console.error('Invalid token:', error);
      return null;
    }
  };
  
  // Check if user has the expected role
  export const checkRole = (expectedRole) => {
    const decoded = getDecodedToken();
    return decoded && decoded.role === expectedRole;
  };
  
  // Check if token exists (used for login-required pages)
  export const isLoggedIn = () => {
    return !!localStorage.getItem('token');
  };
  
  // Get username from token
  export const getUsername = () => {
    const decoded = getDecodedToken();
    return decoded ? decoded.username : null;
  };
  
  // Optional: Logout
  export const logout = () => {
    localStorage.clear();
    window.location.href = '/login';
  };
  