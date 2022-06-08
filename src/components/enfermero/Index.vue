<template>
<div>
  <v-data-table
    :headers="headers"
    :items="items"
    sort-by="calories"
    class="elevation-1"
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
        <v-toolbar-title>ENFERMEROS</v-toolbar-title>
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
                        v-model="editedItem.cui"
                        label="CUI"
                        :rules="cuiRules"
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
                        v-model="editedItem.primer_nombre"
                        label="Primer nombre"
                        counter="25"
                        :rules="primernRules"
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
                        v-model="editedItem.segundo_nombre"
                        label="Segundo nombre"
                        counter="25"
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
                        v-model="editedItem.primer_apellido"
                        label="Primer apellido"
                        counter="25"
                        :rules="primernRules"
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
                        v-model="editedItem.segundo_apellido"
                        label="Segundo apellido"
                        counter="25"
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
                        v-model="editedItem.telefono"
                        label="Télefono"
                        :rules="telefonoRules"
                        counter="8"
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
                        v-model="editedItem.fecha_nacimiento"
                        label="Fecha nacimiento"
                        :rules="dateRules"
                        type='date'
                        required
                      ></v-text-field>
                    </v-col>
                  </v-row>

                  

                    <v-textarea
                      rows="2"
                      v-model="editedItem.direccion"
                      label="Dirección"
                      :counter="250"
                      :rules="dirRules"
                      required
                    ></v-textarea>
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
    name: 'Indexenfermero',

    data: () => ({
        loading: false,
        search: '',
        dialog: false,
        dialogDelete: false,
        valid: true,
        cuiRules: [
            v => !!v || 'CUI es requerido',
            v => !(v && isNaN(v)) || 'Debe ser un valor numerico',
            v => (v && v.length >= 13 && v.length <= 15) || 'El cui debe estar entre 13 y 15 digitos',
        ],
        primernRules: [
            v => !!v || 'Este campo es requerido',
            v => (v && v.length <= 25) || 'Debe ingresar menos de 10 caracteres',
        ],
        telefonoRules: [
            v => !!v || 'Télefono es requerido',
            v => !(v && isNaN(v)) || 'Debe ser un valor numerico',
            v => (v && v.length >= 8 && v.length <= 8) || 'El número de télefono debe contener 8 digitos'
        ],
        dateRules: [
            v => !!v || 'La fecha de nacimiento es requerida'
        ],
        dirRules: [
            v => !!v || 'La dirección es requerida',
            v => (v && v.length <= 250) || 'Debe ingresar menos de 250 caracteres',
        ],
        headers: [
          { text: 'Nombre completo', value: 'full_name' },
          { text: 'Fecha de nacimiento', value: 'fecha_nacimiento' },
          { text: 'Telefono', value: 'telefono' },
          { text: 'Dirección', value: 'direccion' },
          { text: 'Acciones', value: 'actions', sortable: false },
        ],
        items: [],
        editedIndex: -1,
        editedItem: {
            id: 0,
            cui: '',
            primer_nombre: '',
            segundo_nombre: '',
            primer_apellido: '',
            segundo_apellido: '',
            telefono: '',
            direccion: '',
            fecha_nacimiento: ''
        },
        defaultItem: {
            id: 0,
            cui: '',
            primer_nombre: '',
            segundo_nombre: '',
            primer_apellido: '',
            segundo_apellido: '',
            telefono: '',
            direccion: '',
            fecha_nacimiento: ''
        }
    }),

    computed: {
      formTitle () {
        return this.editedIndex === -1 ? 'Nuevo registro' : 'Editar registro'
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
        self.getAll()
    },

    methods: {
    //listar todos los registrros
      getAll() {
        let self = this;
        self.loading = true;
        self.$store.state.services.enfermeroService
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
        self.$store.state.services.enfermeroService
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
          self.$store.state.services.enfermeroService
          .create(data)
          .then(r=>{
            self.loading = false;
              if(r.response !== undefined){
                self.$store.state.global.captureError(r, 'error')
                return
              }
              self.$toastr.success('enfermero creada con éxito', 'Mensaje');
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
          self.$store.state.services.enfermeroService
          .update(data)
          .then(r=>{
            self.loading = false;
              if(r.response !== undefined){
                self.$store.state.global.captureError(r, 'error')
                return
              }      
              self.$toastr.success('enfermero actualizada con éxito', 'Mensaje');      
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
          self.$store.state.services.enfermeroService
          .remove(data.id)
          .then(r=>{
            self.loading = false;
              if(r.response !== undefined){
                self.$store.state.global.captureError(r, 'error')
                return
              }
              self.$toastr.success('enfermero eliminada con éxito', 'Mensaje');
              self.getAll()
          })
          .catch(e=>{

          })
      },

    editItem (item) {
        this.editedIndex = this.items.indexOf(item)
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
