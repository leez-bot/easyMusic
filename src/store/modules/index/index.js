import * as types from './mutation-type'
import * as mainTypes from '../../mutation-type'
import axios from '../../../libs/api.request'

export default {
    namespaced: true,
    state: {
        name: 'indexState',
        loading: false,
        count: 0,
        gradeList: []
    },
    getters: {
        countDouble (state) {
            return  state.count * state.count
        }
    },
    mutations: {
        [types.INCREMENT](state, num) {
            state.count += num
        },
        [types.DECREMENT](state, num) {
            state.count -= num
        }
    },
    actions: {
        syncGetCount ({ commit, state }, num) {
            setTimeout(() => {
                commit(types.INCREMENT, num)
            }, 1000)
        },
        async getGradeList ({commit, state}, param = {}) {
            // pending
            commit(mainTypes.SETSTATE, { ...state, loading: false, gradeList: [] }, { root: true })
            const { data, err } = await axios.request({
                url: '/master/main',
                method: 'get'
            }, param)
            // resolve
            if (data) { commit(mainTypes.SETSTATE, { ...state, loading: false, gradeList: data }, { root: true }) }
            // reject
            if (err) { commit(mainTypes.SETSTATE, { ...state, loading: false, gradeList: [] }, { root: true }) }
        }
    }
}