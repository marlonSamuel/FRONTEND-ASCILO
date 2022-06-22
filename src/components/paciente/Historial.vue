<template>
 <div>
    <template v-if="paciente !== null">
    <v-breadcrumbs :items="breadCrub">
        <template v-slot:item="{ item }">
        <v-breadcrumbs-item
            :href="item.href"
            :disabled="item.disabled"
        >
            {{item.text | uppercase}}
        </v-breadcrumbs-item>
        </template>
    </v-breadcrumbs>
     <v-container>
        <v-toolbar-title> {{getName(paciente) | uppercase}} </v-toolbar-title>

        <v-expansion-panels multiple focusable style="padding: 15px;">
            <v-expansion-panel>
              <v-expansion-panel-header>INFORMACIÓN DEL PACIENTE</v-expansion-panel-header>
              <v-expansion-panel-content>
                <v-row style="padding: 10px;">
                  <v-col
                    sm="4"
                    md="4"
                    xs="12"
                  >
                    <p><b>Cui:</b>  {{paciente.cui}}</p>
                    <p><b>Nombre completo:</b>  {{getName(paciente)}}</p>
                    <p><b>Fecha nacimiento:</b>  {{paciente.fecha_nacimiento | moment("DD-MM-YYYY")}}</p>
                  </v-col>
                   <v-col
                    sm="4"
                    md="4"
                    xs="12"
                  >
                    <p><b>Género:</b>  {{paciente.genero == 'M' ? 'Masculino': 'Femenino'}}</p>
                    <p><b>Edad:</b>  {{paciente.fecha_nacimiento |moment("from", "now",true)}}</p>
                    <p><b>Dirección:</b>  {{paciente.direccion}}</p>
                    
                  </v-col>
                  <v-col
                    sm="4"
                    md="4"
                    xs="12"
                  >
                    <p><b>Psicopatología:</b>  {{paciente.psicopatologia.nombre}}</p>
                    <p><b>Razón por internrarlo(a):</b>  {{paciente.razon}}</p>
                    <p><b>Alergias:</b>  {{paciente.alergias}}</p>
                    <p><b>Medicamentos administrados:</b>  {{paciente.medicamentos.map((x) => x.medicamento.nombre).join(', ')}}</p>
                  </v-col>
                </v-row>
              
              </v-expansion-panel-content>
            </v-expansion-panel>

            <v-expansion-panel>
              <v-expansion-panel-header>INFORMACIÓN DEL RESPONSABLE</v-expansion-panel-header>
              <v-expansion-panel-content>
                 <v-row style="padding: 10px;">
                  <v-col
                    sm="4"
                    md="4"
                    xs="12"
                  >
                    <p><b>Cui:</b>  {{paciente.cui_responsable}}</p>
                    <p><b>Nombre completo:</b>  {{paciente.primer_nombre_responsable}} {{paciente.segundo_nombre_responsable}} {{paciente.primer_apellido_responsable}} {{paciente.primer_apellido_responsable}}</p>
                    <p><b>Parentesco:</b>  {{parentescos.find(x=>x.value == paciente.parentesco).text}}</p>
                    <p><b>Fecha nacimiento:</b>  {{paciente.fecha_nacimiento_responsable | moment("DD-MM-YYYY")}}</p>
                  </v-col>
                   <v-col
                    sm="4"
                    md="4"
                    xs="12"
                  >
                    <p><b>Celular:</b>  {{paciente.celular}}</p>
                    <p><b>Télefono (casa):</b>  {{paciente.telefono}}</p>
                    <p><b>Dirección:</b>  {{paciente.direccion_responsable}}</p>
                    <p><b>Correo electronico:</b>  {{paciente.email}}</p>
                  </v-col>
                </v-row>
              </v-expansion-panel-content>
            </v-expansion-panel>

            <v-expansion-panel>
              <v-expansion-panel-header>HISTORIAL MEDICO</v-expansion-panel-header>
              <v-expansion-panel-content>
                <v-tabs centered v-model="tabs" icons-and-text>
                    <v-tab @click="changeStatus('F')">Consultas finalizadas/saldadas <v-icon>mdi-calendar-edit</v-icon></v-tab>
                    <v-tab @click="changeStatus('P')"> Solicitudes en proceso de asignación <v-icon>mdi-account-tie</v-icon></v-tab>
                    <v-tab @click="changeStatus('S')"> Solicitudes pendientes de asignación <v-icon>mdi-account-clock</v-icon></v-tab>
                </v-tabs>
                    <br />
                  <v-data-table
                    :headers="headers"
                    :items="items"
                    class="elevation-1"
                    :single-expand="true"
                    show-expand
                >
                    <template v-slot:item.enfermero="{ item }">
                        {{ getName(item.enfermero) }}
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
                            {{ getName(item.consulta.medico) }}
                        </span>
                    </template>

                        <template v-slot:expanded-item="{ headers, item }">
                            <td :colspan="headers.length" v-if="item.consulta != null">
                                    <v-container>
                                <v-card-title>DETALLE MEDICAMENTOS</v-card-title>
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
                                                    Fecha
                                                </th>
                                                </tr>
                                            </thead>
                                            <tbody>
                                                <tr
                                                v-for="me in item.consulta.medicamentos"
                                                :key="me.id"
                                                >
                                                <td>{{ me.medicamento.nombre }}</td>
                                                <td>{{ me.cantidad }}</td>
                                                <td>{{ me.tiempo_aplicacion }}</td>
                                                <td>{{ me.indicaciones }}</td>
                                                <td>{{ me.entregado == 1 ? 'SI' : 'NO' }}</td>
                                                <td>{{ me.created_at | moment('DD/MM/YYYY') }}</td>
                                                </tr>
                                            </tbody>
                                        </template>
                                    </v-simple-table>
                                </v-card-text>

                                        <v-card-title>DETALLE EXAMENES REALIZADOS</v-card-title>
                                <v-card-text>
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
                                                    Realizado
                                                </th>
                                                <th class="text-left">
                                                    Fecha
                                                </th>
                                                <th class="text-left">
                                                    Ver resultado
                                                </th>
                                            
                                                </tr>
                                            </thead>
                                            <tbody>
                                                <tr
                                                v-for="ex in item.consulta.examenes"
                                                :key="ex.id"
                                                >
                                                <td>{{ ex.examene.nombre }}</td>
                                                <td>{{ ex.indicaciones }}</td>
                                                <td>{{ ex.realizado == 1 ? 'SI' : 'NO' }}</td>
                                                <td>{{ ex.created_at | moment('DD/MM/YYYY') }}</td>
                                                 <td>
                                                    <v-icon @click="downloadResultado(ex.resultado)" color="red" v-if="ex.resultado !== null">mdi-file-download-outline</v-icon>
                                                </td>
                                                </tr>
                                                
                                            </tbody>
                                        </template>
                                    </v-simple-table>
                                </v-card-text>
                            </v-container>
                            </td>
                            </template>
                </v-data-table>
              </v-expansion-panel-content>
            </v-expansion-panel>

          </v-expansion-panels>
        <v-overlay :value="loading">
            <v-progress-circular
            indeterminate
            size="64"
            >Cargando...</v-progress-circular>
        </v-overlay>
     </v-container>
        
    </template>
    
  </div>
