<template>
<div>
    <v-toolbar-title> MIS SOLICITUDES ASIGNADAS 
    <v-divider></v-divider><v-divider></v-divider><v-divider></v-divider><v-divider></v-divider>
    Consultas pendientes: <v-icon color="green">mdi-circle-medium</v-icon> {{pendientes}}<br />
    Consultas atendidas: <v-icon color="red">mdi-circle-medium</v-icon>{{atendidas}}
        
    </v-toolbar-title>
    <v-date-picker
      color="purple darken-2"
      v-model="date"
      full-width
      class="mt-4"
      :events="arrayEvents"
      :event-color="getColor"
      @dblclick:date="dblClick"
      locale="es"
    ></v-date-picker>
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
    name: 'ConsultaMedico',

    data: () => ({
        loading: false,
        date: null,
        arrayEvents: [],
        items: [],
        pendientes: 0,
        atendidas: 0
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
    getColor (date) {
        let self = this
        let colors = []
        if(self.items.some(x=>(moment(x.fecha_asignada).format('YYYY-MM-DD') == moment(date).format('YYYY-MM-DD') && x.solicitude.estado == 'P')))colors.push('green')
        if(self.items.some(x=>(moment(x.fecha_asignada).format('YYYY-MM-DD') == moment(date).format('YYYY-MM-DD') && x.solicitude.estado !== 'P')))colors.push('red')

        return colors;
    },
    //arreglo de fechas
    setDates(){
        let self = this
        self.items.forEach(function(item, i) {
            let d = new Date(item.fecha_asignada);
            d = d.toISOString().substr(0, 10);
            self.arrayEvents.push(d)
        });
    },

    dblClick(date){
        let self = this;
        self.$router.push('/atender-consulta/'+date)
    },
    //listar todos los registrros
      getAll() {
        let self = this;
        self.loading = true;
        self.$store.state.services.consultaService
          .getByUser()
          .then(r => {
            self.loading = false;
            self.items = r.data;
            self.pendientes = self.items.filter(x=>x.solicitude.estado == 'P').length;
            self.atendidas = self.items.filter(x=>x.solicitude.estado !== 'P').length;
            self.setDates();
          })
          .catch(r => {
          });
      }
    }
  }
</script>
