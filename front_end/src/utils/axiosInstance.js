import axiosInstance from './axiosInstance';
import { API_PATHS } from './apiPaths';

const getUserInfo = async () => {
  try {
    const response = await axiosInstance.get(API_PATHS.AUTH.GET_USER_INFO);
    return response.data;
  } catch (error) {
    console.error("Failed to fetch user info:", error);
    throw error;
  }
};
// Response Interceptor
axiosInstance.interceptors.response.use(
    (response) => {
      return response;
    },
    (error) => {
      // Handle common errors globally
      if (error.response) {
        if (error.response.status === 401) {
          // Redirect to login on unauthorized
          window.location.href = "/login";
        } else if (error.response.status === 500) {
          console.error("Server error. Please try again later.");
        }
      } else if (error.code === "ECONNABORTED") {
        console.error("Request timeout. Please try again.");
      }
  
      return Promise.reject(error);
    }
  );
  
  export default axiosInstance;
  