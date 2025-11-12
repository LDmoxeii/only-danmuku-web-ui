import axios from 'axios'
import type {AxiosInstance, AxiosRequestConfig} from 'axios'
import {ElLoading} from 'element-plus'
import Message from '../utils/Message'
import {useLoginStore} from '@/stores/loginStore'

// 全局默认头
axios.defaults.headers['Content-Type'] = 'application/json;charset=utf-8'

let loading: ReturnType<typeof ElLoading.service> | null = null
const instance: AxiosInstance = axios.create({withCredentials: true, baseURL: '/api', timeout: 10 * 1000})
instance.defaults.headers.post['Content-Type'] = 'application/json;charset=utf-8'
instance.defaults.headers.put['Content-Type'] = 'application/json;charset=utf-8'

// 参数序列化（兼容嵌套对象、数组）
const tansParams = (params: Record<string, any> = {}): string => {
    let result = ''
    const add = (key: string, val: any) => {
        if (val === undefined || val === null || val === '') return
        result += `${encodeURIComponent(key)}=${encodeURIComponent(val)}&`
    }
    const build = (prefix: string, obj: any) => {
        if (Array.isArray(obj)) {
            obj.forEach((v) => add(prefix, v))
        } else if (Object.prototype.toString.call(obj) === '[object Object]') {
            Object.keys(obj).forEach((k) => build(`${prefix}[${k}]`, obj[k]))
        } else {
            add(prefix, obj)
        }
    }
    Object.keys(params).forEach((prop) => build(prop, params[prop]))
    return result
}

instance.interceptors.request.use(
    (config: any) => {
        if (config.showLoading) {
            loading = ElLoading.service({lock: true, text: '加载中......', background: 'rgba(0, 0, 0, 0.7)'})
        }
        const loginStore: any = useLoginStore()
        const token = loginStore?.userInfo?.token
        const authHeader = token ? (String(token).startsWith('Bearer ') ? String(token) : `Bearer ${token}`) : ''
        config.headers = config.headers || {}
        if (authHeader) config.headers['Authorization'] = authHeader
        config.headers['X-Requested-With'] = 'XMLHttpRequest'

        // GET 请求映射 params 到 url
        if (config.method === 'get' && config.params) {
            let url = config.url + '?' + tansParams(config.params)
            url = url.slice(0, -1)
            config.params = {}
            config.url = url
        }

        // 上传进度回调兼容字段
        if (config.uploadProgressCallback && !config.onUploadProgress) {
            config.onUploadProgress = config.uploadProgressCallback
        }

        // 若外部直接传入 FormData，同样放开 Content-Type 让浏览器设置边界
        if (config.data instanceof FormData && config.headers && config.headers['Content-Type']) {
            delete config.headers['Content-Type']
        }
        return config
    },
    (error: any) => {
        if (error?.config?.showLoading && loading) loading.close()
        Message.error('请求发送失败')
        return Promise.reject('请求发送失败')
    }
)

instance.interceptors.response.use(
    (response: any) => {
        const {showLoading, errorCallback, showError = true} = response.config || {}
        if (showLoading && loading) loading.close()
        const responseData = response.data
        const respType = response?.request?.responseType || response?.config?.responseType
        if (respType === 'arraybuffer' || respType === 'blob') return responseData
        if (responseData?.code === 20000) return responseData.data
        if (responseData?.code === 901) {
            const loginStore: any = useLoginStore()
            loginStore.setLogin(true)
            return Promise.reject({showError: false})
        }
        if (errorCallback) errorCallback(responseData)
        if (showError) Message.error(responseData?.message || '请求失败')
        return Promise.reject({showError, msg: responseData?.message})
    },
    (error: any) => {
        if (error?.config?.showLoading && loading) loading.close()
        const showError = error?.config?.showError !== false
        if (showError) Message.error('网络异常')
        return Promise.reject({showError: showError, msg: '网络异常'})
    }
)

// 业务扩展配置
export interface RequestConfig<D = any> extends AxiosRequestConfig<D> {
    showLoading?: boolean
    errorCallback?: (msg: any) => void
    showError?: boolean
    uploadProgressCallback?: (e: ProgressEvent) => void
}

// 泛型请求方法：返回已被拦截器解包后的 data
const request = <T = any>(config: RequestConfig): Promise<T> => {
    // 通过第二泛型参数将返回类型从 AxiosResponse<T> 改为 T
    return instance.request<any, T>(config)
}

export default request
