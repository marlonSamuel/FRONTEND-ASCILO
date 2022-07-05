<template>
<div>
  <v-data-table
    :headers="headers"
    :items="items"
    sort-by="calories"
    class="elevation-1"
    :search="search"
  >
  <template v-slot:item.full_name="{ item }">
        {{ item.primer_nombre+' '+(item.segundo_nombre != null ? item.segundo_nombre : '')+' '+item.primer_apellido + ' '+(item.segundo_apellido != null ? item.segundo_apellido : '') }}
    </template>
    <template v-slot:item.fecha_nacimiento="{ item }">
        {{ item.fecha_nacimiento | moment("DD-MM-YYYY") }}
    </template>

    <template v-slot:top>
      <v-toolbar
        flat
      >
        <v-toolbar-title>USUARIOS</v-toolbar-title>
        <v-spacer></v-spacer>
          <v-text-field
            v-model="search"
            append-icon="mdi-magnify"
            label="Buscar"
            single-line
            hide-details
          ></v-text-field>
        <v-divider
          class="mx-4"
          inset
          vertical
        ></v-divider>
        <v-spacer></v-spacer>
        <v-dialog
          v-model="dialog"
          max-width="700px"
        >
          <template v-slot:activator="{ on, attrs }">
            <v-btn
              color="primary"
              dark
              class="mb-2"
              v-bind="attrs"
              v-on="on"
            >
              Nuevo
            </v-btn>
          </template>
          <v-card>
            <v-card-title>
              <span class="text-h5">{{ formTitle }}</span>
            </v-card-title>

            <v-card-text>
              <v-container>
                <v-form
                    ref="form"
                    v-model="valid"
                    lazy-validation
                >
                <v-row>
                    <v-col
                        cols="12"
                        sm="6"
                        md="6"
                        xs="12"
                      >
                  
                      <v-text-field
                        v-model="editedItem.nombres"
                        label="Nombres"
                        :rules="nombresRules"
                        required
                      ></v-text-field>
                    </v-col>
                    <v-col
                        cols="12"
                        sm="6"
                        md="6"
                        xs="12"
                      >
                  
                      <v-text-field
                        v-model="editedItem.apellidos"
                        label="Apellidos"
                        counter="25"
                        :rules="apellidosRules"
                        required
                      ></v-text-field>
                    </v-col>
                  </v-row>

                    <v-row>
                    <v-col
                      cols="12"
                      sm="6"
                      md="6"
                      xs="12"
                    >
                      <v-text-field
                        v-model="editedItem.username"
                        label="Nombre de usuario"
                        :rules="userRules"
                        required
                      ></v-text-field>
                    </v-col>
                    <v-col
                        cols="12"
                        sm="6"
                        md="6"
                        xs="12"
                      >
                  
                      <v-text-field
                        v-model="editedItem.email"
                        label="Correo electronico"
                        :rules="emailRules"
                        required
                      ></v-text-field>
                    </v-col>
                  </v-row>

                   <v-row>

                   <v-col
                      cols="12"
                      sm="4"
                      md="4"
                      xs="12"
                    >
                      <v-autocomplete 
                        v-model="editedItem.role_id"
                        :items="roles"
                        item-text="nombre"
                        item-value="id"
                        :rules="roleRules"
                        label="Rol"
                        required
                      ></v-autocomplete>
                    </v-col>

                    <template v-if="editedItem.id == 0">

                      <v-col
                          cols="12"
                          sm="4"
                          md="4"
                          xs="12"
                        >
                    
                        <v-text-field
                          v-model="editedItem.password"
                          label="Contraseña"
                          counter="25"
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
                    
                    </template>

                    
                  </v-row>
                </v-form>
              </v-container>
            </v-card-text>

            <v-card-actions>
              <v-spacer></v-spacer>
              <v-btn
                color="error"
                text
                @click="close"
              >
                Cancelar
              </v-btn>
              <v-btn
                color="blue darken-1"
                text
                @click="save"
              >
                Guardar
              </v-btn>
            </v-card-actions>
          </v-card>
        </v-dialog>
        <v-dialog v-model="dialogDelete" max-width="500px">
          <v-card>
            <v-card-title class="text-h5">Esta seguro de eliminar registro?</v-card-title>
            <v-card-actions>
              <v-spacer></v-spacer>
              <v-btn color="error" text @click="closeDelete">cancelar</v-btn>
              <v-btn color="blue darken-1" text @click="deleteItemConfirm">Confirmar</v-btn>
              <v-spacer></v-spacer>
            </v-card-actions>
          </v-card>
        </v-dialog>
      </v-toolbar>
    </template>
    <template v-slot:item.actions="{ item }">
    <v-tooltip top>
      <template v-slot:activator="{ on, attrs }">
          <v-icon v-on="on"
            color="yellow darken-2"
            v-bind="attrs"
            small
            class="mr-2"
            @click="editItem(item)"
          >
            mdi-pencil
          </v-icon>
      </template>
      <span>Editar</span>
    </v-tooltip>

    <v-tooltip top>
      <template v-slot:activator="{ on, attrs }">
          <v-icon
          color="error"
          v-on="on"
          v-bind="attrs"
          small
          @click="deleteItem(item)"
        >
          mdi-delete
        </v-icon>
      </template>
      <span>Eliminar</span>
    </v-tooltip>
    </template>
  </v-data-table>
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
    name: 'Indexuser',

    data: () => ({
        loading: false,
        search: '',
        dialog: false,
        dialogDelete: false,
        valid: true,
        nombresRules: [
            v => !!v || 'Los nombres son requeridos'
        ],
        apellidosRules: [
            v => !!v || 'Los apellidos son requeridos'
        ],
        userRules: [
            v => !!v || 'El nombre de ususario es requerido'
        ],
        passwordRules: [
            v => !!v || 'La contraseña es requerida',
            v => !(v && v.length < 6) || 'La contraseña debe tener al menos 6 digistos',
        ],
        confirmPasswordRules: [
          (v) => !!v || 'La confirmación de contraseña es requerida',
          (v) => v === this.editedItem.password || 'La contraseña no coincide.',
        ],
        roleRules: [
            v => !!v || 'El rol es requerido'
        ],
        emailRules: [
            v => !!v || 'El correo es requerido',
            v => /.+@.+\..+/.test(v) || "Debe ser un correo valido"
        ],

        headers: [
          { text: 'Nombres', value: 'nombres' },
          { text: 'Apellidos', value: 'apellidos' },
          { text: 'Nombre de usuario', value: 'username' },
          { text: 'Correo electronico', value: 'email' },
          { text: 'Rol', value: 'role.nombre' },
          { text: 'Acciones', value: 'actions', sortable: false },
        ],
        items: [],
        roles: [],
        editedIndex: -1,
        editedItem: {
            id: 0,
            role_id: null,
            nombres: '',
            apellidos: '',
            username: '',
            email: '',
            password: '',
            password_confirmation: ''
        },
        defaultItem: {
            id: 0,
            role_id: null,
            nombres: '',
            apellidos: '',
            username: '',
            email: '',
            password: '',
            password_confirmation: ''
        }
    }),

    computed: {
      formTitle () {
        return this.editedIndex === -1 ? 'Nuevo registro' : 'Editar registro'
      },

      repeatPasswordRules() {
        return [
          (v) => !!v || 'Confirmar contraseña es requerido',
          (v) => (v === this.editedItem.password) || 'Las contraseñas no coinciden',
        ];
      },
    },

    watch: {
      dialog (val) {
        val || this.close()
      },
      dialogDelete (val) {
        val || this.closeDelete()
      },
    },

    created(){
        let self = this;
        self.getRoles()
        self.getAll()
    },

    methods: {
      //listar todos los registrros de especilaidades
      getRoles() {
        let self = this;
        self.loading = true;
        self.$store.state.services.userService
          .getRoles()
          .then(r => {
            self.loading = false;
            self.roles = r.data;
          })
          .catch(r => {
          });
      },
    //listar todos los registrros
      getAll() {
        let self = this;
        self.loading = true;
        self.$store.state.services.userService
          .getAll()
          .then(r => {
            self.loading = false;
            self.items = r.data;
          })
          .catch(r => {
          });
      },
//obtener po id
      get(id) {
        let self = this;
        self.$store.state.services.userService
          .get(id)
          .then(r => {
            
          })
          .catch(r => {
          });
      },
//crear registro
      create(){
          let self = this
          let data = self.editedItem
          self.loading = true;
          self.$store.state.services.userService
          .create(data)
          .then(r=>{
            self.loading = false;
              if(r.response !== undefined){
                self.$store.state.global.captureError(r, 'error')
                return
              }
              self.$toastr.success('user creada con éxito', 'Mensaje');
              self.getAll()
          })
          .catch(e=>{

          })
      },
//actualizar registro
      update(){
          let self = this;
          let data = self.editedItem
          self.loading = true;
          self.$store.state.services.userService
          .update(data)
          .then(r=>{
            self.loading = false;
              if(r.response !== undefined){
                self.$store.state.global.captureError(r, 'error')
                return
              }      
              self.$toastr.success('user actualizada con éxito', 'Mensaje');      
              self.getAll()
          })
          .catch(e=>{

          })
      },
      
  //eliminar registro
      remove(){
          let self = this;
          let data = self.editedItem
          self.loading = true;
          self.$store.state.services.userService
          .remove(data.id)
          .then(r=>{
            self.loading = false;
              if(r.response !== undefined){
                self.$store.state.global.captureError(r, 'error')
                return
              }
              self.$toastr.success('user eliminada con éxito', 'Mensaje');
              self.getAll()
          })
          .catch(e=>{

          })
      },

    editItem (item) {
        this.editedIndex = this.items.indexOf(item)
        item.role_id = item.role.id
        this.editedItem = Object.assign({}, item)
        this.dialog = true
    },

    deleteItem (item) {
        this.editedIndex = this.items.indexOf(item)
        this.editedItem = Object.assign({}, item)
        this.dialogDelete = true
    },

    deleteItemConfirm () {
        let self = this
        self.remove()
        this.closeDelete()
    },

    close () {
        this.dialog = false
        this.$nextTick(() => {
            this.editedItem = Object.assign({}, this.defaultItem)
            this.editedIndex = -1
            this.$refs.form.reset();
        })
    },

    closeDelete () {
        this.dialogDelete = false
        this.$nextTick(() => {
            this.editedItem = Object.assign({}, this.defaultItem)
            this.editedIndex = -1
        })
    },

    save () {
        let self = this
        if (this.$refs.form.validate()){
            if (this.editedIndex > -1) {
                self.update()
            } else {
                self.create()
            }
            this.close()
          }
        }
    }
  }
</script>
