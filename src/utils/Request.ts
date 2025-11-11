import axios, { AxiosInstance, AxiosRequestConfig } from 'axios'
import { ElLoading } from 'element-plus'
import Message from '../utils/Message'
import VueCookies from 'vue-cookies'
import { useLoginStore } from '@/stores/loginStore'

const contentTypeForm = 'application/x-www-form-urlencoded;charset=UTF-8'
const contentTypeJson = 'application/json'
const responseTypeJson = 'json'

let loading: ReturnType<typeof ElLoading.service> | null = null
const instance: AxiosInstance = axios.create({ withCredentials: true, baseURL: '/api', timeout: 10 * 1000 })

instance.interceptors.request.use(
  (config: any) => {
    if (config.showLoading) {
      loading = ElLoading.service({ lock: true, text: '加载中......', background: 'rgba(0, 0, 0, 0.7)' })
    }
    // token 注入（从 Cookies）
    const rawCookieToken = (VueCookies as any).get('Authorization') as string | undefined
    const decodedToken = rawCookieToken ? decodeURIComponent(rawCookieToken) : ''
    const authHeader = decodedToken ? (decodedToken.startsWith('Bearer ') ? decodedToken : `Bearer ${decodedToken}`) : ''
    config.headers = config.headers || {}
    if (authHeader) config.headers['Authorization'] = authHeader
    config.headers['X-Requested-With'] = 'XMLHttpRequest'

    // 默认 method 使用 post，除非显式指定
    config.method = (config.method || 'post').toLowerCase()

    // 上传进度回调兼容字段
    if (config.uploadProgressCallback && !config.onUploadProgress) {
      config.onUploadProgress = config.uploadProgressCallback
    }

    // 统一处理 POST 请求体，优先支持 JSON
    const isPost = config.method === 'post'
    const isJson = config.dataType === 'json'
    const isFile = config.dataType === 'file'

    if (isPost) {
      if (isJson) {
        config.headers['Content-Type'] = 'application/json'
        if (!config.data && config.params) {
          config.data = config.params
          delete config.params
        }
      } else {
        // FormData 收敛：支持文件与普通字段
        const formData = new FormData()
        const payload = config.data ?? config.params ?? {}
        Object.keys(payload || {}).forEach((key) => {
          const val = payload[key]
          formData.append(key, val == null ? '' : val)
        })
        config.data = formData
        delete config.params
        // 让浏览器自动设置 multipart 边界
        if (config.headers && config.headers['Content-Type']) delete config.headers['Content-Type']
      }
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
    const { showLoading, errorCallback, showError = true, responseType } = response.config || {}
    if (showLoading && loading) loading.close()
    const responseData = response.data
    if (responseType === 'arraybuffer' || responseType === 'blob') return responseData
    if (responseData?.code === 20000) return responseData.data
    if (responseData?.code === 901) {
      const loginStore: any = useLoginStore()
      loginStore.setLogin(true)
      return Promise.reject({ showError: false })
    }
    if (errorCallback) errorCallback(responseData)
    if (showError) Message.error(responseData?.info || '请求失败')
    return Promise.reject({ showError, msg: responseData?.info })
  },
  (error: any) => {
    if (error?.config?.showLoading && loading) loading.close()
    const showError = error?.config?.showError !== false
    if (showError) Message.error('网络异常')
    return Promise.reject({ showError: !!showError, msg: '网络异常' })
  }
)

// 业务扩展配置
export interface RequestConfig<D = any> extends AxiosRequestConfig<D> {
  showLoading?: boolean
  errorCallback?: (msg: any) => void
  showError?: boolean
  dataType?: 'json' | 'file'
  uploadProgressCallback?: (e: ProgressEvent) => void
}

// 泛型请求方法：返回已被拦截器解包后的 data
const request = <T = any>(config: RequestConfig): Promise<T> => {
  // 通过第二泛型参数将返回类型从 AxiosResponse<T> 改为 T
  return instance.request<any, T>(config)
}

export default request
export { instance as axiosInstance }
