import Vue from 'vue'
import Vuex from 'vuex'
import * as actions from './actions.js'
import * as getters from './getters'
import state from './state'
import mutations from './mutations'
import createLogger from 'vuex/dist/logger'
import indexState from './modules/index'

Vue.use(Vuex)

const debug = process.env.NODE_ENV !== 'production'

const store = new Vuex.Store({
    state,
    getters,
    actions,
    mutations,
    modules: {
        indexState
    },
    strict: debug, // 是否开启严格模式(监控数据是否通过mutation修改)
    plugins: debug ? [createLogger()] : []
})

export default store
