
// Utility function to make authenticated API calls
export const makeAuthenticatedRequest = async (url: string, options: RequestInit = {}) => {
  const token = localStorage.getItem('authToken');
  
  const defaultHeaders = {
    'Content-Type': 'application/json',
    ...(token && { Authorization: `Bearer ${token}` }),
  };

  const requestOptions: RequestInit = {
    ...options,
    headers: {
      ...defaultHeaders,
      ...options.headers,
    },
  };

  try {
    const response = await fetch(url, requestOptions);
    
    // Check if token is expired or invalid
    if (response.status === 401) {
      localStorage.removeItem('authToken');
      localStorage.removeItem('authUser');
      window.location.reload(); // Force re-authentication
      return null;
    }

    return response;
  } catch (error) {
    console.error('API request failed:', error);
    throw error;
  }
};

// Helper function to get the current auth token
export const getAuthToken = (): string | null => {
  return localStorage.getItem('authToken');
};

// Helper function to check if user is authenticated
export const isAuthenticated = (): boolean => {
  const token = localStorage.getItem('authToken');
  const user = localStorage.getItem('authUser');
  return !!(token && user);
};
