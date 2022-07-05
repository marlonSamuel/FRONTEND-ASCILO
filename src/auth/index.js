import Axios from 'axios'
import router from '../router'
import store from '../store'

export default {

    data_refresh_token: {
        grant_type: 'refresh_token',
        refresh_token: '',
        client_id: '',
        cliente_secret: ''
    },

    caja: [
        'Concepto', 'IngresoGasto', 'PagoFundacion', 'Pago', 'ChangePassword', 'Default'
    ],

    medico: [
        'ConsultaMedico', 'PacienteHistorial', 'AtenderConsulta', 'ChangePassword', 'Default'
    ],

    secretaria_fundacion: [
        'ChangePassword', 'Especialidade', 'Medico', 'HospitalSolicitud', 'Default'
    ],

    secretaria_ascilo: [
        'Default', 'Psicopatologia', 'Enfermero', 'Solicitude', 'Reporte', 'Paciente', 'ChangePassword', 'PacienteHistorial'
    ],

    laboratorio: [
        'Default', 'ResultadoExamenes', 'Examen', 'ChangePassword'
    ],

    farmacia: [
        'Default', 'EntregarMedicamento', 'Medicamento', 'ChangePassword'
    ],

    getRefreshToken() {
        var refresh_token = localStorage.getItem('refresh_token')
        this.data_refresh_token.refresh_token = refresh_token
        this.data_refresh_token.client_id = store.state.client_id,
            this.data_refresh_token.client_secret = store.state.client_secret

        return this.data_refresh_token
    },

    saveToken(token) {
        store.dispatch('guardarToken', token)
    },

    noAcceso() {
        store.dispatch('logout')
        router.push('/login')
    },

    getUser() {
        let self = this
        store.state.services.loginService.me()
            .then(r => {
                store.dispatch('setUser', r.data)
                if (r.data.role.nombre.toLowerCase() == "caja") {
                    store.dispatch('setPermisos', self.caja)
                } else if (r.data.role.nombre.toLowerCase() == "secretaria_ascilo") {
                    store.dispatch('setPermisos', self.secretaria_ascilo)
                } else if (r.data.role.nombre.toLowerCase() == "secretaria_fundacion") {
                    store.dispatch('setPermisos', self.secretaria_fundacion)
                } else if (r.data.role.nombre.toLowerCase() == "farmacia") {
                    store.dispatch('setPermisos', self.farmacia)
                } else if (r.data.role.nombre.toLowerCase() == "laboratorio") {
                    store.dispatch('setPermisos', self.laboratorio)
                } else if (r.data.role.nombre.toLowerCase() == "medico") {
                    store.dispatch('setPermisos', self.medico)
                }
            }).catch(e => {

            })
    }
}