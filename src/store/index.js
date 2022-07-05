import Vue from 'vue'
import Vuex from 'vuex'
import services from './services'
import global from '../components/sharedjs/global'
import moment from 'moment'
import auth from '../auth'
import Axios from 'axios'

Vue.use(Vuex)

const state = {
    services,
    global,
    rol: '',
    usuario: {},
    persmisos: [],
    token: null,
    is_login: false,
    token_expired: null,
    client_id: 2,
    //base_url: 'http://sicoa.com/',
    base_url: 'http://167.99.218.207/',
    client_secret: 'trAeIFHhCpAFccxg1wwBXltW3WWE0e4M6IvQDwQf'
}

const mutations = {
    setUser(state, usuario) {
        state.usuario = usuario
        state.rol = usuario.role.nombre
    },

    setPermisos(state, permisos) {
        state.permisos = permisos
    },

    setToken(state, token) {
        state.token = token
        state.is_login = true
    },

    logout(state) {
        state.is_login = false
        state.token = null
    },

    setState(state) {
        state.is_login = false
        state.token = null
    },

    setTokenExpired(state, time) {
        state.token_expired = time
    }
}

const actions = {
    guardarToken({ commit }, data_user) {
        Axios.defaults.headers.common.Authorization = `Bearer ${data_user.access_token}`
        commit("setToken", data_user.access_token)
        localStorage.setItem('token', data_user.access_token)
            //localStorage.setItem('token', data_user.refresh_token)
            //$cookies.set('token_data', data_user)
    },

    logout({ commit }) {
        //$cookies.remove('token_data')
        localStorage.removeItem('token');
        localStorage.removeItem('refresh_token');
        commit("logout")
    },

    autoLogin({ commit }) {
        //let token = $cookies.get('token_data')
        let token = localStorage.getItem('token');
        if (token) {
            commit('setToken', token)
            auth.getUser()
        } else {
            commit('setState')
        }
    },

    setUser({ commit }, user) {
        commit('setUser', user)
    },

    setPermisos({ commit }, permisos) {
        commit('setPermisos', permisos)
    }
}

export default new Vuex.Store({
    state,
    mutations,
    actions
})