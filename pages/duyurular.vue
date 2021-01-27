<template>
  <div class="arka">
    <div class="loading-page" v-if="loading">
      <div class="lds-hourglass"></div>
    </div>
    <v-toolbar color="#1B5E20">
      <v-toolbar-title> Duyurular </v-toolbar-title>
      <v-spacer></v-spacer>
      <v-icon v-if="getUserType === 'PUR'" @click="ekle" left>add</v-icon>
      <v-dialog v-model="duyuruDialog" @keydown.esc="kapat" width="600px">
        <v-card>
          <v-toolbar color="warning">
            <v-toolbar-title> Duyuru Ekleme Ekranı </v-toolbar-title>
            <v-spacer></v-spacer>
            <v-icon @click="kapat">clear</v-icon>
          </v-toolbar>
          <v-card-text>
            <v-form ref="form">
              <v-container grid-list-md>
                <v-layout wrap>
                  <v-flex xs12 mt-4>
                    <v-checkbox
                      v-model="privateAnounce"
                      label="Özel Duyuru"
                    ></v-checkbox>
                  </v-flex>
                  <v-flex xs12>
                    <v-select
                      attach
                      chips
                      multiple
                      v-if="privateAnounce"
                      :items="getUsers"
                      item-text="complete"
                      item-value="user_sys_id"
                      v-model="editedAnounce.who"
                      label="Kullanıcı Seçiniz"
                    ></v-select>
                  </v-flex>
                  <v-flex xs6>
                    <v-text-field
                      counter
                      clearable
                      maxlength="25"
                      v-model="editedAnounce.title"
                      :rules="titleRules"
                      label="Duyuru Başlığı"
                    ></v-text-field>
                  </v-flex>
                  <v-flex xs12>
                    <v-textarea
                      counter
                      maxlength="255"
                      clearable
                      v-model="editedAnounce.anounce"
                      :rules="contentRules"
                      outline
                      label="Duyuru İçeriği"
                    ></v-textarea>
                  </v-flex>
                  <v-flex xs6>
                    <v-menu
                      v-model="menu"
                      :close-on-content-click="false"
                      :nudge-right="40"
                      transition="scale-transition"
                      offset-y
                      min-width="290px"
                    >
                      <template v-slot:activator="{ on, attrs }">
                        <v-text-field
                          v-model="editedAnounce.from_date"
                          label="Başlangıç Tarihi"
                          prepend-icon="mdi-calendar"
                          readonly
                          v-bind="attrs"
                          v-on="on"
                        ></v-text-field>
                      </template>
                      <v-date-picker
                        color="green lighten-1"
                        light
                        v-model="editedAnounce.from_date"
                        @input="menu = false"
                        locale="tr-TR"
                      ></v-date-picker>
                    </v-menu>
                  </v-flex>
                  <v-flex xs6>
                    <v-menu
                      ref="menu"
                      v-model="menu3"
                      :close-on-content-click="false"
                      :nudge-right="40"
                      :return-value.sync="editedAnounce.from_time"
                      transition="scale-transition"
                      offset-y
                      max-width="290px"
                      min-width="290px"
                    >
                      <template v-slot:activator="{ on, attrs }">
                        <v-text-field
                          v-model="editedAnounce.from_time"
                          label="Başlangıç Saati"
                          prepend-icon="mdi-clock-time-four-outline"
                          readonly
                          v-bind="attrs"
                          v-on="on"
                        ></v-text-field>
                      </template>
                      <v-time-picker
                        v-if="menu3"
                        format="24hr"
                        v-model="editedAnounce.from_time"
                        full-width
                        @click:minute="$refs.menu.save(editedAnounce.from_time)"
                      ></v-time-picker>
                    </v-menu>
                  </v-flex>
                  <v-flex xs6>
                    <v-menu
                      v-model="menu2"
                      :close-on-content-click="false"
                      :nudge-right="40"
                      transition="scale-transition"
                      offset-y
                      min-width="290px"
                    >
                      <template v-slot:activator="{ on, attrs }">
                        <v-text-field
                          v-model="editedAnounce.to_date"
                          label="Bitiş Tarihi"
                          prepend-icon="mdi-calendar"
                          readonly
                          v-bind="attrs"
                          v-on="on"
                        ></v-text-field>
                      </template>
                      <v-date-picker
                        v-model="editedAnounce.to_date"
                        color="green lighten-1"
                        light
                        @input="menu2 = false"
                        locale="tr-TR"
                      ></v-date-picker>
                    </v-menu>
                  </v-flex>
                  <v-flex xs6>
                    <v-menu
                      ref="menu1"
                      v-model="menu4"
                      :close-on-content-click="false"
                      :nudge-right="40"
                      :return-value.sync="editedAnounce.to_time"
                      transition="scale-transition"
                      offset-y
                      max-width="290px"
                      min-width="290px"
                    >
                      <template v-slot:activator="{ on, attrs }">
                        <v-text-field
                          v-model="editedAnounce.to_time"
                          label="Bitiş Saati"
                          prepend-icon="mdi-clock-time-four-outline"
                          readonly
                          v-bind="attrs"
                          v-on="on"
                        ></v-text-field>
                      </template>
                      <v-time-picker
                        v-if="menu4"
                        format="24hr"
                        v-model="editedAnounce.to_time"
                        full-width
                        @click:minute="$refs.menu1.save(editedAnounce.to_time)"
                      ></v-time-picker>
                    </v-menu>
                  </v-flex>
                </v-layout>
              </v-container>
            </v-form>
          </v-card-text>
          <v-card-actions>
            <v-spacer></v-spacer>
            <v-btn @click="ekleDuyuru" block color="success">Duyuru Ekle</v-btn>
          </v-card-actions>
        </v-card>
      </v-dialog>
    </v-toolbar>
    <v-container grid-list-md justify-center>
      <v-layout wrap>
        <v-flex xs12 md12 lg6 v-for="(item, i) in getAnounce" :key="i">
          <v-card dark width="100%" class="dialog">
            <v-card-title>
              <v-icon large left> alarm </v-icon>
              <span class="title font-weight-light">{{ item.title }}</span>
              <v-spacer></v-spacer>
              <v-icon v-if="getUserType === 'PUR'" @click="sil(item)">
                delete
              </v-icon>
            </v-card-title>
            <v-card-text class="headline font-weight-bold">
              {{ item.who }} - {{ item.anounce }}
            </v-card-text>

            <v-card-actions>
              <v-list-item class="grow">
                <v-list-item-avatar>
                  <img src="../static/avatar.png" />
                </v-list-item-avatar>

                <v-list-item-content>
                  <v-list-item-title
                    >{{ item.created_by }} /
                    {{ item.created_time }}</v-list-item-title
                  >
                </v-list-item-content>

                <v-layout align-center justify-end>
                  <v-icon class="mr-1">arrow_back</v-icon>
                  <span class="subheading mr-2"
                    >{{ dateFormatted(item.from_date) }} /
                    {{ item.from_time }}</span
                  >
                  <span class="mr-1"></span>
                  <v-icon class="mr-1">arrow_forward</v-icon>
                  <span class="subheading"
                    >{{ dateFormatted(item.to_date) }} /
                    {{ item.to_time }}</span
                  >
                </v-layout>
              </v-list-item>
            </v-card-actions>
          </v-card>
        </v-flex>
      </v-layout>
    </v-container>
  </div>
