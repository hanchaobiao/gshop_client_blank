/*
vuex最核心的管理对象store
 */

import getters from './getters'
import actions from './actions'
import mutations from './mutations'
import state from './state'
import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)
export default new Vuex.Store({
  getters,
  state,
  actions,
  mutations
})
