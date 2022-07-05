
 <template>
 <div>
  <v-navigation-drawer app v-model="drawer" :maxwidth="500">
      <v-list-item>
        <v-list-item-content>
        <v-list-item-subtitle>
            <v-avatar
          class="mr-10"
          color="grey darken-1"
          size="70"
        ><img src="../../assets/logo.jpg" alt="avatar"></v-avatar>
          </v-list-item-subtitle>
          <v-list-item-title class="text-h6"> SICOE
          </v-list-item-title>
          
        </v-list-item-content>
      </v-list-item>

      <v-divider></v-divider>

    <!--  <v-list
        dense
        nav
      >
        <v-list-item
          v-for="item in items"
          :key="item.title"
          link
          :to="item.path"
        >
          <v-list-item-icon>
            <v-icon>{{ item.icon }}</v-icon>
          </v-list-item-icon>

          <v-list-item-content>
            <v-list-item-title>{{ item.title }}</v-list-item-title>
          </v-list-item-content>
        </v-list-item>
      </v-list>-->

      <v-list>
        <v-list-item to="/">
          <v-list-item-icon>
            <v-icon>mdi-home</v-icon>
          </v-list-item-icon>

          <v-list-item-title>Home</v-list-item-title>
        </v-list-item>

        <v-list-group
          v-for="item in items"
          :key="item.title"
          :prepend-icon="item.icon"
          no-action
          v-show="item.rol.includes(rol)"
        >
          
          <template v-slot:activator>
            <v-list-item-content>
              <v-list-item-title v-text="item.title"></v-list-item-title>
            </v-list-item-content>
          </template>

          <v-list-item
            v-for="child in item.items"
            :key="child.title"
            :to="child.path"
            v-show="child.rol.includes(rol)"
          >
            <v-list-item-content>
              <v-list-item-title  v-text="child.title"></v-list-item-title>
            </v-list-item-content>
          </v-list-item>
        </v-list-group>
        <v-list-item to="/reportes" v-show="['admin','secretaria_ascilo'].includes(rol)">
          <v-list-item-icon>
            <v-icon>mdi-file-chart</v-icon>
          </v-list-item-icon>

          <v-list-item-title>Reportes</v-list-item-title>
        </v-list-item>
        <v-list-item to="/ayuda">
          <v-list-item-icon>
            <v-icon>mdi-help</v-icon>
          </v-list-item-icon>

          <v-list-item-title>Ayuda</v-list-item-title>
        </v-list-item>
      </v-list>

    </v-navigation-drawer>

      <v-app-bar app color="purple darken-2">
      <v-app-bar-nav-icon class="white--text" @click="drawer = !drawer"></v-app-bar-nav-icon>

        <v-toolbar-title class="white--text">ASILO DE ANCIANOS NUEVA VIDA</v-toolbar-title>

        <v-spacer></v-spacer>

        <v-btn icon>
          <v-menu
              open-on-hover
              offset-x
            >
              <template v-slot:activator="{ on, attrs }">
                  
                    <v-icon v-bind="attrs"
                  v-on="on" class="white--text">mdi-dots-vertical</v-icon>
              </template>

              <v-card>
                <v-list>
                  <v-list-item>
                    <v-list-item-avatar>
                      <v-icon large>mdi-account-circle</v-icon>
                    </v-list-item-avatar>

                    <v-list-item-content>
                      <v-list-item-title>{{userName}}</v-list-item-title>
                      <v-list-item-subtitle>{{name}}</v-list-item-subtitle>
                    </v-list-item-content>
                  </v-list-item>
                </v-list>

                <v-divider></v-divider>

                <v-card-actions>
                  <v-spacer></v-spacer>

                  <v-btn
                    text
                    color="primary"
                    @click="$router.push('/change-password')"
                  >
                    Cambiar contraseña
                  </v-btn>
                  <v-btn
                    color="primary"
                    text
                    @click="logout"
                  >
                    Salir
                  </v-btn>
                </v-card-actions>
              </v-card>
            </v-menu>
        </v-btn>
  </v-app-bar>

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
  name: 'navigation-menu',

  components: {

  },

  data: () => ({
    loading: false,
    drawer: null,
    items: [
        {
          icon: 'mdi-account-network',
          title: 'Ascilo',
          active: true,
          rol: ['admin','secretaria_ascilo'],
          items: [{ title: 'Psicopatologias', path:'/psicopatologias', rol: ['admin','secretaria_ascilo'] },
                  { title: 'Enfermeros', path:'/enfermeros', rol: ['admin','secretaria_ascilo'] },
                  { title: 'Pacientes', path:'/pacientes', rol: ['admin','secretaria_ascilo'] },
                  { title: 'Solicitudes medicas', path:'/solicitudes', rol: ['admin','secretaria_ascilo'] },
                  ]
          
        },
        {
          icon: 'mdi-bottle-tonic-plus',
          title: 'Hospital',
          active: true,
          rol: ['admin','secretaria_fundacion','medico'],
          items: [{ title: 'Especialidades', path: '/especialidades',rol: ['admin','secretaria_fundacion'] },
                  { title: 'Médicos', path:'/medicos',rol: ['admin','secretaria_fundacion'] },
                  { title: 'Solicitudes medicas', path:'/hospital-solicitudes',rol: ['admin','secretaria_fundacion'] },
                  { title: 'Mis consultas', path:'/mis-consultas',rol: ['admin','medico'] }]
          
        },
        
        {
          icon: 'mdi-bottle-tonic-plus',
          title: 'Farmacia',
          rol: ['admin','farmacia'],
          active: true,
          items: [{ title: 'Medicamentos', path:'/medicamentos', rol: ['admin','farmacia'] },
                  { title: 'Ventas', path:'/entregar-medicamento', rol: ['admin','farmacia'] }]
          
        },
        {
          icon: 'mdi-file-plus',
          title: 'Laboratorio',
          rol: ['admin','laboratorio'],
          active: true,
          items: [{ title: 'Examenes', path:'/examenes',rol: ['admin','laboratorio'] },
                  { title: 'Resultados ', path:'/resultado-examenes',rol: ['admin','laboratorio'] }]
          
        },
        {
          icon: 'mdi-cash-check ',
          title: 'Caja',
          active: true,
          rol: ['admin','caja'],
          items: [
                  { title: 'Conceptos de pago', path: '/conceptos',rol: ['admin','caja'] },
                  { title: 'Ingresos/Gastos', path:'/ingresos-gastos',rol: ['admin','caja'] },
                  { title: 'Pagos fundación', path:'/pagos-fundacion',rol: ['admin','caja'] },
                  { title: 'Pagos mensuales', path:'/pagos',rol: ['admin','caja'] }]
          
        },

        {
          icon: 'mdi-account-multiple-plus ',
          title: 'Accesos',
          active: true,
          rol: ['admin'],
          items: [
                  { title: 'Usuarios', path: '/users', rol: ['admin'] }
          ]
        }
      ],

        right: null,
  }),

  created(){
    
  },

  methods: {
      logout(){
        let self = this
        self.loading = true
        self.$store.state.services.loginService
          .logout()
          .then(r => {
            self.$store.dispatch("logout")
            self.$router.push('/login')
            self.loading = false
          }).catch(e => {

        })
      }
    },

  computed: {
    userName(){
      let self = this
      return self.$store.state.usuario.username
    },
    name(){
      let self = this
      return self.$store.state.usuario.nombres + ' '+self.$store.state.usuario.apellidos
    },

    rol(){
      let self = this
      return self.$store.state.rol;
    },
  }
};
</script>