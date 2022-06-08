import { validationMixin } from 'vuelidate'
import { required, maxLength, email } from 'vuelidate/lib/validators'

Vue.filter('required', function(value) {
    if (!value || !value.length) {
        return 'Este campo es requerido';
    }
    return true
})