import Vue from 'vue'
import Router from 'vue-router'
import store from '../store/index'
import multiguard from 'vue-router-multiguard'

import Default from '@/components/Default'
import PeopleIndex from '@/components/people/Index'
import Login from '@/components/auth/Login'

import PsicopatologiaIndex from '@/components/psicopatologia/Index'
import MedicamentoIndex from '@/components/medicamento/Index'
import ExamenIndex from '@/components/examen/Index'
import ConceptoIndex from '@/components/concepto/Index'
import EnfermeroIndex from '@/components/enfermero/Index'
import EspecialidadeIndex from '@/components/especialidade/Index'


Vue.use(Router)

//validar authenticacion
const isLoggedIn = (to, from, next) => {
    return store.state.is_login ? next() : next('/login')
}

const isLoggedOut = (to, from, next) => {
    return store.state.is_login ? next('/') : next()
}

const routes = [
    { path: '/', name: 'Default', component: Default, beforeEnter: multiguard([isLoggedIn]) },
    { path: '/people', name: 'People', component: PeopleIndex, beforeEnter: multiguard([isLoggedIn]) },
    { path: '/login', name: 'Login', component: Login, beforeEnter: multiguard([isLoggedOut]) },
    { path: '/psicopatologias', name: 'psicopatologia', component: PsicopatologiaIndex, beforeEnter: multiguard([isLoggedIn]) },
    { path: '/medicamentos', name: 'medicamento', component: MedicamentoIndex, beforeEnter: multiguard([isLoggedIn]) },
    { path: '/examenes', name: 'examen', component: ExamenIndex, beforeEnter: multiguard([isLoggedIn]) },
    { path: '/conceptos', name: 'concepto', component: ConceptoIndex, beforeEnter: multiguard([isLoggedIn]) },
    { path: '/enfermeros', name: 'enfermero', component: EnfermeroIndex, beforeEnter: multiguard([isLoggedIn]) },
    { path: '/especialidades', name: 'especialidade', component: EspecialidadeIndex, beforeEnter: multiguard([isLoggedIn]) },
]

export default new Router({
    routes
})