</template>

<style>
.dialog {
  border-radius: 25px;
}
.arka {
  background: url("../static/dusk.jpg") no-repeat;
  background-size: cover;
  background-attachment: fixed;
  width: 100%;
  height: 100%;
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
</style>

<script>
import { mapFields, mapMultiRowFields } from "vuex-map-fields";
import { mapActions, mapGetters } from "vuex";

export default {
  data() {
    return {
      mails: [],
      privateAnounce: false,
      menu: false,
      menu2: false,
      menu3: false,
      menu4: false,
      duyuruDialog: false,
      titleRules: [
        (v) => !!v || "Duyuru Başlığı alanı zorunludur !",
        (v) => (v && v.length >= 5) || "Başlık minimum 5 karakter olmalıdır !",
      ],
      contentRules: [
        (v) => !!v || "Duyuru İçeriği alanı zorunludur !",
        (v) =>
          (v && v.length >= 20) || "Duyurunuz minimum 20 karakter olmalıdır !",
      ],
      sDateRules: [
        (v) => !!v || "Geçerlilik başlangıç tarihi alanı zorunludur !",
      ],
      fDateRules: [(v) => !!v || "Geçerlilik bitiş tarihi alanı zorunludur !"],
      sTimeRules: [
        (v) => !!v || "Geçerlilik başlangıç saati alanı zorunludur !",
      ],
      fTimeRules: [(v) => !!v || "Geçerlilik bitiş saati zorunludur !"],
      editedAnounce: {
        id: undefined,
        title: "",
        anounce: "",
        created_by: "",
        created_time: "",
        from_date: "",
        from_time: "",
        to_date: "",
        to_time: "",
        importance: "",
        who: [],
      },
    };
  },

  mounted() {
    this.pullAnounce();
  },

  computed: {
    ...mapGetters({
      getUserId: "getUserId",
      getUserType: "getUserType",
      getUserInfo: "getUserInfo",
      getAnounce: "anouncements/getAnounce",
      getUsers: "getUser",
      getLoading: "anouncements/getLoading",
    }),
    loading() {
      var loading = this.getLoading;
      return loading;
    },
  },

  methods: {
    ...mapActions({
      pullAnounce: "anouncements/pullAnounce",
      sendAnounce: "anouncements/sendAnounce",
      delAnounce: "anouncements/delAnounce",
    }),

    ekle() {
      this.editedAnounce.who = [];
      this.duyuruDialog = true;
      //this.sendAnounce(this.editedAnounce)
    },

    kapat() {
      this.$refs.form.reset();
      this.duyuruDialog = false;
      this.editedAnounce.who = [];
    },

    ekleDuyuru() {
      if (this.$refs.form.validate()) {
        this.editedAnounce.created_by = this.getUserInfo;
        var time = new Date();
        var saat = time.getHours();
        var dakika = time.getMinutes();
        var dd = String(time.getDate()).padStart(2, "0");
        var mm = String(time.getMonth() + 1).padStart(2, "0");
        var yyyy = time.getFullYear();

        this.editedAnounce.created_date = mm + "/" + dd + "/" + yyyy;
        this.editedAnounce.created_time = saat + ":" + dakika;

        if (this.editedAnounce.who.length == 0) {
          this.editedAnounce.who.push("GENEL");
        }

        this.editedAnounce.importance = "3";

        this.sendAnounce(this.editedAnounce);
        this.duyuruDialog = false;
      }
    },

    sil(item) {
      this.delAnounce({
        title: item.title,
        anounce: item.anounce,
      });
    },
  },
};
</script>
