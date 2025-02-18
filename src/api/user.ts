import { apiRequest } from "./api";

export const requestUser = async () => {
  try {
    // Call the generic API request function
    const response = await apiRequest<{ message: string, data: any }>(
      "/user",  // Faucet endpoint
      "GET",     // Request method
    );

    // If the request is successful and returns data
    if (response.code === 200) {
      return {
        success: true,
        message: response.message,
        data: response.data,
      };
    }

    // Return error message if request fails
    return {
      success: false,
      message: response.message,
      data: null
    };
  } catch (error) {
    // Return error if an exception occurs
    return {
      success: false,
      message: error.message,
    };
  }
};

