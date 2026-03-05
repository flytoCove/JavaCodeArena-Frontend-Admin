// /src/request.js
import axios from 'axios'
import { getToken, removeToken } from './cookie'
import router from '@/router';

// 创建一个 axios 实例
const service = axios.create({
  baseURL: '/dev-api', // 统一接口前缀
  timeout: 5000, // 超时时间 5 秒
  headers: {
    'Content-Type': 'application/json',
  },
})

//请求拦截器
service.interceptors.request.use(
  (config) => {
    if (getToken()) {
      config.headers["Authorization"] = "Bearer " + getToken();
    }
    return config;
  },
  (error) => {
    console.log(error)
    Promise.reject(error);
  }
);


// 响应拦截器（可选）
service.interceptors.response.use(
  response => response.data, // 直接返回响应体 data
  error => {
    console.error('请求出错：', error)
    return Promise.reject(error)
  }
)

export default service
