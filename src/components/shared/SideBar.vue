
 <template>
    
  <v-app-bar app color="purple darken-2">
    <v-app-bar-nav-icon class="white--text" @click="drawer = !drawer"></v-app-bar-nav-icon>

      <v-toolbar-title class="white--text">SISTEMA DE CONTROL DE ASCILO</v-toolbar-title>
  </v-app-bar>
</template>
<script>
export default {
  name: 'navigation-menu',

  components: {

  },

  data: () => ({
    drawer: null
  }),

  created(){
    
  },
};
</script>