</template>

<script>
import moment from 'moment'
  export default {
    name: 'Indexmedico',

    data: () => ({
        loading: false,
        estado: 'F',
        singleExpand: false,
        search: '',
        tabs: null,
        paciente: null,
        prevRoute: null,
        items: [],
        breadCrub: [
            {
                text: 'Pacientes',
                disabled: false,
                href: '#/pacientes',
            },
            {
            text: 'Historial medico',
                disabled: true,
                href: '#',
            },
        ],
        parentescos: [
          {text: 'Hijo(a)',value: 'H'},
          {text: 'Primo(a)',value: 'P'},
          {text: 'Sobrino(a)',value: 'S'},
          {text: 'Amigo(a)',value: 'A'},
          {text: 'Conyuge',value: 'C'}
        ],

        headers: [
            { text: 'Especialidad', value: 'especialidade.nombre' },
            { text: 'Enfermero', value: 'enfermero' },
            { text: 'Motivo de visita', value: 'motivo' },
            { text: 'Fecha de programada', value: 'fecha_visita' },
            { text: 'Fecha de asignada', value: 'fecha_asignada' },
            { text: 'Médico', value: 'medico' },
            { text: 'Estado', value: 'estado' },
            { text: 'Acciones', value: 'actions', sortable: false },
        ],
    }),

    computed: {
      formTitle () {
        return this.editedIndex === -1 ? 'Nuevo registro' : 'Editar registro'
      },
    },

    watch: {
    },

    created(){
        let self = this;
        self.get(self.$route.params.id);
    },

    beforeRouteEnter(to, from, next) {
        next(vm => {
            vm.breadCrub[0] = {
                text: from.path.replace('/',''),
                disabled: false,
                href: '#'+from.path,
            }
        })
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
          return ['SALDADA','purple']
        }
        return ['SOLICITADO','blue']
      },

        //filtrar registros por estado
        changeStatus(estado){
            let self = this;
            self.estado = estado;
            if(estado == 'F'){
              self.items =  self.paciente.solicitudes.filter(x=>x.estado == 'F' || x.estado == 'C')
            }else{
                self.items = self.paciente.solicitudes.filter(x=>x.estado == estado);
            }
        },
      
      getName(item){
        let self = this
        return self.$store.state.global.getFullName(item)
      },
    //obtener historial
      get(id) {
        let self = this;
        self.loading = true;
        self.$store.state.services.pacienteService
          .getHistorial(id)
          .then(r => {
            self.loading = false;
            self.paciente = r.data;
            self.items = r.data.solicitudes.filter(x=>x.estado == 'F' || x.estado == 'C')
            console.log(self.items)
          })
          .catch(r => {
          });
      },

        downloadResultado(res){
            let self = this
            let uri = self.$store.state.base_url+'resultados/'+res
            window.open(uri)
        }
    }
  }
</script>
