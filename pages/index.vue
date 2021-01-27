<template>
  <div class="arka">
    <div class="loading-page" v-if="loading">
      <div class="lds-hourglass"></div>
    </div>
    <v-carousel
      v-if="
        getUserType === 'PUR' ||
        getUserType === 'SUP' ||
        getUserType === 'PLA' ||
        getUserType === 'ADM'
      "
    >
      <v-carousel-item
        v-for="(item, i) in pictures"
        :key="i"
        :src="item.src"
      ></v-carousel-item>
    </v-carousel>
    <v-layout row wrap>
      <v-flex
        xs6
        v-if="
          getUserType === 'PUR' ||
          getUserType === 'SUP' ||
          getUserType === 'PLA' ||
          getUserType === 'ADM'
        "
      >
        <v-toolbar color="indexcolor2">
          <v-toolbar-title> Sütaş Duyuruları </v-toolbar-title>
        </v-toolbar>
        <v-data-table
          dark
          :headers="headers"
          :items="getAnounce"
          item-key="ID"
          class="elevation-1"
          :items-per-page="4"
          :footer-props="{
            'items-per-page-text': 'Sayfa Başına Duyuru',
          }"
          @click:row="routeToAnounce"
        >
        </v-data-table>
      </v-flex>
      <v-flex
        xs6
        v-if="
          getUserType === 'PUR' ||
          getUserType === 'SUP' ||
          getUserType === 'PLA'
        "
      >
        <v-toolbar dark color="indexcolor1">
          <v-toolbar-title> Sütaş Siparişleri Durum Özeti </v-toolbar-title>
        </v-toolbar>
        <v-data-table
          :headers="headersZ"
          :items="getQuan"
          class="elevation-1"
          :items-per-page="4"
          :footer-props="{
            'items-per-page-text': 'Sayfa Başına Filtre',
          }"
          @click:row="routeToPo"
        >
        </v-data-table>
      </v-flex>
      <v-flex xs6 v-if="getUserType === 'ADM'">
        <v-toolbar dark color="indexcolor1">
          <v-toolbar-title> Kullanıcı Sayısı </v-toolbar-title>
        </v-toolbar>
        <v-data-table
          :headers="headersU"
          :items="getUserCount"
          class="elevation-1"
          :items-per-page="4"
          :footer-props="{
            'items-per-page-text': 'Sayfa Başına Kullanıcı',
          }"
        >
        </v-data-table>
      </v-flex>
    </v-layout>
  </div>
</template>
<style>
.first {
  color: blue;
}
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
#order {
  border: 2px solid black;
  background: url("../static/sunshine.jpg") no-repeat;
  background-size: cover;
  color: white;
}
.arka {
  background: url("../static/dusk.jpg") no-repeat;
  background-size: cover;
  background-attachment: fixed;
  width: 100%;
  height: 100%;
}
</style>
<script>
import { mapFields, mapMultiRowFields } from "vuex-map-fields";
import { mapActions, mapGetters } from "vuex";

export default {
  data() {
    return {
      pictures: [
        {
          src: require("../static/5.jpg"),
        },
      ],

      headers: [
        {
          text: "Duyuru Başlığı",
          value: "title",
          sortable: false,
        },
        {
          text: "Yayınlanma Tarihi",
          value: "created_date",
          sortable: true,
        },
        {
          text: "Yayınlanma Saati",
          value: "created_time",
          sortable: false,
        },
        {
          text: "Kime",
          value: "who",
          sortable: false,
        },
      ],
      headersZ: [
        {
          text: "Sıra",
          value: "row",
          sortable: false,
        },
        {
          text: "Sipariş Durumu",
          value: "baslik",
          sortable: false,
        },
        {
          text: "Sipariş Sayısı",
          value: "adet",
          sortable: true,
        },
      ],
      headersU: [
        {
          text: "Kullanıcı Rolü",
          value: "user_role",
          sortable: false,
        },
        {
          text: "Kullanıcı Sayısı",
          value: "user_count",
          sortable: true,
        },
      ],
    };
  },

  computed: {
    ...mapGetters({
      getLoading: "getLoading",
      getAnounce: "getAnounces",
      getQuan: "getQuans",
      getUserType: "getUserType",
      getUserCount: "getUserCount",
    }),
    loading() {
      var loading = this.getLoading;
      return loading;
    },
    get_pictures() {
      const pictures = this.$store.state.pictures;
      return pictures;
    },
    alt_menu_items() {
      const alt_menu_items = this.$store.state.module_sections;
      return alt_menu_items;
    },
    main_menu_items() {
      const main_menu_items = this.$store.state.opened_modules;
      return main_menu_items;
    },
  },

  methods: {
    routeToAnounce() {
      this.$router.push("/duyurular");
    },
    routeToPo(value) {
      this.$router.push(value.url);
    },
  },
};
</script>
