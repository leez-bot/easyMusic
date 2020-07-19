import * as types from './mutation-type'
import axios from '@/libs/api.request'

export const getSongList = async ({ commit, state }, params) => {
    commit(types.SETSTATE, { loading: true })
    const { data, err } = await axios.request({
        url: '/song/list',
        method: 'get'
    }, params)
    if (data) {
        commit(types.SETSTATE, { loading: false })
        return Promise.resolve(data.data)
    }
    if (err) { commit(types.SETSTATE, { loading: false }) }
}
export const getSongDetail = async ({ commit, state }, params) => {
    commit(types.SETSTATE, { loading: true })
    const { data, err } = await axios.request({
        url: '/song/detail',
        method: 'get'
    }, params)
    if (data) {
        commit(types.SETSTATE, { loading: false })
        return Promise.resolve(data)
    }
    if (err) { commit(types.SETSTATE, { loading: false }) }
}