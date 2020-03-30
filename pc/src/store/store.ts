import Vue from 'vue'
import Vuex from 'vuex'
Vue.use(Vuex)

const store = new Vuex.Store({
  state: {
    activeNav: null,
    activeType: null
  },
  mutations: {
    changeNav (state, payload) {
      state.activeNav = payload
    },
    changeType (state, payload) {
      state.activeType = payload
    }
  },
  actions: {}
})

export default store
