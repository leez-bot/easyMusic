import HttpRequest from './axios'
let config = {
    baseUrl: {
        dev: '/api',
        pro: '/api'
    }
}
const baseUrl = process.env.NODE_ENV === 'development' ? config.baseUrl.dev : config.baseUrl.pro
// const baseUrl = ''

const axios = new HttpRequest(baseUrl)
export default axios
