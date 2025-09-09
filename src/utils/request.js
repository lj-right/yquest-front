import axios from 'axios'

// axios的请求实例
const request = axios.create({
    // 网络请求的公共配置
    // 1、后端基础地址
    baseURL: import.meta.env.VITE_API_BASE_URL,
    // 2、超时时间
    timeout: 5000
})


// 设置请求拦截器
request.interceptors.request.use(
    config => {
        // 在发送请求之前做些什么
        // 可以在这里为所有请求添加token：
        // config.headers.Authorization = 'Bearer ' + TOKEN;
        return config
    },
    error => {
        // 对请求错误做些什么
        return Promise.reject(error)
    }
)

// 添加响应拦截器
request.interceptors.response.use(response => {
    // 任何响应都会经过这里
    // 对响应数据做点什么
    if (response.data.code != 200) {
        // 消息通知
        return response.data;
    }
    return response.data;
}, error => {
    // 对响应错误做点什么
    return Promise.reject(error);
});

export default request;