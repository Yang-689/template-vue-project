// API 配置
export const API_CONFIG = {
  baseURL: window.config.GlobalParam.baseAPI,
  timeout: 5 * 60 * 1000, // 超时时间 5min,
  // 请求头
  headers: {
    'Content-Type': 'application/json;charset=UTF-8',
  },
  // 是否携带cookie信息
  withCredentials: false,
}

// 响应状态码
export const RESPONSE_CODE = {
  SUCCESS: 200,
  UNAUTHORIZED: 401,
  FORBIDDEN: 403,
  NOT_FOUND: 404,
  SERVER_ERROR: 500,
}
