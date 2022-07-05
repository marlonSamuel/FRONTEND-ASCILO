<template>
<div>
      <v-container text-xs-center text-sm-center text-lg-center fill-height style="margin-top: 10%">
        <v-layout row justify-center fill-height>
          <v-flex xs12 sm8 md4>
            <v-card class="elevation-12 mx-auto my-14" >
              <v-card-title primary-title>
                      <v-layout class="text-center" wrap>
                        <v-flex md12 lg12 xs12>
                          <v-avatar
                            :tile="false"
                            size="90"
                            color="grey lighten-4"
                          >
                            <img src="../../assets/logo.jpg" alt="avatar">
                          </v-avatar>
                        </v-flex>
                        <v-flex md12 lg12 xs12>
                          <h3>Ingreso al sistema</h3>
                        </v-flex>
                      </v-layout>
                </v-card-title>
              <v-card-text>
                <v-form ref="form">
                  <v-text-field v-model="credentials.username" 
                    name="email" 
                    label="Correo electronico" type="text"
                    :rules="usernameRules"
                    >
                  </v-text-field>

                  <v-text-field 
                      v-model="credentials.password" 
                      id="password" 
                      name="password" 
                      label="Contraseña" 
                      type="password"
                      :rules="passwordRules"
                      required>
                  </v-text-field>
                </v-form>
              </v-card-text>
              <v-card-actions>
                <v-btn block color="primary" @click="beforeLogin"><v-icon> </v-icon> iniciar sessión</v-btn>
              </v-card-actions>
            </v-card>
          </v-flex>
        </v-layout>
      </v-container>

      <v-overlay :value="loading">
        <v-progress-circular
          indeterminate
          size="64"
        >Cargando...</v-progress-circular>
    </v-overlay>
  </div>
</template>

<script>
import auth from '../../auth'
  export default {
    components: {
    },
    data: () => ({
      drawer: null,
      loading: false,
      credentials: {
          username: '',
          password: ''
      },
      usernameRules: [
            v => !!v || 'Correo o nombre de usuario es requerido'
        ],
      passwordRules: [
            v => !!v || 'Contraseña es requerida',
            v => !(v && v.length < 6) || 'Contraseña debe tener al menos 6 digitos'
      ]
    }),
    props: {
      source: String
    },
    methods: {
        login(){
            let self = this
            self.loading = true
            self.$store.state.services.loginService
            .login(self.credentials)
            .then(r => {
                self.loading = false
                if(r.response !== undefined){
                  self.$store.state.global.captureError(r, 'error')
                  return
                }
                self.$store.dispatch('guardarToken',r.data)
                self.$router.push('/')
                auth.getUser()
            }).catch(e => {
              
            })
        },

        beforeLogin(){
          let self = this
          if (this.$refs.form.validate()){
              self.login()
          }
        }
    },
    computed: {
      logo(){
        let self = this
        return self.$store.state.global.getLogo()
      }
    }
  }
</script>