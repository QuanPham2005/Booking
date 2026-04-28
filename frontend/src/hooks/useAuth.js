import { useEffect } from 'react';

export const useAuthCleanup = () => {
  useEffect(() => {
    // Check if this is app startup (optional, you can remove this check if you always want to clear)
    const isFirstLoad = sessionStorage.getItem('appStarted') === null;
    
    if (isFirstLoad) {
      // Mark that app has started
      sessionStorage.setItem('appStarted', 'true');
      
      // Optional: Clear localStorage on fresh start if you want
      // Uncomment the following lines if you want to clear data on browser restart
      // const clearOnRestart = localStorage.getItem('clearOnRestart');
      // if (clearOnRestart === 'true') {
      //   logoutUser();
      //   localStorage.removeItem('clearOnRestart');
      // }
    }
  }, []);
};

// Helper function to logout
export const logoutUser = () => {
  localStorage.removeItem("Teacher jwtToken");
  localStorage.removeItem("Student jwtToken");
  localStorage.removeItem("jwtToken");
  localStorage.removeItem("Student Name");
  localStorage.removeItem("Teacher Name");
  localStorage.removeItem("Admin Name");
  localStorage.removeItem("email");
  sessionStorage.clear();
  
  // Optional: Set flag to clear on next restart
  // localStorage.setItem('clearOnRestart', 'true');
};

// Helper function to check if user is logged in
export const isUserLoggedIn = () => {
  return !!(
    localStorage.getItem("Teacher jwtToken") ||
    localStorage.getItem("Student jwtToken") ||
    localStorage.getItem("jwtToken")
  );
};
