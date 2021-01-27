<template>
  <v-app>
    <v-main>
      <v-container fluid fill-height class="main">
        <v-layout align-center justify-center>
          <nuxt />
        </v-layout>
      </v-container>
    </v-main>
  </v-app>
</template>
<style>
body {
    margin: 0;
    padding: 0;
}

.main {
    background: url("../static/dusk.jpg") no-repeat;
    background-size: cover;
    background-attachment: fixed;
    width: 100%;
    height: 100%;
}
</style>
<script>
export default {
    data() {
        return {
        }
    },
    computed: {
    },
    methods: {
    }
}
</script>