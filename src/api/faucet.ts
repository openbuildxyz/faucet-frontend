import { apiRequest } from "./api";

type FaucetResponse = {
  address: string;
  tx: string;
};

type SignResponse = {
  token: string;
};

// Request token
export const requestToken = async (
  address: string,
  token: string,
) => {
  const tokenData = {
    address,
    token,
  };

  try {
    // Call the generic API request function
    const response = await apiRequest<FaucetResponse>(
      "/api/faucet",  // Faucet endpoint
      "POST",     // Request method
      tokenData,
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

export const requestAccessToken = async (
  code: string,
  redirectUri?: string,
) => {
  const data = {
    code: code,
    redirect_uri: redirectUri,
  };

  try {
    // Call the generic API request function
    const response = await apiRequest<SignResponse>(
      "/api/sign",  // Faucet endpoint
      "POST",     // Request method
      data   // Request body (includes address, amount, token symbol, and chain ID)
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
