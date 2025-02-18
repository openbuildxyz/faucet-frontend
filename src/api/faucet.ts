import { apiRequest } from "./api";

// Request token
export const requestToken = async (
  address: string,
  amount: string,
  tokenSymbol: string,
  chainId: string
) => {
  const tokenData = {
    address,
    amount,
    token_symbol: tokenSymbol,
    chain_id: chainId
  };

  try {
    // Call the generic API request function
    const response = await apiRequest<{ message: string, data: any }>(
      "/faucet",  // Faucet endpoint
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
      message: error.message,
    };
  }
};

export const requestAccessToken = async (
  code: string,
) => {
  const data = {
    code: code,
  };

  try {
    // Call the generic API request function
    const response = await apiRequest<{ message: string, data: any }>(
      "/sign",  // Faucet endpoint
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
      message: error.message,
    };
  }
};

