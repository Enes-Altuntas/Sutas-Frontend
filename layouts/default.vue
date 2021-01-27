<template>
  <v-app>
    <div class="loading-page" v-if="loading">
      <div class="lds-hourglass"></div>
    </div>
    <SideNavBar />  
    <TopNavBar />  
    <v-main>
      <router-view>
        <main>
          <v-main>
            <nuxt />
          </v-main>
        </main>
      </router-view>
    </v-main>
  </v-app>
</template>
<style>
.loading-page {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.8);
  text-align: center;
  padding-top: 25%;
  font-size: 128px;
  font-family: sans-serif;
  z-index: 100;
}
.lds-hourglass {
  display: inline-block;
  position: relative;
  width: 128px;
  height: 128px;
}
.lds-hourglass:after {
  content: " ";
  display: block;
  border-radius: 50%;
  width: 0;
  height: 0;
  margin: 6px;
  box-sizing: border-box;
  border: 26px solid #fff;
  border-color: #fff transparent #fff transparent;
  animation: lds-hourglass 1.2s infinite;
}
@keyframes lds-hourglass {
  0% {
    transform: rotate(0);
    animation-timing-function: cubic-bezier(0.55, 0.055, 0.675, 0.19);
  }
  50% {
    transform: rotate(900deg);
    animation-timing-function: cubic-bezier(0.215, 0.61, 0.355, 1);
  }
  100% {
    transform: rotate(1800deg);
  }
}
</style>
<script>
import { mapFields, mapMultiRowFields } from "vuex-map-fields";
import { mapActions, mapGetters } from "vuex";

import SideNavBar from "../components/SideNavBar";
import TopNavBar from "../components/TopNavBar";

export default {
  components: {
    SideNavBar,
    TopNavBar,
  },
  data() {
    return {};
  },
  beforeMount() {
    var cookie = this.$cookies.get("refresh-token");
    if (cookie === undefined) {
      this.$router.push("/sign");
    }
  },
  mounted() {
    this.loadModules();
  },

  computed: {
    ...mapGetters({
      getLoading: "getLoading",
    }),
    loading() {
      var loading = this.getLoading;
      return loading;
    },
  },
  methods: {
    ...mapActions({
      loadModules: "getMenu",
      logout: "logout",
    }),
    toBildirimler() {
      this.$router.push("/bildirimler");
    },
  },
};
</script>
