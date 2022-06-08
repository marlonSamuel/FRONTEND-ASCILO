<template>
  <v-data-table
    :headers="headers"
    :items="items"
    sort-by="calories"
    class="elevation-1"
  >
    <template v-slot:top>
      <v-toolbar
        flat
      >
        <v-toolbar-title>PERSONAS</v-toolbar-title>
        <v-divider
          class="mx-4"
          inset
          vertical
        ></v-divider>
        <v-spacer></v-spacer>
        <v-dialog
          v-model="dialog"
          max-width="500px"
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
                <v-row>
                <v-form
                    ref="form"
                    v-model="valid"
                    lazy-validation
                >
                  <v-col
                    cols="12"
                    sm="12"
                    md="12"
                  >
                    <v-text-field
                      v-model="editedItem.nombre"
                      label="Nombre"
                      :counter="10"
                      :rules="nameRules"
                      required
                    ></v-text-field>
                  </v-col>
                </v-form>
                </v-row>
              </v-container>
            </v-card-text>

            <v-card-actions>
              <v-spacer></v-spacer>
              <v-btn
                color="blue darken-1"
                text
                @click="close"
              >
                Cancel
              </v-btn>
              <v-btn
                color="blue darken-1"
                text
                @click="save"
              >
                Save
              </v-btn>
            </v-card-actions>
          </v-card>
        </v-dialog>
        <v-dialog v-model="dialogDelete" max-width="500px">
          <v-card>
            <v-card-title class="text-h5">Are you sure you want to delete this item?</v-card-title>
            <v-card-actions>
              <v-spacer></v-spacer>
              <v-btn color="blue darken-1" text @click="closeDelete">Cancel</v-btn>
              <v-btn color="blue darken-1" text @click="deleteItemConfirm">OK</v-btn>
              <v-spacer></v-spacer>
            </v-card-actions>
          </v-card>
        </v-dialog>
      </v-toolbar>
    </template>
    <template v-slot:item.actions="{ item }">
      <v-icon
        small
        class="mr-2"
        @click="editItem(item)"
      >
        mdi-pencil
      </v-icon>
      <v-icon
        small
        @click="deleteItem(item)"
      >
        mdi-delete
      </v-icon>
    </template>
  </v-data-table>
</template>

<script>
  export default {
    name: 'IndexPeople',

    data: () => ({
        search: '',
        dialog: false,
        dialogDelete: false,
        valid: true,
        nameRules: [
            v => !!v || 'Name is required',
            v => (v && v.length <= 10) || 'Name must be less than 10 characters',
        ],
        headers: [
          { text: 'Identificador', value: 'id' },
          { text: 'Nombre', value: 'nombre' },
          { text: 'Acciones', value: 'actions', sortable: false },
        ],
        items: [],
        editedIndex: -1,
        editedItem: {
            id: 0,
            nombre: ''
        },
        defaultItem: {
            id: 0,
            nombre: ''
        }
    }),

    computed: {
      formTitle () {
        return this.editedIndex === -1 ? 'New Item' : 'Edit Item'
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
      getAll() {
        let self = this;
        self.$store.state.services.peopleService
          .getAll()
          .then(r => {
            self.items = r.data;
            console.log(self.items)
          })
          .catch(r => {
          });
      },

      get(id) {
        let self = this;
        self.$store.state.services.peopleService
          .get(id)
          .then(r => {
            console.log(r.data)
          })
          .catch(r => {
          });
      },

      create(){
          let self = this
          let data = self.editedItem
          self.$store.state.services.peopleService
          .create(data)
          .then(r=>{
              console.log("archivo guardado")
              self.getAll()
          })
          .catch(e=>{

          })
      },

      update(){
          let self = this;
          let data = self.editedItem
          self.$store.state.services.peopleService
          .update(data)
          .then(r=>{
              console.log("archivo actualizado")
              self.getAll()
          })
          .catch(e=>{

          })
      },

      remove(){
          let self = this;
          let data = self.editedItem
          self.$store.state.services.peopleService
          .remove(data.id)
          .then(r=>{
              console.log("archivo eliminado")
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
        //this.items.splice(this.editedIndex, 1)
        let self = this
        self.remove()
        this.closeDelete()
    },

    close () {
        this.dialog = false
        this.$nextTick(() => {
            this.editedItem = Object.assign({}, this.defaultItem)
            this.editedIndex = -1
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
                //Object.assign(this.items[this.editedIndex], this.editedItem)
            } else {
                self.create()
                //this.items.push(this.editedItem)
            }
            this.close()
            }
        }
    }
  }
</script>
