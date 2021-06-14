import * as types from './mutation-type'

const mutations = {
	[types.SETSTATE](state, obj) {
		for (let key in obj) {
			state[key] = obj[key]
		}
	}
}

export default mutations