import Vue from 'vue'
import Router from 'vue-router'
import store from '../store/index'
import multiguard from 'vue-router-multiguard'
import _ from 'lodash'

import Default from '@/components/Default'
import Login from '@/components/auth/Login'

import PsicopatologiaIndex from '@/components/psicopatologia/Index'
import MedicamentoIndex from '@/components/medicamento/Index'
import ExamenIndex from '@/components/examen/Index'
import ConceptoIndex from '@/components/concepto/Index'
import EnfermeroIndex from '@/components/enfermero/Index'
import EspecialidadeIndex from '@/components/especialidade/Index'
import MedicoIndex from '@/components/medico/Index'
import PacienteIndex from '@/components/paciente/Index'
import PacienteHistorial from '@/components/paciente/Historial'
import SolicitudIndex from '@/components/solicitude/Index'
import HospitalSolicitud from '@/components/solicitude/HospitalSolitude'
import ConsultaMedico from '@/components/consulta/ConsultaMedico'
import AtenderConsulta from '@/components/consulta/AtenderConsulta'
import EntregarMedicamento from '@/components/consulta/EntregarMedicamento'
import ResultadoExamenes from '@/components/consulta/ResultadoExamenes'
import IngresoGasto from '@/components/ingresogasto/Index'
import PagoFundacion from '@/components/pagofundacion/Index'
import Pago from '@/components/pago/Index'
import Reporte from '@/components/reporte/Index'
import User from '@/components/user/Index'
import ChangePassword from '@/components/user/ChangePassword'



Vue.use(Router)

//validar authenticacion
const isLoggedIn = (to, from, next) => {
    return store.state.is_login ? next() : next('/login')
}

const isLoggedOut = (to, from, next) => {
    return store.state.is_login ? next('/') : next()
}

//proteger rutas de los sistema, verificar si tiene acceso
const permissionValidations = (to, from, next) => {
    if (store.state.rol.toLowerCase() == 'admin') {
        return next()
    }
    var permisos = store.state.permisos //obtener permisos del usuario
    var name = to.name
    console.log(name, permisos)
    var permiso = _.includes(permisos, name) //verificar si permiso existe
    return permiso ? next() : next('/')
}

const routes = [
    { path: '/', name: 'Default', component: Default, beforeEnter: multiguard([isLoggedIn]) },
    { path: '/login', name: 'Login', component: Login, beforeEnter: multiguard([isLoggedOut]) },
    { path: '/psicopatologias', name: 'Psicopatologia', component: PsicopatologiaIndex, beforeEnter: multiguard([isLoggedIn, permissionValidations]) },
    { path: '/medicamentos', name: 'Medicamento', component: MedicamentoIndex, beforeEnter: multiguard([isLoggedIn, permissionValidations]) },
    { path: '/examenes', name: 'Examen', component: ExamenIndex, beforeEnter: multiguard([isLoggedIn, permissionValidations]) },
    { path: '/conceptos', name: 'Concepto', component: ConceptoIndex, beforeEnter: multiguard([isLoggedIn, permissionValidations]) },
    { path: '/enfermeros', name: 'Enfermero', component: EnfermeroIndex, beforeEnter: multiguard([isLoggedIn, permissionValidations]) },
    { path: '/especialidades', name: 'Especialidade', component: EspecialidadeIndex, beforeEnter: multiguard([isLoggedIn, permissionValidations]) },
    { path: '/medicos', name: 'Medico', component: MedicoIndex, beforeEnter: multiguard([isLoggedIn, permissionValidations]) },
    { path: '/pacientes', name: 'Paciente', component: PacienteIndex, beforeEnter: multiguard([isLoggedIn, permissionValidations]) },
    { path: '/pacientes-historial/:id', name: 'PacienteHistorial', component: PacienteHistorial, beforeEnter: multiguard([isLoggedIn, permissionValidations]) },
    { path: '/solicitudes', name: 'Solicitude', component: SolicitudIndex, beforeEnter: multiguard([isLoggedIn, permissionValidations]) },
    { path: '/hospital-solicitudes', name: 'HospitalSolicitud', component: HospitalSolicitud, beforeEnter: multiguard([isLoggedIn, permissionValidations]) },
    { path: '/mis-consultas', name: 'ConsultaMedico', component: ConsultaMedico, beforeEnter: multiguard([isLoggedIn, permissionValidations]) },
    { path: '/atender-consulta/:date', name: 'AtenderConsulta', component: AtenderConsulta, beforeEnter: multiguard([isLoggedIn, permissionValidations]) },
    { path: '/entregar-medicamento', name: 'EntregarMedicamento', component: EntregarMedicamento, beforeEnter: multiguard([isLoggedIn, permissionValidations]) },
    { path: '/resultado-examenes', name: 'ResultadoExamenes', component: ResultadoExamenes, beforeEnter: multiguard([isLoggedIn, permissionValidations]) },
    { path: '/ingresos-gastos', name: 'IngresoGasto', component: IngresoGasto, beforeEnter: multiguard([isLoggedIn, permissionValidations]) },
    { path: '/pagos-fundacion', name: 'PagoFundacion', component: PagoFundacion, beforeEnter: multiguard([isLoggedIn, permissionValidations]) },
    { path: '/pagos', name: 'Pago', component: Pago, beforeEnter: multiguard([isLoggedIn, permissionValidations]) },
    { path: '/reportes', name: 'Reporte', component: Reporte, beforeEnter: multiguard([isLoggedIn, permissionValidations]) },
    { path: '/users', name: 'User', component: User, beforeEnter: multiguard([isLoggedIn, permissionValidations]) },
    { path: '/change-password', name: 'ChangePassword', component: ChangePassword, beforeEnter: multiguard([isLoggedIn, permissionValidations]) },
]

export default new Router({
    routes
})