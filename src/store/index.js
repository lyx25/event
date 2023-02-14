import Vue from 'vue'
import Vuex from 'vuex'
import createPersistedState from 'vuex-persistedstate'
import { getUserInfoAPI } from '@/api'
Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    // 保存token
    token: '',
    // 保存用户的信息(id,username,nickname,Email,userpic)
    userInfo: {}
  },
  getters: {
    nickname: state => state.userInfo.nickname, // 昵称
    username: state => state.userInfo.username, // 用户名
    user_pic: state => state.userInfo.user_pic // 用户头像
  },
  mutations: {
    // 保存token字符串
    updateToken (state, val) {
      state.token = val
    },
    // 保存用户信息
    updateUserInfo (state, val) {
      state.userInfo = val
    }
  },
  actions: {
    // 请求用户的信息
    async initUserInfo (store) {
      const res = await getUserInfoAPI()
      store.commit('updateUserInfo', res.data.data)
    }
  },
  modules: {
  },
  // 配置为 vuex 的插件
  plugins: [createPersistedState()]
})
