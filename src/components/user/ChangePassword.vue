<template>
<div>
    <template>
        <v-toolbar-title>CAMBIAR CONTRASEÑA</v-toolbar-title>
          <v-card>
            <v-card-text>
                <v-form
                    ref="form"
                    v-model="valid"
                    lazy-validation
                >
                   <v-row>
                        <v-col
                            cols="12"
                            sm="4"
                            md="4"
                            xs="12"
                            >
                        
                            <v-text-field
                            v-model="editedItem.old_password"
                            label="Contraseña anterior"
                            :rules="passwordRules"
                            required
                            ></v-text-field>
                        </v-col>

                      <v-col
                          cols="12"
                          sm="4"
                          md="4"
                          xs="12"
                        >
                    
                        <v-text-field
                          v-model="editedItem.new_password"
                          label="Nueva Contraseña"
                          :rules="passwordRules"
                          required
                        ></v-text-field>
                      </v-col>

                      <v-col
                        cols="12"
                        sm="4"
                        md="4"
                        xs="12"
                      >
                        <v-text-field
                          v-model="editedItem.password_confirmation"
                          label="Confirmar contraseña"
                          :rules="repeatPasswordRules"
                          required
                        ></v-text-field>
                      </v-col>
                  </v-row>
                </v-form>
            </v-card-text>

            <v-card-actions>
              <v-spacer></v-spacer>
              <v-btn
                color="blue darken-1"
                text
                @click="save"
              >
                Guardar
              </v-btn>
            </v-card-actions>
          </v-card>
    </template>
    <v-overlay :value="loading">
        <v-progress-circular
          indeterminate
          size="64"
        >Cargando...</v-progress-circular>
    </v-overlay>
  </div>
</template>

<script>
  export default {
    name: 'Indexchaneuser',

    data: () => ({
        loading: false,
        search: '',
        valid: true,
        passwordRules: [
            v => !!v || 'La contraseña es requerida',
            v => !(v && v.length < 6) || 'La contraseña debe tener al menos 6 digistos',
        ],
        editedItem: {
            old_password: '',
            new_password: '',
            password_confirmation: ''
        }
    }),

    computed: {
      repeatPasswordRules() {
        return [
          (v) => !!v || 'Confirmar contraseña es requerido',
          (v) => (v === this.editedItem.new_password) || 'Las contraseñas no coinciden',
        ];
      },
    },

    watch: {
    },

    created(){
        let self = this;
    },

    methods: {
      
//actualizar registro
      update(){
          let self = this;
          let data = self.editedItem
          self.loading = true;
          self.$store.state.services.userService
          .changePassword(data)
          .then(r=>{
            self.loading = false;
              if(r.response !== undefined){
                self.$store.state.global.captureError(r, 'error')
                return
              }      
              self.$toastr.success('Contraseña actualizada con éxito', 'Mensaje'); 
              self.logout()
          })
          .catch(e=>{

          })
      },

      logout(){
        let self = this
        self.loading = true
        self.$store.state.services.loginService
          .logout()
          .then(r => {
            self.$store.dispatch("logout")
            self.$router.push('/login')
            self.loading = false
          }).catch(e => {

        })
      },

    save () {
        let self = this
        if (this.$refs.form.validate()){
            self.update()
          }
        }
    }
  }
</script>
