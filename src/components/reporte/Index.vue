<template>
<div>
<v-card>
  <v-card-title>
    <v-toolbar-title> <v-icon color="success">mdi-file-excel</v-icon> REPORTES</v-toolbar-title>
  </v-card-title>
    <v-card-text>
          <v-form
      ref="form"
      v-model="valid"
      lazy-validation
    >
      <v-row>
        <v-col
            cols="12"
            sm="4"
            md="4"
            xs="12"
          >
            <v-autocomplete 
              v-model="item.reporte"
              :items="reportes"
              item-text="text"
              item-value="value"
              :rules="reporteRules"
              label="Tipo de reporte"
              required
            ></v-autocomplete>
          </v-col>
          <v-col
            cols="12"
            sm="4"
            md="4"
            xs="12"
          >
            <v-text-field
              v-model="item.from"
              label="Selecciones fecha desde"
              type='date'
            ></v-text-field>
          </v-col>
          <v-col
            cols="12"
            sm="4"
            md="4"
            xs="12"
          >
            <v-text-field
              v-model="item.to"
              label="Selecciones fecha hasta"
              type='date'
            ></v-text-field>
          </v-col>
      </v-row>
      <v-row>
      <v-col>
        <v-btn
          class="mr-4"
          color="success"
          @click="beforeReport"
        >
        <v-icon>mdi-file-excel</v-icon>  Exportar
        </v-btn>
      </v-col>
        
      </v-row>
    </v-form>
    </v-card-text>

</v-card>
    <v-overlay :value="loading">
        <v-progress-circular
          indeterminate
          size="64"
        >Cargando...</v-progress-circular>
    </v-overlay>
  </div>
</template>

<script>
import fileSaver from 'file-saver'
  export default {
    name: 'IndexReportes',

    data: () => ({
        loading: false,
        valid: true,
        reportes: [
          {text: 'Pacientes',value: 'exportPacientes'},
          {text: 'Cobros mensuales',value: 'exportCobros'},
          {text: 'Pagos a fundación',value: 'exportPagosFundacion'},
          {text: 'Examenes medicos realizados',value: 'exportExamenes'},
          {text: 'Medicamentos por consulta',value: 'exportMedicamentos'},
          {text: 'Ingresos / Gastos',value: 'exportIngresosGastos'},
        ],

        reporteRules: [
            v => !!v || 'Reporte es requerio',
        ],
        dateRules: [
            v => !!v || 'La fecha es requerida'
        ],

        item: {
          from: '',
          to: '',
          reporte: ''
        }
    }),

    computed: {
    },

    watch: {
    },

    created(){

    },

    methods: {
      exportPacientes(){
        let self = this
        let data = self.item;
        self.loading = true
        self.$store.state.services.reporteService
            .exportPacientes(data).then(response => {
                self.loading = false
                if(response.response !== undefined){
                  self.$toastr.info("Data vacía, pruebe con otro rango de fechas", 'Advertencia')
                  return
                }
                var file_name = self.item.reporte
                const a = document.createElement('a')
                a.href = URL.createObjectURL(new Blob(
                  [ response.data ],
                  { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' }
                ))
                a.download = file_name
                a.click()
            })
            .catch(e => {
              console.log(e)
            });
        },

        exportCobros(){
          let self = this
          let data = self.item;
          self.loading = true
          self.$store.state.services.reporteService
            .exportCobros(data).then(response => {
                self.loading = false
                if(response.response !== undefined){
                  self.$toastr.info("Data vacía, pruebe con otro rango de fechas", 'Advertencia')
                  return
                }
                var file_name = self.item.reporte
                const a = document.createElement('a')
                a.href = URL.createObjectURL(new Blob(
                  [ response.data ],
                  { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' }
                ))
                a.download = file_name
                a.click()
            })
            .catch(e => {
              console.log(e)
            });
        },

        exportPagosFundacion(){
          let self = this
          let data = self.item;
          self.loading = true
          self.$store.state.services.reporteService
            .exportPagosFundacion(data).then(response => {
                self.loading = false
                if(response.response !== undefined){
                  self.$toastr.info("Data vacía, pruebe con otro rango de fechas", 'Advertencia')
                  return
                }
                var file_name = self.item.reporte
                const a = document.createElement('a')
                a.href = URL.createObjectURL(new Blob(
                  [ response.data ],
                  { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' }
                ))
                a.download = file_name
                a.click()
            })
            .catch(e => {
              console.log(e)
            });
        },

        exportExamenes(){
          let self = this
          let data = self.item;
          self.loading = true
          self.$store.state.services.reporteService
            .exportExamenes(data).then(response => {
                self.loading = false
                if(response.response !== undefined){
                  self.$toastr.info("Data vacía, pruebe con otro rango de fechas", 'Advertencia')
                  return
                }
                var file_name = self.item.reporte
                const a = document.createElement('a')
                a.href = URL.createObjectURL(new Blob(
                  [ response.data ],
                  { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' }
                ))
                a.download = file_name
                a.click()
            })
            .catch(e => {
              console.log(e)
            });
        },

        exportMedicamentos(){
          let self = this
          let data = self.item;
          self.loading = true
          self.$store.state.services.reporteService
            .exportMedicamentos(data).then(response => {
                self.loading = false
                if(response.response !== undefined){
                  self.$toastr.info("Data vacía, pruebe con otro rango de fechas", 'Advertencia')
                  return
                }
                var file_name = self.item.reporte
                const a = document.createElement('a')
                a.href = URL.createObjectURL(new Blob(
                  [ response.data ],
                  { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' }
                ))
                a.download = file_name
                a.click()
            })
            .catch(e => {
              console.log(e)
            });
        },

        exportIngresosGastos(){
          let self = this
          let data = self.item;
          self.loading = true
          self.$store.state.services.reporteService
            .exportIngresosGastos(data).then(response => {
                self.loading = false
                if(response.response !== undefined){
                  self.$toastr.info("Data vacía, pruebe con otro rango de fechas", 'Advertencia')
                  return
                }
                var file_name = self.item.reporte
                const a = document.createElement('a')
                a.href = URL.createObjectURL(new Blob(
                  [ response.data ],
                  { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' }
                ))
                a.download = file_name
                a.click()
            })
            .catch(e => {
              console.log(e)
            });
        },

      beforeReport(){
        let self = this
        if (this.$refs.form.validate()){
            switch(self.item.reporte){
              case 'exportPacientes':
                self.exportPacientes()
              break;
              case 'exportCobros':
                self.exportCobros()
              break;
              case 'exportPagosFundacion':
                self.exportPagosFundacion()
              break;
              case 'exportExamenes':
                self.exportExamenes()
              break;
              case 'exportMedicamentos':
                self.exportMedicamentos()
              break;
              case 'exportIngresosGastos':
                self.exportIngresosGastos()
              break;
            }
        }
      }
    }
  }
</script>
