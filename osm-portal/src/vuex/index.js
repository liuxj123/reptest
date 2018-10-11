import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

const store = new Vuex.Store({
    state:{
        token: sessionStorage.getItem('token') || '',
        user: sessionStorage.getItem('user') || undefined,
        roles: sessionStorage.getItem('roles') || [],
        menus: sessionStorage.getItem('menus') || []
    },
    // 修改全局变量必须通过mutations中的方法
    // mutations只能采用同步方法
    mutations:{//同步
        login (state,payload) {
            sessionStorage.setItem("token",payload.access_token);
            sessionStorage.setItem("user",payload.user);
            sessionStorage.setItem("roles",payload.roles);
            sessionStorage.setItem("menus",payload.menus);
            state.token = payload.access_token
            state.user = payload.user
            state.roles = payload.roles
            state.menus = payload.menus
        },
        logout(state) {
            sessionStorage.removeItem("token");
            sessionStorage.removeItem("user");
            sessionStorage.removeItem("roles");
            sessionStorage.removeItem("menus");
            state.token = ''
            state.user = undefined
            state.roles = []
            state.menus = []
        }
    },
    // 异步方法用actions
    // actions不能直接修改全局变量，需要调用commit方法来触发mutation中的方法
    // 在组件中需要store.dispatch('login',params)激活actions中定义的方法
    actions:{
        login(context,payload) {
            context.commit('login',payload);
        },
        logout(context) {
            context.commit('logout');
        }
    }
})
export default store
