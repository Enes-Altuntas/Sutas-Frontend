<template>
  <div class="arka">
    <div class="loading-page" v-if="loading">
      <div class="lds-hourglass"></div>
    </div>
    <v-dialog
      v-model="revDialog"
      persistent
      max-width="600px"
      @keydown.esc="revDialog = false"
    >
      <v-card color="supBack">
        <v-toolbar color="indexToolbar" dark>
          <v-toolbar-title>Güncelleme Onay Ekranı</v-toolbar-title>
        </v-toolbar>
        <v-card-text>
          <v-container grid-list-md>
            <v-layout wrap>
              <v-flex xs12 class="mb-4">
                <span class="isim">{{ this.revDialogProps.NAME1 }}</span>
              </v-flex>
              <v-flex xs6>
                <v-text-field
                  counter
                  readonly
                  maxlength="10"
                  outline
                  label="Yeni Sabit No."
                  v-model="revDialogProps.APPR_TELF1"
                ></v-text-field>
              </v-flex>
              <v-flex xs6>
                <v-text-field
                  counter
                  readonly
                  maxlength="10"
                  label="Eski Sabit No."
                  v-model="revDialogProps.TELF1"
                ></v-text-field>
              </v-flex>
              <v-flex xs6>
                <v-text-field
                  counter
                  readonly
                  maxlength="10"
                  outline
                  label="Yeni Mobil No."
                  v-model="revDialogProps.APPR_TELF2"
                ></v-text-field>
              </v-flex>
              <v-flex xs6>
                <v-text-field
                  counter
                  readonly
                  maxlength="10"
                  label="Eski Mobil No."
                  v-model="revDialogProps.TELF2"
                ></v-text-field>
              </v-flex>
              <v-flex xs6>
                <v-text-field
                  counter
                  readonly
                  outline
                  maxlength="10"
                  label="Yeni Fax No."
                  v-model="revDialogProps.APPR_TELFX"
                ></v-text-field>
              </v-flex>
              <v-flex xs6>
                <v-text-field
                  counter
                  readonly
                  maxlength="10"
                  label="Eski Fax No."
                  v-model="revDialogProps.TELFX"
                ></v-text-field>
              </v-flex>
              <v-flex xs6>
                <v-text-field
                  label="Yeni E-mail adresi"
                  outline
                  readonly
                  v-model="revDialogProps.APPR_SMTP_ADDR"
                ></v-text-field>
              </v-flex>
              <v-flex xs6>
                <v-text-field
                  label="Eski E-mail adresi"
                  readonly
                  v-model="revDialogProps.SMTP_ADDR"
                ></v-text-field>
              </v-flex>
              <v-flex xs12 v-for="pers in revDialogProps.RESP_PERS" :key="pers">
                <v-flex xs12 class="mt-4 title">
                  <span
                    >" {{ pers.NAMEV }} {{ pers.NAME1 }} " isimli ilgili
                    kişi</span
                  >
                </v-flex>
                <v-flex xs12>
                  <v-divider class="mx-1" horizontal></v-divider>
                </v-flex>
                <v-layout wrap>
                  <v-flex xs6>
                    <v-text-field
                      counter
                      readonly
                      outline
                      maxlength="10"
                      label="Yeni İsim"
                      v-model="pers.APPR_NAMEV"
                    ></v-text-field>
                  </v-flex>
                  <v-flex xs6>
                    <v-text-field
                      counter
                      readonly
                      outline
                      maxlength="10"
                      label="Yeni Soyisim"
                      v-model="pers.APPR_NAME1"
                    ></v-text-field>
                  </v-flex>
                  <v-flex xs6>
                    <v-text-field
                      counter
                      outline
                      readonly
                      maxlength="10"
                      label="Yeni Sabit No."
                      v-model="pers.APPR_TELF1"
                    ></v-text-field>
                  </v-flex>
                  <v-flex xs6>
                    <v-text-field
                      counter
                      readonly
                      maxlength="10"
                      label="Eski Sabit No."
                      v-model="pers.TELF1"
                    ></v-text-field>
                  </v-flex>
                  <v-flex xs6>
                    <v-text-field
                      counter
                      readonly
                      outline
                      maxlength="10"
                      label="Yeni Mobil No."
                      v-model="pers.APPR_MOBIL_TEL"
                    ></v-text-field>
                  </v-flex>
                  <v-flex xs6>
                    <v-text-field
                      counter
                      readonly
                      maxlength="10"
                      label="Eski Mobil No."
                      v-model="pers.MOBIL_TEL"
                    ></v-text-field>
                  </v-flex>
                  <v-flex xs6>
                    <v-text-field
                      outline
                      label="Yeni E-mail adresi"
                      readonly
                      v-model="pers.APPR_SMTP_ADDR"
                    ></v-text-field>
                  </v-flex>
                  <v-flex xs6>
                    <v-text-field
                      label="Eski E-mail adresi"
                      readonly
                      v-model="pers.SMTP_ADDR"
                    ></v-text-field>
                  </v-flex>
                </v-layout>
              </v-flex>
              <v-flex xs12>
                <v-btn
                  block
                  color="success"
                  @click="revAcceptButton(revDialogProps)"
                  >Onay Ver</v-btn
                >
                <v-btn
                  block
                  color="error"
                  @click="revRejectButton(revDialogProps)"
                  >Reddet</v-btn
                >
              </v-flex>
            </v-layout>
          </v-container>
        </v-card-text>
      </v-card>
    </v-dialog>
    <v-toolbar dark color="green darken-4">
      <v-toolbar-title>Tedarikçi Listesi</v-toolbar-title>
      <v-spacer></v-spacer>
      <v-divider class="mx-2" inset vertical></v-divider>
      <v-text-field
        color="white"
        v-model="search"
        append-icon="search"
        label="Search"
        single-line
        hide-details
      ></v-text-field>
    </v-toolbar>
    <v-data-table
      :headers="headers"
      :items="getlist"
      :items-per-page="-1"
      class="elevation-1"
      hide-default-footer
      :search="search"
    >
      <template v-slot:[`item.LIFNR`]="{ item }"
        ><td @click="detay(item)" id="first">
          {{ item.LIFNR.toString().replace(/\b0+/g, "") }}
        </td></template
      >
      <template v-slot:[`item.WAITING_APPR`]="{ item }"
        ><v-icon
          v-if="get_type === 'PUR'"
          @click="revAccept(item)"
          color="success"
          >done</v-icon
        ></template
      >
      <v-alert slot="no-results" :value="true" color="error" icon="warning"
        >Aradığınız tedarikçi bulunamamıştır !</v-alert
      >
    </v-data-table>
  </div>
