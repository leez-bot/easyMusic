import HttpRequest from './axios'
let config  = {
    baseUrl: {
        dev: '',
        pro: 'http://10.132.102.167:8099'
    }
}
const baseUrl = process.env.NODE_ENV === 'development' ? config.baseUrl.dev : config.baseUrl.pro
// const baseUrl = ''

const axios = new HttpRequest(baseUrl)
export default axios
