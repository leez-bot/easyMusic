import * as types from './mutation-type'
import axios from '@/libs/api.request'

export const getSongList = async ({ commit, state }, params) => {
    commit(types.SETSTATE, { })
    const { data, err } = await axios.request({
        url: '/findmusic',
        method: 'post',
        data: `keyword=${params.keyword}&page=${params.page}&pagesize=${params.pagesize}`
    })
    if (data) {
        commit(types.SETSTATE, { })
        return Promise.resolve(data.list)
    }
    if (err) { commit(types.SETSTATE, { }) }
}
export const getSongDetail = async ({ commit, state }, params) => {
    commit(types.SETSTATE, { })
    const { data, err } = await axios.request({
        url: '/musicdetails',
        method: 'post',
        data: `id=${params.id}`
    })
    if (data) {
        commit(types.SETSTATE, { })
        return Promise.resolve(data)
    }
    if (err) { commit(types.SETSTATE, { }) }
}