import * as types from './mutation-type'
import axios from '@/libs/api.request'


// 添加歌曲到播放列表
export const addSongToPlaylist = ({ commit, state }, songList, play) => {
	const { playlist } = state
	playlist.concat(songList)
	if (play) {
		// 如果添加单曲，添加完成后进行该单曲播放
		commit(types.SETSTATE, { playlist, currentSong: songList[0] })
		palySong()
	} else {
		commit(types.SETSTATE, { playlist })
	}
}

// 播放歌曲
export const palySong = async ({ commit, state }) => {
	const song = state.currentSong || {}
	const { rid = "", name = "未知歌曲", artist = "未知歌手" } = song;
	let src = await this.getSongDetail({ rid });
	let current = { ...currentSong, src }
	commit(types.SETSTATE, {
		playing: true,
		currentSong: current
	})
}

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