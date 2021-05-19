import axios from 'axios'
import { ElMessage } from 'element-plus'
import store from '../store'
import Cookies from 'js-cookie'
export const TOKEN_KEY = 'Token ' // 空格必须

let requestList = [];
const saveTime = 1000;

// create an axios instance
const service = axios.create({
    baseURL: '/',
    withCredentials: true,
    timeout: 15 * 1000 // request timeout
})

// request interceptor
service.interceptors.request.use(
    config => {

        //定义取消请求函数
        let cancel = undefined;
        config.cancelToken = new axios.CancelToken(function executor(c) {
            cancel = c;
        });
        //放置重复请求
        let nowTime = new Date().getTime();
        requestList = requestList.filter((item) => {
            return (item.setTime + saveTime) > nowTime;
        });
        let sessionUrl = requestList.filter((item) => {
            return item.url === config.url;
        });
        if (sessionUrl.length > 0) {
            console.info(config.url + '请求重复 中断请求!');
            cancel(config.url)
            return;
        }
        // 每次发送请求之前判断是否存在token，如果存在，则统一在http请求的header都加上token，不用每次请求都手动添加了
        let token = Cookies.get("token");
        if (token) {
            config.headers['AUTHORIZATION'] = TOKEN_KEY + token
        }
        // cancel http cache
        config.headers['Cache-Control'] = 'no-cache'
        // set Content-type
        if(config.headers['Content-type'] === undefined){
            config.headers['Content-type'] = 'application/json;charset=utf-8'
        }
        return config;

    },
    error => {
        // do something with request error
        console.error(error) // for debug
        return Promise.reject(error)
    }
)

// response interceptor
service.interceptors.response.use(
    response => {
        const res = response.data
        if (res.code === 2000) {
            return res.data
        }
        ElMessage({
            message: res.msg || 'Error',
            type: 'error',
            duration: 3 * 1000
        })
        return Promise.reject(response)
    },
    error => {
        console.info("11")
        const ErrorHandler = {
            400: "请求错误",
            401: "未授权，请登录",
            403: "账号异常，请联系管理员",
            404: `请求地址出错: ${error.response.config.url}`,
            408: "请求超时",
            500: "服务器内部错误",
            501: "服务未实现",
            502: "网关错误",
            503: "服务不可用",
            504: "网关超时",
            505: "HTTP版本不受支持"
        }
        if (error && error.response) {
            const { status, data } = error.response
            if (status === 401) {
                store.commit('user/LOGOUT')
            }
            error.message = status + ErrorHandler[status] || ''
            if (data.error) {
                error.message = data.error
            }
        }
        ElMessage({
            message: error.message,
            type: 'error',
            duration: 3 * 1000
        })
        return Promise.reject(error)
    }
)

export default service
