import axios from "axios";

const http = axios.create({
  baseURL: "http://localhost:8080",
  timeout: 5000,
});

// 添加请求拦截器
http.interceptors.request.use((config) => {
  // 对请求数据做点什么
  return config;
}, (error) => {
  // 对请求错误做些什么
  return Promise.reject(error);
});


// 添加响应拦截器
http.interceptors.response.use((response)=> {
  // 对响应数据做点什么
  if(response.status === 200){
    return response.data;
  }else{
    return response ;
  }
}, (error)=> {
  // 对响应错误做点什么
  return Promise.reject(error);
});

export default http;

