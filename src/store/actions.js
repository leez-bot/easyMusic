import * as types from './mutation-type'
import axios from '@/libs/api.request'

export const getSongList = async ({ commit, state }, params) => {
    commit(types.SETSTATE, { })
    const { data, err } = await axios.request({
        url: '/findmusic',
        method: 'post',
        data: 'keyword=周杰伦&page=1&pagesize=30'
    })
    if (data) {
        commit(types.SETSTATE, { })
        return Promise.resolve(data)
    }
    if (err) { commit(types.SETSTATE, { }) }
}
export const getSongDetail = async ({ commit, state }, params) => {
    commit(types.SETSTATE, { })
    const { data, err } = await axios.request({
        url: '/musicdetails',
        method: 'post',
        data: 'id=75535053'
    })
    if (data) {
        commit(types.SETSTATE, { })
        return Promise.resolve(data)
    }
    if (err) { commit(types.SETSTATE, { }) }
}