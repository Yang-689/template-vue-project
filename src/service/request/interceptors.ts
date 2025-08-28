import pinia, { useUserStore } from '@/store'

/** 请求拦截器 */
export function requestInterceptor(config: any) {
  // 获取 token
  const token = useUserStore(pinia).token

  if (token) {
    config.headers.Authorization = `Bearer ${token}`
  }

  return config
}

/** 请求错误拦截器 */
export function requestErrorInterceptor(error: any) {
  return Promise.reject(error)
}

/** 响应拦截器 */
export function responseInterceptor(response: any) {
  switch (response.status) {
    case 200:
      if (response.data.data) {
        return Promise.resolve(response.data)
      }
      return Promise.resolve(response.data)
    default:
      return Promise.resolve(response.data)
  }

  // message.error(data.message || '请求失败');
  // return Promise.reject(data);
}

/** 响应错误拦截器 */
export function responseErrorInterceptor(error: any) {
  if (error.response) {
    switch (error.response.status) {
      case 401:
        // 未授权处理
        // message.error("请登录后再操作");
        // 可以在这里处理登出逻辑
        break
      case 403:
        // message.error("没有权限");
        break
      case 404:
        // message.error("请求的资源不存在");
        break
      case 500:
        // message.error("服务器错误");
        break
      default:
      // message.error("网络错误");
    }
  }
  else if (error.request) {
    // message.error("网络请求超时");
  }
  else {
    // message.error("请求配置错误");
  }

  return Promise.reject(error)
}
