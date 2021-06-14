import * as types from './mutation-type'
import axios from '@/libs/api.request'
import { params } from '../../nodeServer/src/router';

export const getSongList = async ({ commit, state }, params) => {
    return dealGetRequest('/song/list', commit, params);
}
export const getSongDetail = async ({ commit, state }, params) => {
    return dealGetRequest('/song/detail', commit, params);
}

export const getArtistSongs = async ({ commit, state }, params) => {
    return dealGetRequest('/song/singerSongs', commit, params);
}

export const getAlbumSongs = async ({ commit, state }, params) => {
    return dealGetRequest('/song/albumSongs', commit, params);
}

export const getSingers = async ({ commit, state }, params) => {
    return dealGetRequest('/singers', commit, params);
}

export const getSongLrc = async ({ commit, state }, params) => {
    return dealGetRequest('/lrc', commit, params);
}

async function dealGetRequest(url, commit, params) {
    commit(types.SETSTATE, { loading: true })
    const { data, err } = await axios.request({
        url,
        method: 'get'
    }, params)
    if (data) {
        commit(types.SETSTATE, { loading: false })
        return Promise.resolve(data)
    }
    if (err) { commit(types.SETSTATE, { loading: false }) }
}