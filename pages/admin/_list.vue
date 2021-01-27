<template>
  <div class="arka">
    <div class="loading-page" v-if="loading">
      <div class="lds-hourglass"></div>
    </div>
    <v-toolbar color="supToolbar" dark>
      <v-toolbar-title>Admin Kullanıcı Bakım Ekranı</v-toolbar-title>
      <v-spacer></v-spacer>
      <v-btn color="success" @click="newDialog">
        Yeni Kullanıcı Oluştur
        <v-icon class="ml-2">add</v-icon>
      </v-btn>
      <v-dialog
        persistent
        v-model="userDialog"
        max-width="500px"
        @keydown.esc="exit"
      >
        <v-form ref="addForm">
          <v-card class="cart">
            <v-img class="white--text" height="200px" :src="this.resim1.src">
              <v-container fill-height fluid>
                <v-layout fill-height>
                  <v-flex xs12 align-end flexbox>
                    <v-spacer></v-spacer>
                    <span class="headline">Yeni Kullanıcı Oluştur</span>
                  </v-flex>
                </v-layout>
              </v-container>
            </v-img>
            <v-card-title>
              <v-flex xs12>
                <v-text-field
                  :readonly="addType === 'change'"
                  counter
                  :rules="nameRules"
                  outline
                  v-model="selectedUserInfo.username"
                  label="Kullanıcı Adı"
                ></v-text-field>
              </v-flex>
              <v-flex xs12>
                <v-text-field
                  :rules="passsRules"
                  outline
                  v-model="selectedUserInfo.password"
                  label="Şifre"
                ></v-text-field>
              </v-flex>
              <v-flex xs12>
                <v-text-field
                  :rules="emailRules"
                  outline
                  v-model="selectedUserInfo.email"
                  label="E-Mail"
                ></v-text-field>
              </v-flex>
              <v-flex xs12>
                <v-text-field
                  outline
                  counter
                  mask="##########"
                  :rules="lifnrRules"
                  v-model="selectedUserInfo.user_sys_id"
                  label="Kullanıcı Kodu (SAP LIFNR)"
                ></v-text-field>
              </v-flex>
              <v-flex xs12>
                <v-select
                  outline
                  :rules="typeRules"
                  :items="types"
                  item-text="text"
                  item-value="value"
                  v-model="selectedUserInfo.user_type"
                  label="Kullanıcı Tipi"
                ></v-select>
              </v-flex>
              <v-flex xs12>
                <v-text-field
                  :rules="compRules"
                  outline
                  v-model="selectedUserInfo.company"
                  label="Şirket"
                ></v-text-field>
              </v-flex>
              <v-layout wrap>
                <v-flex xs12>
                  <v-btn block color="success" @click="sendInfo"
                    >Bilgileri Kaydet</v-btn
                  >
                </v-flex>
                <v-flex xs12>
                  <v-btn block color="error" @click="userDialog = false"
                    >Çıkış</v-btn
                  >
                </v-flex>
              </v-layout>
            </v-card-title>
          </v-card>
        </v-form>
      </v-dialog>
    </v-toolbar>
    <v-data-table
      :headers="headers"
      :items="getUserInfo"
      item-key="username"
      :items-per-page="15"
      class="elevation-1"
      :footer-props="{
        'items-per-page-text': 'Sayfa Başına Kullanıcı Miktarı',
      }"
    >
      <template v-slot:[`item.user_sys_id`]="{ item }">{{
        item.user_sys_id.toString().replace(/\b0+/g, "")
      }}</template>
      <template v-slot:[`item.actions`]="{ item }">
        <v-icon @click="detail(item)" color="green"> search </v-icon>
        <v-icon @click="deleteUser(item)" color="red"> mdi-close-thick </v-icon>
      </template>
    </v-data-table>
  </div>
