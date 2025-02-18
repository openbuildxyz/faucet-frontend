export interface ApiResponse<T> {
  code: number;
  message: string;
  data?: T;
}

export const apiRequest = async <T>(
  endpoint: string,
  method: "GET" | "POST" | "PUT" | "DELETE" = "GET",
  body: any = null,
): Promise<ApiResponse<T>> => {
  // 获取 API 域名（根据环境变量）
  const apiUrl = process.env.NEXT_PUBLIC_API_URL;

  if (!apiUrl) {
    throw new Error("API URL is not defined");
  }

  const token = sessionStorage.getItem("token");

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
      message: data.message || "成功",
      data: data.data,
    };
  } catch (error) {
    console.error("API 请求错误:", error);
    return {
      status: 500,
      message: error.message || "服务器错误",
    };
  }
};
