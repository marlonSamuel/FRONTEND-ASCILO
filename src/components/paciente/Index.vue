<template>
<div>
  <v-data-table
    :headers="headers"
    :items="items"
    sort-by="calories"
    class="elevation-1"
    :single-expand="singleExpand"
    show-expand
    :search = "search"
  >
    <template v-slot:item.full_name="{ item }">
        {{ item.primer_nombre+' '+(item.segundo_nombre != null ? item.segundo_nombre : '')+' '+item.primer_apellido + ' '+(item.segundo_apellido != null ? item.segundo_apellido : '') }}
    </template>
    <template v-slot:item.fecha_nacimiento="{ item }">
        {{ item.fecha_nacimiento | moment("DD-MM-YYYY") }}
    </template>

    <template v-slot:expanded-item="{ headers, item }">
      <td :colspan="headers.length">
          <v-expansion-panels focusable style="padding: 15px;">
            <v-expansion-panel>
              <v-expansion-panel-header>Información del paciente</v-expansion-panel-header>
              <v-expansion-panel-content>
                <v-row style="padding: 10px;">
                  <v-col
                    sm="4"
                    md="4"
                    xs="12"
                  >
                    <p><b>Cui:</b>  {{item.cui}}</p>
                    <p><b>Nombre completo:</b>  {{getName(item)}}</p>
                    <p><b>Fecha nacimiento:</b>  {{item.fecha_nacimiento | moment("DD-MM-YYYY")}}</p>
                  </v-col>
                   <v-col
                    sm="4"
                    md="4"
                    xs="12"
                  >
                    <p><b>Género:</b>  {{item.genero == 'M' ? 'Masculino': 'Femenino'}}</p>
                    <p><b>Edad:</b>  {{item.fecha_nacimiento |moment("from", "now",true)}}</p>
                    <p><b>Dirección:</b>  {{item.direccion}}</p>
                    
                  </v-col>
                  <v-col
                    sm="4"
                    md="4"
                    xs="12"
                  >
                    <p><b>Psicopatología:</b>  {{item.psicopatologia.nombre}}</p>
                    <p><b>Razón por internrarlo(a):</b>  {{item.razon}}</p>
                    <p><b>Alergias:</b>  {{item.alergias}}</p>
                    <p><b>Medicamentos administrados:</b>  {{item.medicamentos.map((x) => x.medicamento.nombre).join(', ')}}</p>
                  </v-col>
                </v-row>
              
              </v-expansion-panel-content>
            </v-expansion-panel>

            <v-expansion-panel>
              <v-expansion-panel-header>Información del responsable</v-expansion-panel-header>
              <v-expansion-panel-content>
                 <v-row style="padding: 10px;">
                  <v-col
                    sm="4"
                    md="4"
                    xs="12"
                  >
                    <p><b>Cui:</b>  {{item.cui_responsable}}</p>
                    <p><b>Nombre completo:</b>  {{item.primer_nombre_responsable}} {{item.segundo_nombre_responsable}} {{item.primer_apellido_responsable}} {{item.primer_apellido_responsable}}</p>
                    <p><b>Parentesco:</b>  {{parentescos.find(x=>x.value == item.parentesco).text}}</p>
                    <p><b>Fecha nacimiento:</b>  {{item.fecha_nacimiento_responsable | moment("DD-MM-YYYY")}}</p>
                  </v-col>
                   <v-col
                    sm="4"
                    md="4"
                    xs="12"
                  >
                    <p><b>Celular:</b>  {{item.celular}}</p>
                    <p><b>Télefono (casa):</b>  {{item.telefono}}</p>
                    <p><b>Dirección:</b>  {{item.direccion_responsable}}</p>
                    <p><b>Correo electronico:</b>  {{item.email}}</p>
                  </v-col>
                </v-row>
              </v-expansion-panel-content>
            </v-expansion-panel>

          </v-expansion-panels>
      </td>
    </template>

    <template v-slot:top>
      <v-toolbar
        flat
      >
        <v-toolbar-title>PACIENTES</v-toolbar-title>
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
          max-width="70%"
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
               <h2>Información del paciente</h2>
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
                  
                      <v-text-field
                        v-model="editedItem.cui"
                        label="CUI"
                        :rules="cuiRules"
                        required
                      ></v-text-field>
                    </v-col>
                    <v-col
                        cols="12"
                        sm="4"
                        md="4"
                        xs="12"
                      >
                  
                      <v-text-field
                        v-model="editedItem.primer_nombre"
                        label="Primer nombre"
                        counter="25"
                        :rules="primernRules"
                        required
                      ></v-text-field>
                    </v-col>

                     <v-col
                      cols="12"
                      sm="4"
                      md="4"
                      xs="12"
                    >
                      <v-text-field
                        v-model="editedItem.segundo_nombre"
                        label="Segundo nombre"
                        counter="25"
                      ></v-text-field>
                    </v-col>
                  </v-row>

                    <v-row>
                   
                    <v-col
                        cols="12"
                        sm="4"
                        md="4"
                        xs="12"
                      >
                  
                      <v-text-field
                        v-model="editedItem.tercer_nombre"
                        label="Tercer nombre"
                        counter="25"
                        required
                      ></v-text-field>
                    </v-col>

                    <v-col
                        cols="12"
                        sm="4"
                        md="4"
                        xs="12"
                      >
                  
                      <v-text-field
                        v-model="editedItem.primer_apellido"
                        label="Primer apellido"
                        counter="25"
                        :rules="primernRules"
                        required
                      ></v-text-field>

                      </v-col>

                    <v-col
                      cols="12"
                      sm="4"
                      md="4"
                      xs="12"
                    >
                      <v-text-field
                        v-model="editedItem.segundo_apellido"
                        label="Segundo apellido"
                        counter="25"
                      ></v-text-field>
                    </v-col>

                  </v-row>

                   <v-row>

                   <v-col
                      cols="12"
                      sm="4"
                      md="4"
                      xs="12"
                    >
                      <v-autocomplete 
                        v-model="editedItem.genero"
                        :items="generos"
                        item-text="text"
                        item-value="value"
                        :rules="generoRules"
                        label="Género"
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
                        v-model="editedItem.fecha_nacimiento"
                        label="Fecha nacimiento"
                        :rules="dateRules"
                        type='date'
                        required
                      ></v-text-field>
                    </v-col>

                    
                  <v-col
                      cols="12"
                      sm="4"
                      md="4"
                      xs="12"
                    >
                      <v-autocomplete 
                        v-model="editedItem.psicopatologia_id"
                        :items="psicopatologias"
                        item-text="nombre"
                        item-value="id"
                        :rules="psicopatologiaRules"
                        label="psicopatologia"
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
                      rows="2"
                      v-model="editedItem.direccion"
                      label="Dirección"
                      :counter="150"
                      :rules="dirRules"
                      required
                    ></v-textarea>
                    </v-col>
                  </v-row>
                   

                </v-form>

                 <h2>Información del responsable</h2>

                  <v-row>
                    <v-col
                        cols="12"
                        sm="4"
                        md="4"
                        xs="12"
                      >
                  
                      <v-text-field
                        v-model="editedItem.cui_responsable"
                        label="CUI"
                        :rules="cuiRules"
                        required
                      ></v-text-field>
                    </v-col>
                    <v-col
                        cols="12"
                        sm="4"
                        md="4"
                        xs="12"
                      >
                  
                      <v-text-field
                        v-model="editedItem.primer_nombre_responsable"
                        label="Primer nombre"
                        counter="25"
                        :rules="primernRules"
                        required
                      ></v-text-field>
                    </v-col>

                    <v-col
                      cols="12"
                      sm="4"
                      md="4"
                      xs="12"
                    >
                      <v-text-field
                        v-model="editedItem.segundo_nombre_responsable"
                        label="Segundo nombre"
                        counter="25"
                      ></v-text-field>
                    </v-col>

                  </v-row>

                   <v-row>
                    <v-col
                        cols="12"
                        sm="4"
                        md="4"
                        xs="12"
                      >
                  
                      <v-text-field
                        v-model="editedItem.primer_apellido_responsable"
                        label="Primer apellido"
                        counter="25"
                        :rules="primernRules"
                        required
                      ></v-text-field>
                    </v-col>

                    <v-col
                      cols="12"
                      sm="4"
                      md="4"
                      xs="12"
                    >
                      <v-text-field
                        v-model="editedItem.segundo_apellido_responsable"
                        label="Segundo apellido"
                        counter="25"
                      ></v-text-field>
                    </v-col>

                    <v-col
                        cols="12"
                        sm="4"
                        md="4"
                        xs="12"
                      >
                  
                      <v-text-field
                        v-model="editedItem.celular"
                        label="Celular"
                        :rules="telefonoRules"
                        counter="8"
                        required
                      ></v-text-field>
                    </v-col>

                  </v-row>

                   <v-row>

                    <v-col
                        cols="12"
                        sm="4"
                        md="4"
                        xs="12"
                      >
                  
                      <v-text-field
                        v-model="editedItem.telefono"
                        label="Télefono (casa)"
                        counter="8"
                        required
                      ></v-text-field>
                    </v-col>

                    <v-col
                      cols="12"
                      sm="4"
                      md="4"
                      xs="12"
                    >
                      <v-text-field
                        v-model="editedItem.email"
                        label="Email"
                        :rules="emailRules"
                        type='email'
                        required
                      ></v-text-field>
                    </v-col>
                  </v-row>

                <v-row>
                  <v-col
                      cols="12"
                      sm="4"
                      md="4"
                      xs="12"
                    >
                      <v-autocomplete 
                        v-model="editedItem.parentesco"
                        :items="parentescos"
                        item-text="text"
                        item-value="value"
                        :rules="parentescoRules"
                        label="Parentesco"
                        required
                      ></v-autocomplete>
                    </v-col>

                    <v-col
                      cols="12"
                      sm="12"
                      md="12"
                      xs="12"
                    >
                      <v-textarea
                      rows="2"
                      v-model="editedItem.direccion_responsable"
                      label="Dirección"
                      :counter="250"
                      :rules="dirRules"
                      required
                    ></v-textarea>
                    </v-col>

                    
                  </v-row>

                    

                    <h2>Otra información</h2>

                    <v-col
                      cols="12"
                      sm="6"
                      md="6"
                      xs="12"
                    >
                      <v-text-field
                        v-model="editedItem.fecha_ingreso"
                        label="Fecha ingreso"
                        :rules="dateRules"
                        type='date'
                        required
                      ></v-text-field>
                    </v-col>

                      <v-autocomplete
                        v-model="editedItem.medicamentos"
                        :items="medicamentos"
                        item-text="nombre"
                        item-value="id"
                        chips
                        small-chips
                        label="Medicamentos administrados"
                        multiple
                      ></v-autocomplete>

                      

                    <v-col
                      cols="12"
                      sm="4"
                      md="4"
                      xs="12"
                    >
                      <v-text-field
                        v-model="editedItem.fecha_ingreso"
                        label="Fecha ingreso"
                        :rules="dateRules"
                        type='date'
                        required
                      ></v-text-field>
                      
                    </v-col>

                    <v-textarea
                      rows="2"
                      v-model="editedItem.razon"
                      label="Razón para internarlo(a)"
                      :counter="250"
                      :rules="razonRules"
                      required
                    ></v-textarea>

                    <v-textarea
                      rows="2"
                      v-model="editedItem.alergias"
                      label="Alergias"
                      :counter="100"
                      required
                    ></v-textarea>

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
            @click="$router.push('/pacientes-historial/'+item.id)"
          >
            mdi-eye
          </v-icon>
      </template>
      <span>Ver historial medico</span>
    </v-tooltip>
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
import moment from 'moment'
  export default {
    name: 'Indexmedico',

    data: () => ({
        loading: false,
        singleExpand: true,
        search: '',
        dialog: false,
        dialogDelete: false,
        valid: true,
        cuiRules: [
            v => !!v || 'CUI es requerido',
            v => !(v && isNaN(v)) || 'Debe ser un valor numerico',
            v => (v && v.length >= 13 && v.length <= 15) || 'El cui debe estar entre 13 y 15 digitos',
        ],
        primernRules: [
            v => !!v || 'Este campo es requerido',
            v => (v && v.length <= 25) || 'Debe ingresar menos de 10 caracteres',
        ],
        telefonoRules: [
            v => !!v || 'Télefono es requerido',
            v => !(v && isNaN(v)) || 'Debe ser un valor numerico',
            v => (v && v.length >= 8 && v.length <= 8) || 'El número de télefono debe contener 8 digitos'
        ],
        dateRules: [
            v => !!v || 'La fecha de nacimiento es requerida'
        ],
        dirRules: [
            v => !!v || 'La dirección es requerida',
            v => (v && v.length <= 150) || 'Debe ingresar menos de 250 caracteres',
        ],
        psicopatologiaRules: [
            v => !!v || 'La psicopatologia es requerida'
        ],
        emailRules: [
            v => !!v || 'El correo es requerido',
            v => /.+@.+\..+/.test(v) || "Debe ser un correo valido"
        ],
        razonRules: [
            v => !!v || 'La razón para internarlo(a) es requerida',
            v => (v && v.length <= 250) || 'Debe ingresar menos de 250 caracteres',
        ],
        parentescoRules: [
            v => !!v || 'El parentesco es requerida',
        ],
        generoRules: [
            v => !!v || 'El géneror es requerido',
        ],
        

        headers: [
          {text: 'CUI',value: 'cui'},
          { text: 'Nombre completo', value: 'full_name' },
          { text: 'psicopatologia', value: 'psicopatologia.nombre' },
          { text: 'Fecha de nacimiento', value: 'fecha_nacimiento' },
          { text: 'Celular', value: 'celular' },
          { text: 'Correo electronico', value: 'email' },
          { text: 'Dirección', value: 'direccion' },
          { text: 'Acciones', value: 'actions', sortable: false },
        ],
        items: [],
        psicopatologias: [],
        medicamentos: [],
        parentescos: [
          {text: 'Hijo(a)',value: 'H'},
          {text: 'Primo(a)',value: 'P'},
          {text: 'Sobrino(a)',value: 'S'},
          {text: 'Amigo(a)',value: 'A'},
          {text: 'Conyuge',value: 'C'}
        ],
        generos: [
          {text: 'Masculino',value: 'M'},
          {text: 'Femenino',value: 'F'}
        ],
        editedIndex: -1,
        editedItem: {
            id: 0,
            psicopatologia_id: null,
            cui: '',
            primer_nombre: '',
            segundo_nombre: '',
            tercer_nombre: '',
            primer_apellido: '',
            segundo_apellido: '',
            telefono: '',
            direccion: '',
            email: '',
            fecha_nacimiento: '',
            parentesco: '',
            primer_nombre_responsable: '',
            segundo_nombre_responsable: '',
            primer_apellido_responsable: '',
            segundo_apellido_responsable: '',
            cui_responsable: '',
            fecha_ingreso: '',
            razon: '',
            alergias: '',
            direccion_responsable: '',
            celular: '',
            genero: '',
            medicamentos: []
        },
        defaultItem: {
            id: 0,
            psicopatologia_id: null,
            cui: '',
            primer_nombre: '',
            segundo_nombre: '',
            tercer_nombre: '',
            primer_apellido: '',
            segundo_apellido: '',
            telefono: '',
            direccion: '',
            email: '',
            fecha_nacimiento: '',
            parentesco: '',
            primer_nombre_responsable: '',
            segundo_nombre_responsable: '',
            primer_apellido_responsable: '',
            segundo_apellido_responsable: '',
            cui_responsable: '',
            fecha_ingreso: '',
            razon: '',
            alergias: '',
            direccion_responsable: '',
            celular: '',
            genero: '',
            medicamentos: []
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
        self.getMedicamentos()
        self.getpsicopatologias()
        self.getAll()
    },

    methods: {
      
      getName(item){
        let self = this
        return self.$store.state.global.getFullName(item)
      },
      //listar todos los registrros de especilaidades
      getpsicopatologias() {
        let self = this;
        self.loading = true;
        self.$store.state.services.psicopatologiaService
          .getAll()
          .then(r => {
            self.loading = false;
            self.psicopatologias = r.data;
          })
          .catch(r => {
          });
      },

      //listar todos medicamentos
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
      getAll() {
        let self = this;
        self.loading = true;
        self.$store.state.services.pacienteService
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
        self.$store.state.services.pacienteService
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
          self.$store.state.services.pacienteService
          .create(data)
          .then(r=>{
            self.loading = false;
              if(r.response !== undefined){
                self.$store.state.global.captureError(r, 'error')
                return
              }
              self.$toastr.success('medico creada con éxito', 'Mensaje');
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
          self.$store.state.services.pacienteService
          .update(data)
          .then(r=>{
            self.loading = false;
              if(r.response !== undefined){
                self.$store.state.global.captureError(r, 'error')
                return
              }      
              self.$toastr.success('medico actualizada con éxito', 'Mensaje');      
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
          self.$store.state.services.pacienteService
          .remove(data.id)
          .then(r=>{
            self.loading = false;
              if(r.response !== undefined){
                self.$store.state.global.captureError(r, 'error')
                return
              }
              self.$toastr.success('medico eliminada con éxito', 'Mensaje');
              self.getAll()
          })
          .catch(e=>{

          })
      },

    editItem (item) {
        this.editedIndex = this.items.indexOf(item)
        item.psicopatologia_id = item.psicopatologia.id
        this.editedItem = Object.assign({}, item)
        this.editedItem.medicamentos = []
        item.medicamentos.forEach((item,i)=>{
          this.editedItem.medicamentos.push(parseInt(item.medicamento_id))
        });
        console.log(this.editedItem)
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
