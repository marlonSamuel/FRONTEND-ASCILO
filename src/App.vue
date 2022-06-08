<template>
<v-app>

  <navegationmenu v-if="isLogin"></navegationmenu>

  <!-- Sizes your content based upon application components -->
  <v-main>

    <!-- Provides the application the proper gutter -->
    <v-container fluid>
      <!-- If using vue-router -->
      <router-view></router-view>
    </v-container>
  </v-main>

  <v-footer app>
    <!-- -->
  </v-footer>
</v-app>
</template>

<script>
import navegationmenu from "@/components/shared/NavegationMenu";
import sideBar from "@/components/shared/SideBar";
export default {
  name: 'App',

  components: {
    navegationmenu
  },

  data: () => ({
    drawer: null,
      items: [
          { title: 'Home', icon: 'mdi-view-dashboard', path:'/' },
          { title: 'Personas', icon: 'mdi-checkbox-blank-circle', path:'people' }
        ],
        right: null,
  }),

  created(){
    
  },
  computed: {
    
    isLogin(){
      let self = this
      return self.$store.state.is_login
    },
  }
};
</script>
