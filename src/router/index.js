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
import MedicoIndex from '@/components/medico/Index'
import PacienteIndex from '@/components/paciente/Index'
import SolicitudIndex from '@/components/solicitude/Index'
import HospitalSolicitud from '@/components/solicitude/HospitalSolitude'
import ConsultaMedico from '@/components/consulta/ConsultaMedico'
import AtenderConsulta from '@/components/consulta/AtenderConsulta'
import EntregarMedicamento from '@/components/consulta/EntregarMedicamento'
import ResultadoExamenes from '@/components/consulta/ResultadoExamenes'
import IngresoGasto from '@/components/ingresogasto/Index'
import PagoFundacion from '@/components/pagofundacion/Index'
import Pago from '@/components/pago/Index'



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
    { path: '/medicos', name: 'medico', component: MedicoIndex, beforeEnter: multiguard([isLoggedIn]) },
    { path: '/pacientes', name: 'paciente', component: PacienteIndex, beforeEnter: multiguard([isLoggedIn]) },
    { path: '/solicitudes', name: 'solicitude', component: SolicitudIndex, beforeEnter: multiguard([isLoggedIn]) },
    { path: '/hospital-solicitudes', name: 'HospitalSolicitud', component: HospitalSolicitud, beforeEnter: multiguard([isLoggedIn]) },
    { path: '/mis-consultas', name: 'ConsultaMedico', component: ConsultaMedico, beforeEnter: multiguard([isLoggedIn]) },
    { path: '/atender-consulta/:date', name: 'AtenderConsulta', component: AtenderConsulta, beforeEnter: multiguard([isLoggedIn]) },
    { path: '/entregar-medicamento', name: 'EntregarMedicamento', component: EntregarMedicamento, beforeEnter: multiguard([isLoggedIn]) },
    { path: '/resultado-examenes', name: 'ResultadoExamenes', component: ResultadoExamenes, beforeEnter: multiguard([isLoggedIn]) },
    { path: '/ingresos-gastos', name: 'IngresoGasto', component: IngresoGasto, beforeEnter: multiguard([isLoggedIn]) },
    { path: '/pagos-fundacion', name: 'PagoFundacion', component: PagoFundacion, beforeEnter: multiguard([isLoggedIn]) },
    { path: '/pagos', name: 'Pago', component: Pago, beforeEnter: multiguard([isLoggedIn]) },
]

export default new Router({
    routes
})