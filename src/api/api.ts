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
  authToken?: string,
): Promise<ApiResponse<T>> => {
  const apiUrl = normalizeApiBase(process.env.NEXT_PUBLIC_API_URL || "");

  const token = authToken || Cookies.get("token");

  const options: RequestInit = {
    method,
    headers: {
      "Content-Type": "application/json",
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
    },
    body: body ? JSON.stringify(body) : null,
  };

  try {
    const response = await fetch(buildApiUrl(apiUrl, endpoint), options); // 动态构建请求地址
    const data = await response.json();

    return {
      code: data.code ?? response.status,
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

function normalizeApiBase(apiUrl: string) {
  return apiUrl.replace(/\/+$/, "").replace(/\/api$/, "");
}

function buildApiUrl(apiUrl: string, endpoint: string) {
  const normalizedEndpoint = endpoint.startsWith("/") ? endpoint : `/${endpoint}`;
  return `${apiUrl}${normalizedEndpoint}`;
}
