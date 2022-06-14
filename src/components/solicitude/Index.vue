<template>
<div>
  <v-data-table
    :headers="headers"
    :items="items"
    sort-by="calories"
    :search="search"
    class="elevation-1"
  >
  <template v-slot:item.paciente="{ item }">
        {{ getItemFullName(item.paciente) }}
    </template>
    <template v-slot:item.enfermero="{ item }">
        {{ getItemFullName(item.enfermero) }}
    </template>
    <template v-slot:item.fecha_visita="{ item }">
        {{item.fecha_visita | moment('DD-MM-YYYY')}}
    </template>
    <template v-slot:item.estado="{ item }">
      <v-chip
        small
        :color="getColor(item.estado)[1]"
        dark
      >
        {{ getColor(item.estado)[0] }}
      </v-chip>
    </template>

    <template v-slot:top>
      <v-toolbar
        flat
      >
        <v-toolbar-title>SOLICITUDES DE CONSULTAS MEDICAS</v-toolbar-title>
        <v-spacer></v-spacer>
          <v-text-field
            v-model="search"
            append-icon="mdi-magnify"
            label="Buscar por cui"
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
          max-width="1000px"
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
                        v-model="editedItem.enfermero_id"
                        :items="enfermeros"
                        :item-text="getItemFullName"
                        item-value="id"
                        :rules="enfermeroRules"
                        label="Enfermero"
                        required
                      ></v-autocomplete>
                    </v-col>
                    
                  </v-row>

                  <v-row>
                  <v-col
                      cols="12"
                      sm="6"
                      md="6"
                      xs="12"
                    >
                      <v-autocomplete 
                        v-model="editedItem.especialidade_id"
                        :items="especialidades"
                        item-text="nombre"
                        item-value="id"
                        :rules="especialidadRules"
                        label="Especialidad"
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
                        v-model="editedItem.fecha_visita"
                        :rules="fechaRules"
                        label="Fecha de visita"
                        type="date"
                        required
                      ></v-text-field>
                    </v-col>
                    
                  </v-row>

                    <v-textarea
                      rows="2"
                      v-model="editedItem.motivo"
                      label="Motivo de visita"
                      :counter="500"
                      :rules="motivoRules"
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
            color="blue darken-2"
            v-bind="attrs"
            small
            class="mr-2"
          >
            mdi-eye
          </v-icon>
      </template>
      <span>Ver solicitud</span>
    </v-tooltip>
    <v-tooltip top v-if="item.estado == 'S'">
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

    <v-tooltip top v-if="item.estado == 'S'">
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
import moment from 'moment'
  export default {
    name: 'Indexsolicitude',

    data: () => ({
        loading: false,
        search: '',
        dialog: false,
        dialogDelete: false,
        valid: true,
        today: moment(),
        especialidadRules: [
            v => !!v || 'La especialidad es requerida'
        ],
        enfermeroRules: [
            v => !!v || 'El enfermero(a) es requerido'
        ],
        pacienteRules: [
            v => !!v || 'El paciente es requerido'
        ],
        motivoRules: [
            v => !!v || 'El motivo es requerido'
        ],
        fechaRules: [
            v => !!v || 'La fecha de visita es requerida',
            v => !(moment(v).format('YYYY-MM-DD') < moment().format('YYYY-MM-DD')) || 'No puede seleccionar una fecha anterior a la actual'
        ],

        headers: [
          { text: 'CUI', value: 'paciente.cui' },
          { text: 'Paciente', value: 'paciente' },
          { text: 'Especialidad', value: 'especialidade.nombre' },
          { text: 'Enfermero', value: 'enfermero' },
          { text: 'Fecha de programada', value: 'fecha_visita' },
          { text: 'Motivo de visita', value: 'motivo' },
          { text: 'Estado', value: 'estado' },
          { text: 'Acciones', value: 'actions', sortable: false },
        ],
        items: [],
        especialidades: [],
        enfermeros: [],
        pacientes: [],
        editedIndex: -1,
        editedItem: {
            id: 0,
            especialidade_id: null,
            enfermero_id: null,
            paciente_id: null,
            motivo: '',
            fecha_visita: ''
        },
        defaultItem: {
            id: 0,
            especialidade_id: null,
            enfermero_id: null,
            paciente_id: null,
            motivo: '',
            fecha_visita: ''
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
        self.getEspecialidades()
        self.getEnfermeros()
        self.getPacientes()
        self.getAll()
    },

    methods: {
      //obtener color del estado
      getColor (estado) {
        if(estado == 'S'){
          return ['SOLICITADO','blue']
        }else if(estado == 'P'){
          return ['EN PROCESO','yellow darken-3'] 
        }else if(estado == 'F'){
          return ['FINALIZADA','red']
        }else if(estado == 'C'){
          return ['CONSULTA SALDADA','green']
        }
        return ['SOLICITADO','blue']
      },
      //funciones para concatenar nombres
      getItemFullName(item) {
          return this.$store.state.global.getFullName(item);
      },
      //listar todos los registrros de especilaidades
      getEspecialidades() {
        let self = this;
        self.loading = true;
        self.$store.state.services.especialidadeService
          .getAll()
          .then(r => {
            self.loading = false;
            self.especialidades = r.data;
          })
          .catch(r => {
          });
      },
      //listar todos los registrros de enfermeros
      getEnfermeros() {
        let self = this;
        self.loading = true;
        self.$store.state.services.enfermeroService
          .getAll()
          .then(r => {
            self.loading = false;
            self.enfermeros = r.data;
          })
          .catch(r => {
          });
      },
      //listar todos los registrros de pacientes
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
    //listar todos los registrros
      getAll() {
        let self = this;
        self.loading = true;
        self.$store.state.services.solicitudeService
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
        self.$store.state.services.solicitudeService
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
          self.$store.state.services.solicitudeService
          .create(data)
          .then(r=>{
            self.loading = false;
              if(r.response !== undefined){
                self.$store.state.global.captureError(r, 'error')
                return
              }
              self.$toastr.success('solicitude creada con éxito', 'Mensaje');
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
          self.$store.state.services.solicitudeService
          .update(data)
          .then(r=>{
            self.loading = false;
              if(r.response !== undefined){
                self.$store.state.global.captureError(r, 'error')
                return
              }      
              self.$toastr.success('solicitude actualizada con éxito', 'Mensaje');      
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
          self.$store.state.services.solicitudeService
          .remove(data.id)
          .then(r=>{
            self.loading = false;
              if(r.response !== undefined){
                self.$store.state.global.captureError(r, 'error')
                return
              }
              self.$toastr.success('solicitude eliminada con éxito', 'Mensaje');
              self.getAll()
          })
          .catch(e=>{

          })
      },

    editItem (item) {
        this.editedIndex = this.items.indexOf(item)
        item.especialidade_id = item.especialidade.id
        item.enfermero_id = item.enfermero.id
        item.paciente_id = item.paciente.id
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
