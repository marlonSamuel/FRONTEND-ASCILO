<template>
<div>
  <v-tabs centered icons-and-text>
        <v-tab @click="changeStatus(0)"> Pagos pendientes <v-icon>mdi-account-clock</v-icon></v-tab>
       <v-tab @click="changeStatus(1)"> Pagos realizados <v-icon> mdi-cash-multiple</v-icon></v-tab>
  </v-tabs>
  <v-data-table
    :headers="headers"
    :items="itemsStatus"
    sort-by="calories"
    class="elevation-1"
    :search="search"
    :single-expand="true"
    show-expand
  >
    <template v-slot:item.full_name="{ item }">
        {{ getItemFullName(item.consulta_medica.solicitude.paciente) }}
    </template>

    <template v-slot:item.consulta="{ item }">
        {{ item.consulta | currency('Q ') }}
    </template>

    <template v-slot:item.medicamentos="{ item }">
        {{ item.medicamentos | currency('Q ') }}
    </template>

    <template v-slot:item.examenes="{ item }">
        {{ item.examenes | currency('Q ') }}
    </template>

    <template v-slot:item.pagado="{ item }">
      <v-chip
        small
        :color="item.pagado == 1 ? 'green':'red'"
        dark
      >
        {{ item.pagado == 1 ? 'PAGADO' : 'PENDIENTE' }}
      </v-chip>
    </template>

    <template v-slot:item.fecha_asignada="{ item }">
        <span v-if="item.consulta != null">
            {{item.consulta_medica.fecha_asignada | moment('DD-MM-YYYY')}} de {{item.consulta_medica.fecha_asignada | moment('h:mm a')}} - {{item.consulta_medica.fecha_asignada_fin | moment('h:mm a')}}
        </span>
    </template>

        <template v-slot:expanded-item="{ headers, item }">
      <td :colspan="headers.length">
            <v-container>
        <v-card-title>DETALLE MEDICAMENTOS</v-card-title> <br />
        <h4>Total: {{item.medicamentos | currency('Q ')}}</h4>
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
                        v-for="item in item.consulta_medica.medicamentos"
                        :key="item.id"
                        >
                        <td>{{ item.medicamento.nombre }}</td>
                        <td>{{ item.cantidad }}</td>
                        <td>{{ item.tiempo_aplicacion }}</td>
                        <td>{{ item.indicaciones }}</td>
                        <td>{{ item.entregado ? 'SI' : 'NO' }}</td>
                        <td>{{ item.precio | currency('Q ') }}</td>
                        </tr>
                    </tbody>
                </template>
            </v-simple-table>
        </v-card-text>

                <v-card-title>DETALLE EXAMENES REALIZADOS</v-card-title><br />
        <h4>Total: {{item.examenes | currency('Q ')}}</h4>
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
                            Precio
                        </th>
                       
                        </tr>
                    </thead>
                    <tbody>
                        <tr
                        v-for="ex in item.consulta_medica.examenes"
                        :key="ex.id"
                        >
                        <td>{{ ex.examene.nombre }}</td>
                        <td>{{ ex.indicaciones }}</td>
                        <td>{{ ex.realizado ? 'SI' : 'NO' }}</td>
                        <td>{{ ex.precio | currency('Q ') }}</td>
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
        <v-toolbar-title>PAGOS FUNDACOIN</v-toolbar-title>
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
        <v-dialog v-model="dialog" max-width="500px">
          <v-card>
            <v-card-title class="text-h5">Esta seguro de pagar esta cuenta?</v-card-title>
            <v-card-actions>
              <v-spacer></v-spacer>
              <v-btn color="error" text @click="close">cancelar</v-btn>
              <v-btn color="blue darken-1" text @click="confirm">Confirmar</v-btn>
              <v-spacer></v-spacer>
            </v-card-actions>
          </v-card>
        </v-dialog>
      </v-toolbar>
    </template>
    <template v-slot:item.actions="{ item }">

    <v-tooltip top v-if="item.pagado == 0">
      <template v-slot:activator="{ on, attrs }">
          <v-icon
          color="primary"
          v-on="on"
          v-bind="attrs"
          small
          @click="editItem(item)"
        >
          mdi-check
        </v-icon>
      </template>
      <span>Pagar cuenta</span>
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
    name: 'IndexpagoFundacion',

    data: () => ({
        loading: false,
        search: '',
        dialog: false,
        dialogDelete: false,
        valid: true,
        status: 0,
        headers: [
          {text: 'CUI', value: 'consulta_medica.solicitude.paciente.cui'},
          { text: 'Nombre completo', value: 'full_name' },
          { text: 'Fecha consulta', value: 'fecha_asignada' },
          { text: 'Total Consulta', value: 'consulta' },
          { text: 'Total Medicamentos', value: 'medicamentos' },
          { text: 'Total examenes', value: 'examenes' },
          { text: 'Total', value: 'total' },
          { text: 'Estado', value: 'pagado' },
          { text: 'Acciones', value: 'actions', sortable: false },
        ],
        items: [],
        itemsStatus: [],
        editedIndex: -1,
        editedItem: {
            id: 0,
        },
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
      //obtener por estado
      changeStatus(pagado){
        let self = this;
        self.status = pagado;
        self.itemsStatus = self.items.filter(x=>x.pagado==pagado);
      },

      //funciones para concatenar nombres
      getItemFullName(item) {
          return this.$store.state.global.getFullName(item);
      },
    //listar todos los registrros
      getAll() {
        let self = this;
        self.loading = true;
        self.$store.state.services.pagoFundacionService
          .getAll()
          .then(r => {
            self.loading = false;
            self.items = r.data;
            self.itemsStatus = r.data.filter(x=>x.pagado == 0);
          })
          .catch(r => {
          });
      },
//actualizar registro
      update(){
          let self = this;
          let data = self.editedItem
          self.loading = true;
          self.$store.state.services.pagoFundacionService
          .update(data)
          .then(r=>{
            self.loading = false;
              if(r.response !== undefined){
                self.$store.state.global.captureError(r, 'error')
                return
              }      
              self.$toastr.success('pagoFundacion actualizada con éxito', 'Mensaje');      
              self.getAll()
          })
          .catch(e=>{

          })
      },

    editItem (item) {
        this.editedItem.id = item.id;
        this.dialog = true;
    },

    confirm () {
        let self = this
        self.update()
        this.close()
    },

    close () {
        this.dialog = false
    }
  }
}
</script>