</template>
<style>
.cart {
  border-radius: 10px;
}
.baslik {
  color: black;
  font-weight: bold;
}
.duyuru {
  color: red;
}
#first {
  color: blue;
}
.arka {
  background: url("../../static/dusk.jpg") no-repeat;
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
      addType: "new",
      userDialog: false,
      selectedUserInfo: {
        username: undefined,
        password: undefined,
        user_sys_id: undefined,
        company: undefined,
        user_type: undefined,
        email: undefined,
      },
      types: [
        {
          text: "TEDARIKÇI",
          value: "SUP",
        },
        {
          text: "SATIN ALMACI",
          value: "PUR",
        },
        {
          text: "PLANLAMACI",
          value: "PLA",
        },
        {
          text: "KALITECI",
          value: "QTY",
        },
      ],
      lifnrRules: [
        (v) => !!v || "Kullanıcı kodu alanı zorunludur !",
        (v) =>
          (v && v.length == 10) || "Kullanıcı kodu 10 karakter olmalıdır !",
      ],
      nameRules: [
        (v) => !!v || "Kullanıcı adı alanı zorunludur !",
        (v) =>
          (v && v.length >= 5) ||
          "Kullanıcı adı minimum 5 karakter olmalıdır !",
        (v) =>
          (v && v.length <= 12) ||
          "Kullanıcı adı maximum 12 karakter olmalıdır !",
      ],
      passText: undefined,
      showPW: false,
      passRules: [(v) => !!v || "Şifre zorunludur !"],
      typeRules: [(v) => !!v || "Kullanıcı tipi alanı zorunludur !"],
      emailRules: [(v) => !!v || "E-Mail alanı alanı zorunludur !"],
      passsRules: [(v) => !!v || "Şifre alanı zorunludur !"],
      compRules: [(v) => !!v || "Şirket adı alanı zorunludur !"],
      resim1: {
        src: require("../../static/gear.jpg"),
      },
      resim2: {
        src: require("../../static/view.jpg"),
      },
      headers: [
        {
          text: "Kullanıcı Adı",
          value: "username",
          sortable: false,
        },
        {
          text: "Kullanıcı Kodu (LIFNR)",
          value: "user_sys_id",
          sortable: false,
        },
        {
          text: "Şirket Adı",
          value: "company",
          sortable: false,
        },
        {
          text: "Kullanıcı Tipi",
          value: "user_type",
          sortable: false,
        },
        {
          text: "Şifre",
          value: "password",
          sortable: false,
        },
        {
          text: "E-Mail",
          value: "email",
          sortable: false,
        },
        {
          text: "İşlemler",
          value: "actions",
          sortable: false,
        },
      ],
    };
  },

  beforeMount() {
    this.getUsers();
  },
  computed: {
    ...mapGetters({
      getDialog: "admin/getDialog",
      getLoading: "admin/getLoading",
      getUserInfo: "admin/getUserInfo",
    }),
    loading() {
      var loading = this.getLoading;
      return loading;
    },
  },
  methods: {
    ...mapActions({
      getUsers: "admin/getUsers",
      sendInfoDB: "admin/sendInfoDB",
      sendDelInfo: "admin/sendDelInfo",
    }),
    detail(item) {
      this.userDialog = true;
      this.addType = "change";
      this.selectedUserInfo.id = item.id;
      this.selectedUserInfo.username = item.username;
      this.selectedUserInfo.user_sys_id = item.user_sys_id;
      this.selectedUserInfo.user_type = item.user_type;
      this.selectedUserInfo.password = item.password;
      this.selectedUserInfo.company = item.company;
      this.selectedUserInfo.email = item.email;
    },
    exit() {
      this.userDialog = false;
      this.$refs.addForm.reset();
      this.$refs.addForm.resetValidation();
    },
    sendInfo() {
      if (this.$refs.addForm.validate()) {
        this.sendInfoDB({ DATA: this.selectedUserInfo });
        this.userDialog = false;
      }
    },
    deleteUser(item) {
      if (item.username === "admin") {
        this.$toast.show("Admin rolü silinemez !", {
          theme: "bubble",
          icon: "cancel",
          type: "error",
          position: "bottom-right",
          duration: 2000,
        });
      } else {
        this.sendDelInfo({ DATA: item });
      }
    },
    newDialog() {
      this.userDialog = true;
      this.addType = "new";
    },
  },
};
</script>
