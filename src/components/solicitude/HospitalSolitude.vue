<template>
<div>
    <v-tabs centered v-model="tabs" icons-and-text>
        <v-tab @click="changeStatus('S')"> Solicitudes pendientes <v-icon>mdi-account-clock</v-icon></v-tab>
        <v-tab @click="changeStatus('P')"> Solicitudes en proceso <v-icon>mdi-account-tie</v-icon></v-tab>
        <v-tab @click="changeStatus('F')">Consultas finalizadas <v-icon>mdi-calendar-edit</v-icon></v-tab>
        <v-tab @click="changeStatus('C')">Consultas saldadas <v-icon>mdi-cash-multiple </v-icon></v-tab>
    </v-tabs>

  <v-data-table
    :headers="headers"
    :items="itemsStatus"
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
    <template v-slot:item.fecha_asignada="{ item }">
        <span v-if="item.consulta != null">
            {{item.consulta.fecha_asignada | moment('DD-MM-YYYY')}} de {{item.consulta.fecha_asignada | moment('h:mm a')}} - {{item.consulta.fecha_asignada_fin | moment('h:mm a')}}
        </span>
        
    </template>
    <template v-slot:item.medico="{ item }">
        <span v-if="item.consulta != null">
            {{ getItemFullName(item.consulta.medico) }}
        </span>
    </template>

    <template v-slot:top>
      <v-toolbar
        flat
      >
        <v-toolbar-title>SOLICITUDES DE CONSULTAS MEDICAS {{estado == 'S' ? 'PENDIENTES' : 'ASIGNADAS'}}</v-toolbar-title>
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
                      sm="12"
                      md="12"
                      xs="12"
                    >
                      <v-autocomplete 
                        v-model="editedItem.medico_id"
                        :items="medicos"
                        :item-text="getItemFullName"
                        item-value="id"
                        :rules="medicoRules"
                        label="Médico"
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
                      <v-text-field 
                        v-model="editedItem.fecha_asignada"
                        label="Fecha de asignada"
                        :rules="fechaRules"
                        type="date"
                        required
                      ></v-text-field>
                    </v-col>

                    <v-col
                      cols="12"
                      sm="3"
                      md="3"
                      xs="12"
                    >
                      <v-text-field 
                        v-model="editedItem.hora_inicio"
                        label="Hora inicio"
                        type="time"
                        required
                      ></v-text-field>
                    </v-col>

                    <v-col
                      cols="12"
                      sm="3"
                      md="3"
                      xs="12"
                    >
                      <v-text-field 
                        v-model="editedItem.hora_fin"
                        label="Hora fin"
                        type="time"
                        required
                      ></v-text-field>
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
            color="green darken-2"
            v-bind="attrs"
            small
            class="mr-2"
            @click="newItem(item)"
          >
            mdi-plus
          </v-icon>
      </template>
      <span>Asignar medico</span>
    </v-tooltip>
    <v-tooltip top v-if="item.estado == 'P'">
      <template v-slot:activator="{ on, attrs }">
          <v-icon v-on="on"
            color="yellow darken-2"
            v-bind="attrs"
            small
            class="mr-2"
            @click="editItem(item.consulta)"
          >
            mdi-pencil
          </v-icon>
      </template>
      <span>Editar</span>
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

    data() {
        return {
            tabs: null,
            loading: false,
            search: '',
            estado: 'S',
            dialog: false,
            dialogDelete: false,
            valid: true,
            today: moment(),

            headers: [
            { text: 'CUI', value: 'paciente.cui' },
            { text: 'Paciente', value: 'paciente' },
            { text: 'Especialidad', value: 'especialidade.nombre' },
            { text: 'Enfermero', value: 'enfermero' },
            { text: 'Motivo de visita', value: 'motivo' },
            { text: 'Fecha de programada', value: 'fecha_visita' },
            { text: 'Fecha de asignada', value: 'fecha_asignada' },
            { text: 'Médico', value: 'medico' },
            { text: 'Estado', value: 'estado' },
            { text: 'Acciones', value: 'actions', sortable: false },
            ],

            items: [],
            itemsStatus: [],
            medicos: [],
            editedIndex: -1,
            editedItem: {
                id: 0,
                solicitude_id: null,
                medico_id: null,
                fecha_asignada: '',
                fecha_asignada_fin: '',
                hora_inicio: '',
                hora_fin: ''
            },
            defaultItem: {
                id: 0,
                solicitude_id: null,
                medico_id: null,
                fecha_asignada: '',
                fecha_asignada_fin: '',
                hora_inicio: '',
                hora_fin: ''
            },
            medicoRules: [
                v => !!v || 'El enfermero(a) es requerido'
            ],
            fechaRules: [
                v => !!v || 'La fecha asignada es requerida',
                v => !(moment(v).format('YYYY-MM-DD') < moment().format('YYYY-MM-DD')) || 'No puede seleccionar una fecha anterior a la actual'
            ],
            horaInicioRules: [
                v => !!v || 'La hora de inicio es requerida'
            ],
            horaFinRules: [
                v => !!v || 'La hora fin es requerida'
            ],
        }
    },


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
        self.getMedicos()
        self.getAll()
    },

    methods: {
        //filtrar registros por estado
        changeStatus(estado){
            let self = this;
            self.estado = estado;
            self.itemsStatus = self.items.filter(x=>x.estado == estado);
        },
        
      //obtener color del estado
      getColor (estado) {
        if(estado == 'S'){
          return ['SOLICITADO','blue']
        }else if(estado == 'P'){
          return ['EN PROCESO','yellow darken-3'] 
        }else if(estado == 'F'){
          return ['FINALIZADA','red']
        }else if(estado == 'C'){
          return ['CONSULTA SALDADA','purple']
        }
        return ['SOLICITADO','blue']
      },
      //funciones para concatenar nombres
      getItemFullName(item) {
          return this.$store.state.global.getFullName(item);
      },
      //listar todos los registrros de medicos
      getMedicos() {
        let self = this;
        self.loading = true;
        self.$store.state.services.medicoService
          .getAll()
          .then(r => {
            self.loading = false;
            self.medicos = r.data;
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
            self.itemsStatus = self.items.filter(x=>x.estado == 'S');
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
          self.$store.state.services.consultaService
          .create(data)
          .then(r=>{
            self.loading = false;
              if(r.response !== undefined){
                self.$store.state.global.captureError(r, 'error')
                return
              }
              self.$toastr.success('Solicitud asignada con éxito', 'Mensaje');
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
          self.$store.state.services.consultaService
          .update(data)
          .then(r=>{
            self.loading = false;
              if(r.response !== undefined){
                self.$store.state.global.captureError(r, 'error')
                return
              }      
              self.$toastr.success('Solicitud asignada actualizada con éxito', 'Mensaje');      
              self.getAll()
          })
          .catch(e=>{

          })
      },

    newItem (item){
        this.editedItem = Object.assign({}, this.defaultItem)
        this.editedIndex = -1
        this.editedItem.solicitude_id = item.id;
        this.editedItem.fecha_asignada  = item.fecha_visita;
        this.dialog = true
    },

    editItem (item) {
        this.editedIndex = 1
        this.editedItem.id = item.id;
        this.editedItem.medico_id = parseInt(item.medico_id);
        this.editedItem.fecha_asignada = moment(item.fecha_asignada).format('YYYY-MM-DD');
        this.editedItem.hora_inicio = moment(item.fecha_asignada).format('h:mm');
        this.editedItem.hora_fin = moment(item.fecha_asignada_fin).format('h:mm');
        this.dialog = true
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
        let hi = self.editedItem.fecha_asignada+' '+self.editedItem.hora_inicio+':00';
        let hf = self.editedItem.fecha_asignada+' '+self.editedItem.hora_fin+':00';
        self.editedItem.fecha_asignada = hi; 
        self.editedItem.fecha_asignada_fin = hf;
        //validar horas
        if(moment(hi).add(30,'minutes') > moment(hf)){
            self.$toastr.error('la hora de inicio no puede ser menor a la hora fin, la consulta debe durar al menos 30 minutos','error');
        }

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