</template>

<style>
.arka {
  background: url("../../static/dusk.jpg") no-repeat;
  background-size: cover;
  background-attachment: fixed;
  width: 100%;
  height: 100%;
}

.detayDialog {
  border-radius: 10px;
}

#first {
  color: #5ee2ff;
}

#second {
  color: red;
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
      search: "",
      revDialog: false,
      revDialogProps: {
        name1: undefined,
        telf1: undefined,
        oldtelf1: undefined,
        telf2: undefined,
        oldtelf2: undefined,
        telfx: undefined,
        oldtelfx: undefined,
        smtp_addr: undefined,
        oldsmtp_addr: undefined,
        oldData: undefined,
      },
      headers: [
        {
          text: "Tedarikçi No",
          value: "LIFNR",
          sortable: false,
        },
        {
          text: "Tedarikçi Adı",
          value: "NAME1",
          sortable: false,
        },
        {
          text: "Vergi Numarası",
          value: "STCD2",
          sortable: false,
        },
        {
          text: "Vergi Dairesi",
          value: "STCD1",
          sortable: false,
        },
        {
          text: "Telefon No:",
          value: "TELF1",
          sortable: false,
        },
        {
          text: "Alt. Telefon No",
          value: "TELF2",
          sortable: false,
        },
        {
          text: "Fax",
          value: "TELFX",
          sortable: false,
        },
        {
          text: "",
          value: "WAITING_APPR",
          sortable: false,
        },
      ],
    };
  },

  beforeMount() {
    this.pull_list();
  },

  computed: {
    ...mapFields({
      badge: "badge",
    }),
    ...mapGetters({
      getlist: "supplierInfo/getlist",
      getLoading: "supplierInfo/getLoading",
      get_type: "getUserType",
    }),

    loading() {
      var loading = this.getLoading;
      return loading;
    },
  },

  methods: {
    ...mapActions({
      pull_list: "supplierInfo/get_list",
      sendApprove: "supplierInfo/sendApprove",
    }),

    detay(item) {
      debugger;
      if (this.get_type != "PLA") {
        this.$router.push("/sup/" + item.LIFNR);
      }
    },

    revAccept(item) {
      this.revDialog = true;
      this.badge = [];
      this.revDialogProps = item;
    },

    revAcceptButton(item) {
      this.sendApprove({ DATA: item, ACTION: "APPROVE" });
      this.revDialog = false;
    },

    revRejectButton(item) {
      this.sendApprove({ DATA: item, ACTION: "REJECT" });
      this.revDialog = false;
    },
  },
};
</script>
