import { apiRequest } from "./api";

type UserResponse = {
  uid: number;
  avatar: string;
  username: string;
  email: string;
  github: string;
};

export const requestUser = async (token?: string) => {
  try {
    // Call the generic API request function
    const response = await apiRequest<UserResponse>(
      "/api/user",  // Faucet endpoint
      "GET",     // Request method
      null,
      token,
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
      message: error instanceof Error ? error.message : "服务器错误",
    };
  }
};
