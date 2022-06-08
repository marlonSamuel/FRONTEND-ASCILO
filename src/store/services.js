import Axios from 'axios'
import auth from '../auth'

//import services
import PeopleService from '../services/PeopleService'
import LoginService from '../services/LoginService'
import PsicopatologiaService from '../services/PsicopatologiaService'
import MedicamentoService from '../services/MedicamentoService'
import ExamenService from '../services/ExamenService'
import ConceptoService from '../services/ConceptoService'
import EnfermeroService from '../services/EnfermeroService'
import EspecialidadeService from '../services/EspecialidadeService'

// Axios Configuration
Axios.defaults.headers.common.Accept = 'application/json'

//let baseUrl = 'http://www.iglesia.com/' //base url desarrollo
let baseUrl = 'http://sicoa.com/' //url production
let token_data = localStorage.getItem(('token'))

// Axios Configuration
Axios.defaults.headers.common.Accept = 'application/json'
if (token_data !== null) {
    Axios.defaults.headers.common.Authorization = `Bearer ${token_data}`
}

const instance = Axios.create();
Axios.interceptors.response.use(response => {
    return response
}, error => {
    if (error.response.status === 401) {
        auth.noAcceso()
            /* var token_data = $cookies.get('token_data')
             if (isNullOrUndefined(token_data)) { return error }
             var original_request = error.config
             return refreshToken().then(res => {
                 auth.saveToken(res.data)
                 original_request.headers['Authorization'] = 'Bearer ' + res.data.access_token
                 return Axios.request(original_request)
             })*/
    }
    return error
});

function refreshToken() {
    var data = auth.getRefreshToken()
    return new Promise(function(resolve, reject) {
        instance.post(baseUrl + 'oauth/token', data)
            .then(r => {
                resolve(r)
            }).catch(e => {
                reject(e)
            })
    })
}

instance.interceptors.response.use(response => {
    return response
}, error => {
    if (error.response.status === 401) {
        auth.noAcceso()
    }

    return error
});

export default {
    peopleService: new PeopleService(Axios, baseUrl),
    loginService: new LoginService(Axios, baseUrl),
    psicopatologiaService: new PsicopatologiaService(Axios, baseUrl),
    medicamentoService: new MedicamentoService(Axios, baseUrl),
    examenService: new ExamenService(Axios, baseUrl),
    conceptoService: new ConceptoService(Axios, baseUrl),
    enfermeroService: new EnfermeroService(Axios, baseUrl),
    especialidadeService: new EspecialidadeService(Axios, baseUrl),
}