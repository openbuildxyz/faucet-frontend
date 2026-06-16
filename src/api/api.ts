import Cookies from "js-cookie";


export interface ApiResponse<T> {
  code: number;
  message: string;
  data?: T;
}

export const apiRequest = async <T>(
  endpoint: string,
  method: "GET" | "POST" | "PUT" | "DELETE" = "GET",
  body: unknown = null,
): Promise<ApiResponse<T>> => {
  const apiUrl = process.env.NEXT_PUBLIC_API_URL || "";

  const token = Cookies.get("token");

  const options: RequestInit = {
    method,
    headers: {
      "Content-Type": "application/json",
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
    },
    body: body ? JSON.stringify(body) : null,
  };

  try {
    const response = await fetch(`${apiUrl}${endpoint}`, options); // 动态构建请求地址
    const data = await response.json();

    return {
      code: data.code || 200,
      message: data.message,
      data: data.data,
    };
  } catch (error) {
    console.error("API 请求错误:", error);
    return {
      code: 500,
      message: error instanceof Error ? error.message : "服务器错误",
    };
  }
};
