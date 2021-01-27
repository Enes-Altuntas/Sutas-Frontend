<template>
  <v-app-bar fixed app clipped-left color="#FFBE0B" light> 
    <v-list-item-avatar>
      <img src="../static/sutas.png">
    </v-list-item-avatar>
    <v-toolbar-title>Sütaş Tedarikçi Portalı</v-toolbar-title>
    <v-spacer></v-spacer>
    <v-menu max-width="1500px" left offset-y content-class="dropdown-menu" transition="slide-y-transition">
      <v-btn text>
        <v-badge color="red" class="mr-3 pl-2">
          <template v-slot:badge>
            <span>{{getBadge.length}}</span>
          </template>
          <v-icon color="black">mail</v-icon>
        </v-badge>
      </v-btn>
      <v-card>
        <v-list>
          <v-list-item v-for="notification in getBadge" :key="notification.id" :to="notification.to">
            <v-list-item-title v-text="notification.message"/>
          </v-list-item>
        </v-list>
      </v-card>
    </v-menu>
    <v-toolbar-items class="hidden-sm-and-down">
      <v-btn
        text
        v-for="button in staticButton"
        :key="button.title"
        :to="button.url"
      >
        <v-icon left>{{button.icon}}</v-icon>
        {{button.title}}
      </v-btn>
      <v-btn text @click="logout">
        <v-icon left>account_circle</v-icon>Çıkış Yap
      </v-btn>
    </v-toolbar-items>
  </v-app-bar>
</template>
<style>
</style>
<script>
import { mapFields, mapMultiRowFields } from "vuex-map-fields";
import { mapActions, mapGetters } from "vuex";

export default {
  data() {
    return {};
  },
  computed: {
    ...mapFields({
      compSideNav: "sideNav",
    }),
    ...mapMultiRowFields({
      staticButton: "staticButton",
    }),
    ...mapGetters({
      getBadge: "getBadge",
    }),
  },
  methods: {
    ...mapActions({
      logout: "logout",
    }),
  },
};
</script>

