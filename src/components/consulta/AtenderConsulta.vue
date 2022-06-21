<template>
<div>
<v-breadcrumbs :items="breadCrub">
    <template v-slot:item="{ item }">
      <v-breadcrumbs-item
        :href="item.href"
        :disabled="item.disabled"
      >
        {{ item.text.toUpperCase() }}
      </v-breadcrumbs-item>
    </template>
  </v-breadcrumbs>
    <v-dialog
        transition="dialog-top-transition"
        max-width="800"
        persistent
        v-model="examenDialog"
      >
        <template>
          <v-card>
            <v-toolbar
              color="purple"
              dark
            >EXAMENES</v-toolbar>
            <v-card-text>
            <v-container>
              <v-form
                    ref="formExamen"
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
                        v-model="examenItem.examene_id"
                        :items="examenes"
                        item-text="nombre"
                        item-value="id"
                        :rules="examenRules"
                        label="Examen"
                        required
                      ></v-autocomplete>
                    </v-col>
                </v-row>

                  <v-row>
                  <v-col
                      cols="12"
                      sm="12"
                      md="12"
                      xs="12"
                    >
                    <v-textarea
                      rows="3"
                      v-model="examenItem.indicaciones"
                      label="Indicaciones"
                      :counter="500"
                      :rules="indicacionesRules"
                      required
                    ></v-textarea>
                     </v-col>
                  </v-row>
                </v-form>
            </v-container>
            </v-card-text>
            <v-card-actions class="justify-end">
              <v-spacer></v-spacer>
              <v-btn
                color="error"
                text
                @click="openExam(false)"
              >
                Cancelar
              </v-btn>
              <v-btn
                color="blue darken-1"
                text
                @click="addExam"
              >
                Guardar
              </v-btn>
            </v-card-actions>
          </v-card>
        </template>
    </v-dialog>

    <v-dialog
        transition="dialog-top-transition"
        max-width="800"
        persistent
        v-model="medicinaDialog"
      >
        <template>
          <v-card>
            <v-toolbar
              color="purple"
              dark
            >MEDICAMENTOS</v-toolbar>
            <v-card-text>
            <v-container>
              <v-form
                    ref="formMedicamento"
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
                        v-model="medicamentoItem.medicamento_id"
                        :items="medicamentos"
                        item-text="nombre"
                        item-value="id"
                        :rules="medicamentoRules"
                        label="Medicamento"
                        required
                      ></v-autocomplete>
                    </v-col>
                </v-row>

                 <v-row>
                  <v-col
                      cols="6"
                      sm="6"
                      md="6"
                      xs="12"
                    >
                    <v-text-field
                      v-model="medicamentoItem.cantidad"
                      label="Cantidad"
                      :rules="cantidadRules"
                      type="number"
                      required
                    ></v-text-field>
                    </v-col>

                    <v-col
                      cols="6"
                      sm="6"
                      md="6"
                      xs="12"
                    >
                    <v-text-field
                      v-model="medicamentoItem.tiempo_aplicacion"
                      label="Dias de aplicación"
                      :rules="tiempoRules"
                      type="number"
                      required
                    ></v-text-field>
                    </v-col>

                  </v-row>

                  <v-row>
                  <v-col
                      cols="12"
                      sm="12"
                      md="12"
                      xs="12"
                    >
                    <v-textarea
                      rows="3"
                      v-model="medicamentoItem.indicaciones"
                      label="Indicaciones"
                      :counter="500"
                      :rules="indicacionesRules"
                      required
                    ></v-textarea>
                    </v-col>
                  </v-row>
                </v-form>
            </v-container>
            </v-card-text>
            <v-card-actions class="justify-end">
              <v-spacer></v-spacer>
              <v-btn
                color="error"
                text
                @click="openMedicamento(false)"
              >
                Cancelar
              </v-btn>
              <v-btn
                color="blue darken-1"
                text
                @click="addMedicamento"
              >
                Guardar
              </v-btn>
            </v-card-actions>
          </v-card>
        </template>
      </v-dialog>

      
    <v-tabs centered v-model="tabs" icons-and-text>
        <v-tab @click="changeStatus('P')"> Solicitudes pendientes <v-icon>mdi-account-clock</v-icon></v-tab>
        <v-tab @click="changeStatus('T')"> Solicitudes atendidas <v-icon>mdi-account-tie</v-icon></v-tab>
    </v-tabs>

  <v-data-table
    :headers="headers"
    :items="itemsStatus"
    :search="search"
    class="elevation-1"
  >
  <template v-slot:item.paciente="{ item }">
        {{ getItemFullName(item.solicitude.paciente) }}
    </template>
    <template v-slot:item.enfermero="{ item }">
        {{ getItemFullName(item.solicitude.enfermero) }}
    </template>
    <template v-slot:item.fecha_visita="{ item }">
        {{item.fecha_visita | moment('DD-MM-YYYY')}}
    </template>
    <template v-slot:item.estado="{ item }">
      <v-chip
        small
        :color="getColor(item.solicitude.estado)[1]"
        dark
      >
        {{ getColor(item.solicitude.estado)[0] }}
      </v-chip>
    </template>
    <template v-slot:item.fecha_asignada="{ item }">
        <span>
            {{item.fecha_asignada | moment('DD-MM-YYYY')}} de {{item.fecha_asignada | moment('h:mm a')}} - {{item.fecha_asignada_fin | moment('h:mm a')}}
        </span>
        
    </template>

    <template v-slot:top>
      <v-toolbar
        flat
      >
        <v-toolbar-title>MIS SOLICITUDES DE CONSULTAS MEDICAS {{estado == 'P' ? 'PENDIENTES' : 'ASIGNADAS'}} {{date}}</v-toolbar-title>
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
          persistent
          max-width="1500px"
        >
          <v-card>
            <v-card-title>
              <span class="text-h5">CONSULTA {{ paciente | uppercase}}</span>
            </v-card-title>

            <v-card-text>
              <v-container>
                <v-form
                    ref="form"
                    v-model="valid"
                    lazy-validation
                >

                  <v-row>
                    <v-textarea
                      rows="3"
                      v-model="editedItem.diagnostico"
                      label="Diagnostico"
                      :counter="1000"
                      :rules="diagnosticoRules"
                      required
                    ></v-textarea>
                  </v-row>
                  <v-row>
                    <v-textarea
                      rows="3"
                      v-model="editedItem.observaciones"
                      label="Observaciones"
                      :counter="500"
                    ></v-textarea>
                  </v-row>


                <v-row>
                    <v-col xs="12" sm="12" md="12" lg="12">
                        
                  <v-row>
                    <v-col sm="12" md="12" xs="12" >
                         <div class="my-2">
                        <v-btn
                        color="success"
                        @click="openExam(true)"
                        small
                        dark
                        >
                        <v-icon>mdi-plus</v-icon>
                        EXAMENES
                        </v-btn>
                         </div>
                    </v-col>
                    
                    <v-col sm="12" md="12" xs="12">
                        <v-simple-table dense>
                                <template v-slot:default>
                                <thead>
                                    <tr>
                                    <th class="text-left">
                                        Examen
                                    </th>
                                    <th class="text-left">
                                        Indicaciones
                                    </th>
                                    <th class="text-left">
                                        Acción
                                    </th>
                                    </tr>
                                </thead>
                                <tbody>
                                    <tr
                                    v-for="item in editedItem.examenes"
                                    :key="item.examene_id"
                                    >
                                    <td>{{ getExamenName(item.examene_id) }}</td>
                                    <td>{{ item.indicaciones }}</td>
                                    <td><v-icon small color="error" @click="removeExam(item)">mdi-minus</v-icon></td>
                                    </tr>
                                </tbody>
                                </template>
                        </v-simple-table>
                    </v-col>
                    
                  </v-row>
                    </v-col>

                    <v-col xs="12" sm="12" md="12" lg="12">
                                        <v-row>
                  <v-col sm="12" md="12" xs="12">
                    <div class="my-2">
                        <v-btn
                        color="success"
                        @click="openMedicamento(true)"
                        small
                        dark
                        >
                        <v-icon>mdi-plus</v-icon>
                        MEDICAMENTOS
                        </v-btn>
                    </div>
                </v-col>
                <v-col sm="12" md="12" xs="12">
                     <v-simple-table dense>
                            <template v-slot:default>
                            <thead>
                                <tr>
                                <th class="text-left">
                                    medicamento
                                </th>
                                <th class="text-left">
                                    cantidad
                                </th>
                                <th class="text-left">
                                    dias de aplicación
                                </th>
                                <th class="text-left">
                                    Indicaciones
                                </th>
                                <th class="text-left">
                                    Acción
                                </th>
                                </tr>
                            </thead>
                            <tbody>
                                <tr
                                v-for="item in editedItem.medicamentos"
                                :key="item.medicamento_id"
                                >
                                <td>{{ getMedicamentoName(item.medicamento_id) }}</td>
                                <td>{{ item.cantidad }}</td>
                                <td>{{ item.tiempo_aplicacion }}</td>
                                <td>{{ item.indicaciones }}</td>
                                <td><v-icon small color="error" @click="removeMedicamento(item)">mdi-minus</v-icon></td>
                                </tr>
                            </tbody>
                            </template>
                    </v-simple-table>
                    </v-col>
                </v-row>
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
                :disabled="showAddExamen(editedItem.examenes) || showAddMedicamento(editedItem.medicamentos)"
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
    <v-tooltip top v-if="item.estado !== 'F'">
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
            estado: 'P',
            dialog: false,
            examenDialog: false,
            medicinaDialog: false,
            dialogDelete: false,
            valid: true,
            today: moment(),
            date: '',
            breadCrub: [
                {
                    text: 'Calendario de consultas',
                    disabled: false,
                    href: '#/mis-consultas',
                },
                {
                text: 'Atender consultas',
                    disabled: true,
                    href: '#',
                },
            ],

            headers: [
                { text: 'CUI', value: 'solicitude.paciente.cui' },
                { text: 'Paciente', value: 'paciente' },
                { text: 'Especialidad', value: 'solicitude.especialidade.nombre' },
                { text: 'Enfermero', value: 'enfermero' },
                { text: 'Motivo de visita', value: 'solicitude.motivo' },
                { text: 'Fecha de programada', value: 'solicitude.fecha_visita' },
                { text: 'Fecha de asignada', value: 'fecha_asignada' },
                { text: 'Estado', value: 'estado' },
                { text: 'Acciones', value: 'actions', sortable: false },
            ],
            paciente: '',
            medicamentos: [],
            examenes: [],
            items: [],
            itemsStatus: [],
            editedIndex: -1,
            editedItem: {
                id: 0,
                diagnostico: '',
                observaciones: '',
                examenes: [],
                medicamentos: []
            },
            defaultItem: {
                id: 0,
                diagnostico: '',
                observaciones: '',
                examenes: [],
                medicamentos: []
            },

            examenItem: {
                examene_id: null,
                precio: 0,
                indicaciones: ""
            },
            medicamentoItem: {
                medicamento_id: null,
                cantidad: null,
                tiempo_aplicacion: null,
                indicaciones: "",
                precio: 0
            },
            diagnosticoRules: [
                v => !!v || 'El diagnostico es es requerido'
            ],
            indicacionesRules: [
                v => !!v || 'las indicaciones es es requerida'
            ],
            examenRules: [
                v => !!v || 'El examen es es requerida'
            ],
            medicamentoRules: [
                v => !!v || 'El medicamento es requerida'
            ],
            tiempoRules: [
                v => !!v || 'Los dias de aplicacion es requerido',
                v => !(v < 1) || 'El tiempo debe 1 o mayor a 1',
            ],
            cantidadRules: [
                v => !!v || 'La cantidad es requerida',
                v => !(v < 1) || 'La cantidad debe 1 o mayor a 1',
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
        self.date = moment(self.$route.params.date).format('DD/MM/YYYY')
        self.getAll(self.$route.params.date)
        self.getMedicamentos()
        self.getExamenes()
    },

    methods: {
        //filtrar registros por estado
        changeStatus(estado){
            let self = this;
            self.estado = estado;
            self.itemsStatus = estado == 'P' ? self.items.filter(x=>x.solicitude.estado === estado):self.items.filter(x=>x.solicitude.estado !== 'P');
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

      //listar todos los registrros
      getMedicamentos() {
        let self = this;
        self.loading = true;
        self.$store.state.services.medicamentoService
          .getAll()
          .then(r => {
            self.loading = false;
            self.medicamentos = r.data;
          })
          .catch(r => {
          });
      },

      //listar todos los registrros
      getExamenes() {
        let self = this;
        self.loading = true;
        self.$store.state.services.examenService
          .getAll()
          .then(r => {
            self.loading = false;
            self.examenes = r.data;
          })
          .catch(r => {
          });
      },

    //listar todos los registrros
      getAll(date) {
        let self = this;
        self.loading = true;
        self.$store.state.services.consultaService
          .getByUserDate(date)
          .then(r => {
            self.loading = false;
            self.items = r.data;
            self.itemsStatus = self.estado == 'P' ? self.items.filter(x=>x.solicitude.estado == self.estado) : self.items.filter(x=>x.solicitude.estado !== 'P');
          })
          .catch(r => {
          });
      },

    //actualizar registro
      update(){
          let self = this;
          let data = self.editedItem
          self.loading = true;
          self.$store.state.services.consultaService
          .finish(data)
          .then(r=>{
            self.loading = false;
              if(r.response !== undefined){
                self.$store.state.global.captureError(r, 'error')
                return
              }      
              self.$toastr.success('Consulta finalizada con éxito', 'Mensaje');      
              self.getAll(self.$route.params.date)
          })
          .catch(e=>{

          })
      },

    editItem (item) {
        let self = this
        self.paciente = self.getItemFullName(item.solicitude.paciente);
        this.editedItem = Object.assign({}, item);
        this.dialog = true
    },

    close () {
        this.dialog = false
        this.$nextTick(() => {
            this.editedItem = Object.assign({}, this.defaultItem)
            this.editedIndex = -1
            this.$refs.form.reset();
        })
    },

    openExam(open){
        let self = this;
        self.examenDialog = open;
        if(!open){
            self.$refs.formExamen.reset();
        }
    },

    openMedicamento(open){
        let self = this;
        self.medicinaDialog = open;
        if(!open){
            self.$refs.formMedicamento.reset();
        }
    },

    addExam(){
        let self = this;
        if (this.$refs.formExamen.validate()){
            if(self.editedItem.examenes.some(x=>x.examene_id==self.examenItem.examene_id)){
                self.$toastr.error('El examen ya fue agregado','error');
                return;
            }
            let examen = self.examenes.find(x=>x.id==self.examenItem.examene_id);
            self.examenItem.precio = examen.costo_con_descuento;
            self.editedItem.examenes.push({...self.examenItem});
            this.$refs.formExamen.reset();
        }
    },

    removeExam(item){
        let self = this;
        let index = self.editedItem.examenes.indexOf(item);
        self.editedItem.examenes.splice(index, 1);
    },

    addMedicamento(){
        let self = this;
        if (this.$refs.formMedicamento.validate()){
            if(self.editedItem.medicamentos.some(x=>x.medicamento_id==self.medicamentoItem.medicamento_id)){
                self.$toastr.error('El medicamento ya fue agregado','error');
                return;
            }
            let medicamento = self.medicamentos.find(x=>x.id==self.medicamentoItem.medicamento_id);
            self.medicamentoItem.precio = medicamento.costo_con_descuento;
            self.editedItem.medicamentos.push({...self.medicamentoItem});
            this.$refs.formMedicamento.reset();
        }
    },

    removeMedicamento(item){
        let self = this;
        let index = self.editedItem.medicamentos.indexOf(item);
        self.editedItem.medicamentos.splice(index, 1);
    },

    getExamenName(id){
        let self = this;
        return self.examenes.find(x=>x.id == id).nombre;
    },

    getMedicamentoName(id){
        let self = this;
        return self.medicamentos.find(x=>x.id == id).nombre;
    },

    save () {
        let self = this
        if (this.$refs.form.validate()){
            console.log(self.editedItem)
            self.update();
            this.close();
          }
        },

      showAddExamen(items){
        let self = this
        return items.some(x=>x.realizado);
      },

      showAddMedicamento(items){
        let self = this
        return items.some(x=>x.entregado);
      }
    }
  }
</script>
