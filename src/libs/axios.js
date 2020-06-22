import axios from 'axios'
// import store from '@/store'
import { Message } from 'view-design'

class HttpRequest {
  constructor (baseUrl = window.location.origin) {
    this.baseUrl = baseUrl
    this.pending = {}
  }
  getInsideConfig (param) {
    const config = {
      baseURL: this.baseUrl || window.location.origin,
      headers: {
        //
      },
      params: {
        ...param
      },
      data: {
        ...param
      }
    }
    return config
  }
  // 清除请求队列
  removePending (key, isRequest = false) {
    if (this.pending[key] && isRequest) {
      this.pending[key]()
    }
    delete this.pending[key]
  }
  getRequestIdentify = (config, isReuest = false) => {
    let url = config.url
    if (isReuest) {
      url = config.baseURL + config.url.substring(1, config.url.length)
    }
    return config.method === 'get' ? encodeURIComponent(url + JSON.stringify(config.params)) : encodeURIComponent(config.url + JSON.stringify(config.data))
  }
  interceptors (instance, url) {
    // 请求拦截
    instance.interceptors.request.use(config => {
      // 添加请求队列
      let requestData = this.getRequestIdentify(config, true)
      this.removePending(requestData, true)
      config.cancelToken = new axios.CancelToken((c) => {
        this.pending[requestData] = c
      })
      return config
    }, error => {
      return Promise.reject(error)
    })
    // 响应拦截
    instance.interceptors.response.use((res = {}) => {
      let requestData = this.getRequestIdentify(res.config)
      this.removePending(requestData)
      const { data, status } = res
      if (status === 200) {
        if (data.code === 200) {
          let _data = data.data || {}
          return _data
        } else {
          Message.warning(res.data.message)
          return Promise.reject(res)
        }
      } else {
        Message.error(res.data.message)
        return Promise.reject(res)
      }
    }, error => {
      if (!error.__proto__.__CANCEL__) Message.error(error.toString())
      return Promise.reject(error)
    })
  }
  request (options, param) {
    const instance = axios.create()
    options = Object.assign(this.getInsideConfig(param), options)
    this.interceptors(instance, options.url)
    return instance(options).then(data => { return { data } }).catch(err => { return { err } })
  }
}
export default HttpRequest
