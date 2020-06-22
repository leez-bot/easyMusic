import * as types from './mutation-type'

const mutations = {
    [types.SETSTATE](state, obj) {
        for(let key in obj) {
            !obj.name ? state[key] = obj[key] : state[obj.name][key] = obj[key]
        }
    }
}

export default mutations