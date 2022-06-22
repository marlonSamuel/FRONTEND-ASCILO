<template>
<div>

  <v-tabs centered v-model="tabs" icons-and-text>
        <v-tab @click="changeStatus('P')"> Pagos <v-icon>mdi-thumb-up</v-icon></v-tab>
        <v-tab @click="changeStatus('A')"> Pagos anulados <v-icon>mdi-thumb-down</v-icon></v-tab>
    </v-tabs>

  <v-data-table
    :headers="headers"
    :items="itemsStatus"
    sort-by="calories"
    class="elevation-1"
    :search="search"
  >
    <template v-slot:item.paciente="{ item }">
        {{ getItemFullName(item.paciente) }}
    </template>

    <template v-slot:item.total="{ item }">
        {{ item.total | currency('Q ') }}
    </template>

    <template v-slot:item.pago_mensual="{ item }">
        {{ item.meses[0].monto | currency('Q ') }}
    </template>

     <template v-slot:item.estado="{ item }">
       <label :class="item.estado == 'P' ? 'green--text' : 'red--text'"> {{ item.estado == 'P' ? 'PAGADO' : 'ANULADO' }} </label>
    </template>

    <template v-slot:item.meses="{ item }">
       <label> {{item.meses.map((x) => x.mes).join(', ') }}, </label>
    </template>

    <template v-slot:top>
      <v-toolbar
        flat
      >
        <v-toolbar-title>PAGOS {{estado == 'P'  ? 'MENSUALES': 'MENSUALES ANULADOS'}}</v-toolbar-title>
        <v-spacer></v-spacer>
          <v-text-field
            v-model="search"
            append-icon="mdi-magnify"
            label="Buscar por CUI"
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
          max-width="1200px"
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
                      <v-autocomplete 
                        v-model="editedItem.paciente_id"
                        :items="pacientes"
                        :item-text="getItemFullName"
                        item-value="id"
                        :rules="pacienteRules"
                        label="Paciente"
                        required
                      ></v-autocomplete>
                    </v-col>

                  <v-col
                      cols="12"
                      sm="6"
                      md="6"
                      xs="12"
                    >
                      <v-autocomplete 
                        v-model="editedItem.anio_id"
                        :items="anios"
                        item-text="anio"
                        item-value="id"
                        :rules="anioRules"
                        label="Año"
                        required
                      ></v-autocomplete>
                    </v-col>
                    
                  </v-row>

                  <v-row>
                  <v-col
                      cols="12"
                      sm="23"
                      md="23"
                      xs="23"
                    >
                      <label>Seleccione meses</label>
                      <v-row class="light--text">
                        <v-col cols="3" v-for="mes in getMesesValidos()" :key="mes.id">
                         <v-checkbox
                            v-model="editedItem.meses"
                            :value="mes"
                            :label="mes.mes"
                            color="green"
                            :disabled="mes.disabled"
                          ></v-checkbox>
                        </v-col>
                      </v-row>
                    </v-col>

                    <v-col
                      cols="12"
                      sm="23"
                      md="23"
                      xs="23"
                    >
                      <h3 class="green--text">TOTAL: {{(editedItem.meses.length * ascilo.pago_mensual) | currency('Q ')}}</h3>
                    </v-col>
                    
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
            <v-card-title class="text-h5">Esta seguro de anular pago?</v-card-title>
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

    <v-tooltip top v-if="item.estado == 'P'">
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
      <span>Anular pago</span>
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
    name: 'indesConcpetodepago',

    data: () => ({
        loading: false,
        search: '',
        dialog: false,
        estado: 'P',
        tabs: null,
        dialogDelete: false,
        valid: true,
        ascilo: {},
        pacienteRules: [
            v => !!v || 'El paciente es requerido'
        ],
        anioRules: [
            v => !!v || 'El año es requerido'
        ],
        headers: [
          { text: '#', value: 'code' },
          { text: 'CUI', value: 'paciente.cui' },
          { text: 'Paciente', value: 'paciente' },
          { text: 'Año', value: 'anio.anio'},
          { text: 'Meses', value: 'meses'},
          { text: 'Pago mensual', value: 'pago_mensual'},
          { text: 'Total', value: 'total'},
          { text: 'Estado', value: 'estado'},
          { text: 'Acciones', value: 'actions', sortable: false },
        ],
        items: [],
        anios: [],
        meses: [],
        pacientes: [],
        itemsStatus: [],
        editedIndex: -1,
        editedItem: {
          id: null,
          paciente_id:null,
          anio_id: null,
          meses: []
        },
        defaultItem: {
            id: null,
            paciente_id:null,
            anio_id: null,
            meses: []
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
        self.getAscilo()
        self.getPacientes()
        self.getAnios()
        self.getMeses()
        self.getAll()
    },

    methods: {

      //filtrar registros por estado
      changeStatus(estado){
          let self = this;
          self.estado = estado;
          self.itemsStatus = self.items.filter(x=>x.estado == estado);
      },

      getItemFullName(item) {
          return this.$store.state.global.getFullName(item);
      },

       //listar todos los pacientes
      getAscilo() {
        let self = this;
        self.loading = true;
        self.$store.state.services.pagoService
          .getAscilo()
          .then(r => {
            self.loading = false;
            self.ascilo = r.data;
          })
          .catch(r => {
          });
      },

      //listar todos los pacientes
      getPacientes() {
        let self = this;
        self.loading = true;
        self.$store.state.services.pacienteService
          .getAll()
          .then(r => {
            self.loading = false;
            self.pacientes = r.data;
          })
          .catch(r => {
          });
      },

      //listar todos los años
      getAnios() {
        let self = this;
        self.loading = true;
        self.$store.state.services.anioService
          .getAll()
          .then(r => {
            self.loading = false;
            self.anios = r.data;
          })
          .catch(r => {
          });
      },

      //listar todos los meses
      getMeses() {
        let self = this;
        self.loading = true;
        self.$store.state.services.mesService
          .getAll()
          .then(r => {
            self.loading = false;
            self.meses = r.data;
          })
          .catch(r => {
          });
      },
    //listar todos los registrros
      getAll() {
        let self = this;
        self.loading = true;
        self.$store.state.services.pagoService
          .getAll()
          .then(r => {
            self.loading = false;
            self.items = r.data;
            self.itemsStatus = self.items.filter(x=>x.estado == self.estado)
          })
          .catch(r => {
          });
      },
//obtener po id
      get(id) {
        let self = this;
        self.$store.state.services.pagoService
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
          self.$store.state.services.pagoService
          .create(data)
          .then(r=>{
            self.loading = false;
              if(r.response !== undefined){
                self.$store.state.global.captureError(r, 'error')
                return
              }
              self.$toastr.success('Pago realizado con éxito', 'Mensaje');
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
          self.$store.state.services.pagoService
          .update(data)
          .then(r=>{
            self.loading = false;
              if(r.response !== undefined){
                self.$store.state.global.captureError(r, 'error')
                return
              }      
              self.$toastr.success('pago actualizada con éxito', 'Mensaje');      
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
          self.$store.state.services.pagoService
          .anular(data.code)
          .then(r=>{
            self.loading = false;
              if(r.response !== undefined){
                self.$store.state.global.captureError(r, 'error')
                return
              }
              self.$toastr.success('Pago anulado con éxito', 'Mensaje');
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
            self.editedItem.meses = self.editedItem.meses.filter(x=>!x.disabled)
            if(self.editedItem.meses.length == 0){
              self.$toastr.error('Seleccione al menos 1 mes','error');
              return
            }
            self.create()
            self.close()
          }
      },

      getMesesValidos(){
        let self = this
        let meses_pagados = []
        let meses_validos = []
        if(self.editedItem.paciente_id != null && self.editedItem.anio_id !== null){
          let p_pagos = self.items.filter(x=>(x.paciente.id == self.editedItem.paciente_id && x.anio.id == self.editedItem.anio_id && x.estado == 'P'));
          p_pagos.forEach( function(item, i) {
              meses_pagados = [...meses_pagados, ...item.meses]
          });
          
          self.meses.forEach(function(item,i){
            item.disabled = false;
            if(meses_pagados.some(x=>x.id == item.id)){
              item.disabled = true;
            }
            meses_validos.push(item)
          });
        }
        return meses_validos;
      }
    },

    
  }
</script>
