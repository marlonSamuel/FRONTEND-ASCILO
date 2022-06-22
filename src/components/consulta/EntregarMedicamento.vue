<template>
<div>

  <v-data-table
    :headers="headers"
    :items="items"
    class="elevation-1"
    :single-expand="true"
    show-expand
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
    <template v-slot:item.fecha_asignada="{ item }">
        <span>
            {{item.consulta.fecha_asignada | moment('DD-MM-YYYY')}} de {{item.consulta.fecha_asignada | moment('h:mm a')}} - {{item.consulta.fecha_asignada_fin | moment('h:mm a')}}
        </span>
        
    </template>
    <template v-slot:item.medico="{ item }">
        {{ getItemFullName(item.consulta.medico) }}
    </template>

    <template v-slot:expanded-item="{ headers, item }">
      <td :colspan="headers.length">
            <v-container>
        <v-card-title>{{getItemFullName(item.paciente)}}</v-card-title>
         <v-card-title>Total: {{getTotal(item.consulta.medicamentos) | currency('Q ')}}</v-card-title>
        <v-card-text>
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
                            Entregado
                        </th>
                        <th class="text-left">
                            Precio
                        </th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr
                        v-for="item in item.consulta.medicamentos"
                        :key="item.id"
                        >
                        <td>{{ item.medicamento.nombre }}</td>
                        <td>{{ item.cantidad }}</td>
                        <td>{{ item.tiempo_aplicacion }}</td>
                        <td>{{ item.indicaciones }}</td>
                        <td>{{ item.entregado == 1 ? 'SI' : 'NO' }}</td>
                        <td>{{ item.precio | currency('Q ') }}</td>
                        </tr>
                    </tbody>
                </template>
            </v-simple-table>
        </v-card-text>
    </v-container>
      </td>
    </template>

    <template v-slot:top>
      <v-toolbar
        flat
      >
        <v-toolbar-title>BUSCAR MEDICAMENTOS A ENTREGAR POR CUI DEL PACIENTE</v-toolbar-title>
        <v-spacer></v-spacer>
          <v-text-field
            v-model="search"
            append-icon="mdi-magnify"
            label="Buscar por cui"
            @click:append="getAll"
            single-line
            hide-details
          ></v-text-field>
        <v-divider
          class="mx-4"
          inset
          vertical
        ></v-divider>
        <v-spacer></v-spacer>
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

    <v-tooltip top>
      <template v-slot:activator="{ on, attrs }">
          <v-icon v-on="on"
            color="green"
            v-bind="attrs"
            small
            @click="editItem(item.consulta.id)"
            class="mr-2"
          >
            mdi-check
          </v-icon>
      </template>
      <span>Marcar como entregado</span>
    </v-tooltip>
    
    </template>
  </v-data-table>

      <v-dialog v-model="dialog" max-width="500px">
          <v-card>
            <v-card-title class="text-h5">Esta seguro de marcar como entregado los medicamentos?</v-card-title>
            <v-card-actions>
              <v-spacer></v-spacer>
              <v-btn color="error" text @click="closeConfirm">cancelar</v-btn>
              <v-btn color="blue darken-1" text @click="update">Confirmar</v-btn>
              <v-spacer></v-spacer>
            </v-card-actions>
          </v-card>
    </v-dialog>

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
    name: 'entregarMedicamento',

    data() {
        return {
            loading: false,
            search: '',
            dialog: false,
            headers: [
                { text: 'CUI', value: 'paciente.cui' },
                { text: 'Paciente', value: 'paciente' },
                { text: 'Especialidad', value: 'especialidade.nombre' },
                { text: 'Enfermero', value: 'enfermero' },
                { text: 'Motivo de visita', value: 'motivo' },
                { text: 'Fecha de programada', value: 'fecha_visita' },
                { text: 'Fecha de asignada', value: 'consulta.fecha_asignada' },
                { text: 'Médico', value: 'medico' },
                { text: 'Acciones', value: 'actions', sortable: false },
            ],
            items: [],
            id: null,
        }
    },


    computed: {
      formTitle () {
        return this.editedIndex === -1 ? 'Nuevo registro' : 'Editar registro'
      },
    },

    watch: {
    },

    created(){
        let self = this
    },

    methods: {
      //funciones para concatenar nombres
      getItemFullName(item) {
          return this.$store.state.global.getFullName(item);
      },

    //listar todos los registrros
      getAll() {
        let self = this;
        if(self.search == "") return;
        self.loading = true;
        self.$store.state.services.consultaService
          .getMedicamentos(self.search)
          .then(r => {
            self.loading = false;
            self.items = r.data;
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
          .entregarMedicamento(self.id)
          .then(r=>{
            self.loading = false;
              if(r.response !== undefined){
                self.$store.state.global.captureError(r, 'error')
                return
              }      
              self.$toastr.success('Medicamentos entregados', 'Mensaje');      
              self.getAll()
              self.dialog = false
          })
          .catch(e=>{

          })
      },

    closeConfirm () {
        let self = this
        self.dialog = false
    },

    editItem (id) {
        let self = this
        self.dialog = true
        self.id = id
    },

        getTotal(items){
            const sum = items.reduce((accumulator, object) => {
                return accumulator + parseFloat(object.precio);
            }, 0);

            return sum;
        }
    }
}
</script>
