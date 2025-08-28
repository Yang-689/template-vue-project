import type { AxiosRequestConfig } from 'axios'
import axios from 'axios'
import { API_CONFIG } from '../config'
import {
  requestErrorInterceptor,
  requestInterceptor,
  responseErrorInterceptor,
  responseInterceptor,
} from './interceptors'

// 创建 axios 实例
const instance = axios.create(API_CONFIG)

// 修改拦截器
instance.interceptors.request.use(requestInterceptor, requestErrorInterceptor)

// 响应拦截器中移除已完成的请求
instance.interceptors.response.use(responseInterceptor, responseErrorInterceptor)

// 封装请求方法
export const request = {
  get: (url: string, config?: AxiosRequestConfig<any>) => {
    return instance.get(url, config)
  },

  post: (url: string, data: any, config?: AxiosRequestConfig<any>) => {
    return instance.post(url, data, config)
  },

  put: (url: string, data: any, config?: AxiosRequestConfig<any>) => {
    return instance.put(url, data, config)
  },

  delete: (url: string, config?: AxiosRequestConfig<any>) => {
    return instance.delete(url, config)
  },

  // 上传文件
  upload: (url: string, file: any, config?: AxiosRequestConfig<any>) => {
    const formData = new FormData()
    formData.append('file', file)

    return instance.post(url, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
      ...config,
    })
  },
}
