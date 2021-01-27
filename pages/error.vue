<template>
    <div>
        <v-layout align-center justify-start column fill-height>
            <img src="../static/sutas.png" class="resim" alt="Sütaş">
            <span class="status">Hata Kodu : {{this.$route.query.status}}</span>
            <span class="ztitle">"{{this.$route.query.title}}"</span>
            <span class="ztitlez" @click="git()">Lütfen tekrar denemek için tıklayınız !</span>
            <span class="ztitlez" @click="gitExit()">Çıkış yapmak için tıklayınız !</span>
        </v-layout>
    </div>
</template>
<style>
body {
  margin: 0;
  padding: 0;
  background: url("../static/dusk.jpg") no-repeat;
  background-size: cover;
  background-attachment: fixed;
}


.resim{
    height: 400px;
}
.status{
    font-size: 30px;
    color: white;
}
.ztitle{
    font-size: 40px;
    color: white;
}
.ztitlez{
    font-size: 40px;
    color: rgb(252, 235, 88);
    text-decoration: underline;
}
</style>
<script>
export default {
    layout: 'signLayout',
    data() {
        return {
        }
    },

    computed: {

    },

    methods: {
        git(){
            this.$router.back()
        },
        gitExit(){
            this.$cookies.remove('refresh-token')
            this.$router.push('/sign')
        },
    }
}
</script>