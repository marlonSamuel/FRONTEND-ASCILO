<template>
<div>
  <v-data-table
    :headers="headers"
    :items="items"
    sort-by="calories"
    class="elevation-1"
    :search="search"
  >
    <template v-slot:item.monto="{ item }">
        {{ item.monto | currency('Q ') }}
    </template>

    <template v-slot:item.tipo="{ item }">
        <label :class="item.tipo == 'I' ? 'green--text': 'red--text'">
          {{ item.tipo == 'I' ? 'INGRESO' : 'GASTO' }}
        </label>
    </template>

    <template v-slot:top>
      <v-toolbar
        flat
      >
        <v-toolbar-title>GESTIÓN DE INGRESOS/GASTOS</v-toolbar-title>
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
                        <v-autocomplete 
                          v-model="editedItem.concepto_id"
                          :items="conceptos"
                          item-text="nombre"
                          item-value="id"
                          :rules="conceptoRules"
                          label="Concepto de pago"
                          required
                        ></v-autocomplete>
                  <v-row>
                    <v-col
                        cols="12"
                        sm="6"
                        md="6"
                        xs="12"
                      >
                        <v-autocomplete 
                          v-model="editedItem.tipo"
                          :items="tipos"
                          item-text="text"
                          item-value="value"
                          :rules="tipoRules"
                          label="Tipo de pago"
                          required
                        ></v-autocomplete>
                      </v-col>
                    <v-col
                        cols="12"
                        sm="6"
                        md="6"
                        xs="12"
                      >
                  
                      <v-text-field
                        prefix="Q"
                        v-model="editedItem.monto"
                        label="Monto"
                        :rules="montoRules"
                        type="number"   
                        step="any"
                        required
                      ></v-text-field>
                    </v-col>
                  </v-row>

                    <v-textarea
                      rows="3"
                      v-model="editedItem.observaciones"
                      label="Observaciones"
                      :counter="500"
                      :rules="observacionRules"
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
    name: 'IngresoGasto',

    data: () => ({
        loading: false,
        search: '',
        dialog: false,
        dialogDelete: false,
        valid: true,
        tipoRules: [
            v => !!v || 'Tipo de pago es requerido'
        ],
        conceptoRules: [
            v => !!v || 'Concepto de pago es requerido'
        ],
        observacionRules: [
            v => !!v || 'Observaciones es requerida'
        ],
        montoRules: [
            v => !!v || 'El monto es requerido',
            v => (v && v >= 0) || 'El monto no puede ser negativo'
        ],
        headers: [
          { text: 'Concepto de pago', value: 'concepto.nombre' },
          { text: 'Monto', value: 'monto' },
          { text: 'Tipo', value: 'tipo' },
          { text: 'observaciones', value: 'observaciones' },
          { text: 'Acciones', value: 'actions', sortable: false },
        ],
        items: [],
        conceptos: [],
        tipos: [
          {text: 'Ingreso', value: 'I'},
          {text: 'Gasto', value: 'E'}
        ],
        editedIndex: -1,
        editedItem: {
            id: 0,
            monto: '',
            concepto_id: null,
            observaciones: '',
            tipo: ''
        },
        defaultItem: {
            id: 0,
            monto: '',
            concepto_id: null,
            observaciones: '',
            tipo: ''
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
        self.getConceptos();
        self.getAll()
    },

    methods: {

      //listar todos los conceptos de pago
      getConceptos() {
        let self = this;
        self.loading = true;
        self.$store.state.services.conceptoService
          .getAll()
          .then(r => {
            self.loading = false;
            self.conceptos = r.data;
          })
          .catch(r => {
          });
      },

    //listar todos los registrros
      getAll() {
        let self = this;
        self.loading = true;
        self.$store.state.services.ingresoGastoService
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
        self.$store.state.services.ingresoGastoService
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
          self.$store.state.services.ingresoGastoService
          .create(data)
          .then(r=>{
            self.loading = false;
              if(r.response !== undefined){
                self.$store.state.global.captureError(r, 'error')
                return
              }
              self.$toastr.success('ingresoGasto creada con éxito', 'Mensaje');
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
          self.$store.state.services.ingresoGastoService
          .update(data)
          .then(r=>{
            self.loading = false;
              if(r.response !== undefined){
                self.$store.state.global.captureError(r, 'error')
                return
              }      
              self.$toastr.success('ingresoGasto actualizada con éxito', 'Mensaje');      
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
          self.$store.state.services.ingresoGastoService
          .remove(data.id)
          .then(r=>{
            self.loading = false;
              if(r.response !== undefined){
                self.$store.state.global.captureError(r, 'error')
                return
              }
              self.$toastr.success('ingresoGasto eliminada con éxito', 'Mensaje');
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
