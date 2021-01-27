<template>
  <div>
    <v-dialog
      v-model="sureDialog"
      persistent
      max-width="350"
      @keydown.esc="removeFile"
    >
      <v-card>
        <v-card-title class="headline">Dosya/Ek Seçimi</v-card-title>
        <v-card-text>
          <v-form>
            <v-container grid-list-md>
              <v-layout wrap>
                <v-flex xs12>
                  <v-select
                    clearable
                    :items="docType"
                    v-model="attachProp.doc_type"
                    label="Döküman Tipi"
                  ></v-select>
                </v-flex>
                <v-flex xs12>
                  <v-menu>
                    <v-text-field
                      readonly
                      v-model="attachProp.date"
                      clearable
                      slot="activator"
                      label="Geçerlilik Bitiş Tarihi"
                      prepend-icon="date_range"
                    ></v-text-field>
                    <v-date-picker v-model="attachProp.date"></v-date-picker>
                  </v-menu>
                </v-flex>
              </v-layout>
            </v-container>
          </v-form>
        </v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn color="green darken-1" flat="flat" @click="acceptFile()"
            >Kaydet</v-btn
          >
          <v-btn color="green darken-1" flat="flat" @click="removeFile()"
            >Vazgeç</v-btn
          >
        </v-card-actions>
      </v-card>
    </v-dialog>
    <div class="loading-page" v-if="loading">
      <div class="lds-hourglass"></div>
    </div>
    <v-dialog
      v-model="perDialog"
      persistent
      max-width="500px"
      @keydown.esc="perDialog = false"
    >
      <v-card color="supBack">
        <v-toolbar color="indexToolbar" dark>
          <v-toolbar-title>İlgili Kişi Bilgi Güncelleme Ekranı</v-toolbar-title>
          <v-spacer></v-spacer>
          <v-icon @click="perDialog = false">clear</v-icon>
        </v-toolbar>
        <v-card-text>
          <v-container grid-list-md>
            <v-layout wrap>
              <v-flex xs12>
                <span class="isim"
                  >{{ this.perInfo.oldnamev }} {{ this.perInfo.oldname1 }}</span
                >
              </v-flex>
              <v-flex xs12 class="mt-2">
                <v-text-field
                  counter
                  maxlength="10"
                  label="Yeni İsim"
                  v-model="perInfo.namev"
                ></v-text-field>
              </v-flex>
              <v-flex xs12 class="mt-2">
                <v-text-field
                  counter
                  maxlength="10"
                  label="Yeni Soyisim"
                  v-model="perInfo.name1"
                ></v-text-field>
              </v-flex>
              <v-flex xs12 class="mt-2">
                <v-text-field
                  counter
                  maxlength="10"
                  label="Yeni Sabit No."
                  v-model="perInfo.telf"
                ></v-text-field>
              </v-flex>
              <v-flex xs12>
                <v-text-field
                  counter
                  maxlength="10"
                  label="Yeni Mobil No."
                  v-model="perInfo.mobil"
                ></v-text-field>
              </v-flex>
              <v-flex xs12>
                <v-text-field
                  counter
                  label="Yeni E-Mail adresi"
                  v-model="perInfo.email"
                ></v-text-field>
              </v-flex>
              <v-flex xs12>
                <v-btn
                  block
                  v-if="this.get_type === 'SUP'"
                  color="success"
                  @click="perInfoSave(perInfo.data)"
                  >Bilgileri Güncelle</v-btn
                >
                <v-btn
                  block
                  v-if="this.get_type === 'SUP'"
                  color="error"
                  @click="perDialog = false"
                  >Çıkış</v-btn
                >
                <v-btn
                  block
                  v-if="this.get_type === 'PUR'"
                  color="success"
                  @click="revAcceptButton(perInfo.data)"
                  >Onayla</v-btn
                >
                <v-btn
                  block
                  v-if="this.get_type === 'PUR'"
                  color="error"
                  @click="revRejectButton(perInfo.data)"
                  >Reddet</v-btn
                >
              </v-flex>
            </v-layout>
          </v-container>
        </v-card-text>
      </v-card>
    </v-dialog>
    <v-dialog
      v-model="revDialog"
      persistent
      max-width="500px"
      @keydown.esc="revDialog = false"
    >
      <v-card color="supBack">
        <v-toolbar color="indexToolbar" dark>
          <v-toolbar-title>Bilgi Güncelleme Ekranı</v-toolbar-title>
        </v-toolbar>
        <v-card-text>
          <v-container grid-list-md>
            <v-layout wrap>
              <v-flex xs12>
                <span class="isim">{{ this.get_info.NAME1 }}</span>
              </v-flex>
              <v-flex xs12>
                <v-text-field
                  counter
                  maxlength="10"
                  label="Sabit No."
                  v-model="compSabit"
                ></v-text-field>
              </v-flex>
              <v-flex xs12>
                <v-text-field
                  counter
                  maxlength="10"
                  label="Mobil No."
                  v-model="compMobil"
                ></v-text-field>
              </v-flex>
              <v-flex xs12>
                <v-text-field
                  counter
                  maxlength="10"
                  label="Fax No."
                  v-model="compFax"
                ></v-text-field>
              </v-flex>
              <v-flex xs12>
                <v-text-field
                  label="E-mail adresi"
                  v-model="compMail"
                ></v-text-field>
              </v-flex>
              <v-flex xs12>
                <v-btn block color="success" @click="revInfoSave()"
                  >Bilgileri Güncelle</v-btn
                >
                <v-btn block color="error" @click="revDialog = false"
                  >Çıkış</v-btn
                >
              </v-flex>
            </v-layout>
          </v-container>
        </v-card-text>
      </v-card>
    </v-dialog>
    <v-card color="supBack">
      <v-toolbar dark color="supToolbar">
        <v-toolbar-title>Tedarikçi Bilgileri</v-toolbar-title>
      </v-toolbar>
      <v-divider class="mx-5" horizontal></v-divider>
      <v-card-text>
        <v-container grid-list-md justify-center>
          <v-layout wrap>
            <v-flex xs12>
              <span class="headline font-weight-medium">Genel Bilgiler</span>
            </v-flex>
            <v-flex xs12>
              <v-divider class="mx-1" inset horizontal></v-divider>
            </v-flex>
            <v-flex xs12 lg6>
              <v-text-field
                v-model="get_info.LIFNR"
                readonly
                label="Tedarikçi Kodu"
              ></v-text-field>
            </v-flex>
            <v-flex xs12 lg6>
              <v-text-field
                v-model="get_info.NAME1"
                readonly
                label="Tedarikçi Adı"
              ></v-text-field>
            </v-flex>
            <v-flex xs12 lg6>
              <v-text-field
                v-model="get_info.STCD2"
                readonly
                label="Vergi Numarası"
              ></v-text-field>
            </v-flex>
            <v-flex xs12 lg6>
              <v-text-field
                v-model="get_info.STCD1"
                readonly
                label="Vergi Dairesi"
              ></v-text-field>
            </v-flex>
            <v-flex xs12 class="mt-3">
              <span class="headline font-weight-medium"
                >İletişim Bilgileri</span
              >
            </v-flex>
            <v-flex xs12>
              <v-divider class="mx-1" inset horizontal></v-divider>
            </v-flex>
            <v-flex xs12 lg3>
              <v-text-field
                readonly
                v-model="get_info.SMTP_ADDR"
                label="E-Mail"
              ></v-text-field>
            </v-flex>
            <v-flex xs12 lg3>
              <v-text-field
                readonly
                v-model="get_info.TELF1"
                label="Telefon"
              ></v-text-field>
            </v-flex>
            <v-flex xs12 lg3>
              <v-text-field
                readonly
                v-model="get_info.TELF2"
                label="Mobil"
              ></v-text-field>
            </v-flex>
            <v-flex xs12 lg3>
              <v-text-field
                readonly
                v-model="get_info.TELFX"
                label="Fax"
              ></v-text-field>
            </v-flex>
            <v-flex xs12 class="mt-3">
              <span class="headline font-weight-medium">Adres Bilgileri</span>
            </v-flex>
            <v-flex xs12>
              <v-divider class="mx-1" inset horizontal></v-divider>
            </v-flex>
            <v-flex xs12 lg6>
              <v-text-field
                readonly
                v-model="get_info.LAND1"
                label="Ülke"
              ></v-text-field>
            </v-flex>
            <v-flex xs12 lg6>
              <v-text-field
                readonly
                v-model="get_info.REGIO"
                label="Bölge"
              ></v-text-field>
            </v-flex>
            <v-flex xs12 lg6>
              <v-text-field
                readonly
                v-model="get_info.ORT01"
                label="Şehir"
              ></v-text-field>
            </v-flex>
            <v-flex xs12 lg6>
              <v-text-field
                readonly
                v-model="get_info.PSTLZ"
                label="Posta Kodu"
              ></v-text-field>
            </v-flex>
            <v-flex xs12 lg6>
              <v-text-field
                readonly
                v-model="get_info.STRAS"
                label="Posta Kodu"
              ></v-text-field>
            </v-flex>
            <v-flex
              xs12
              class="mt-3"
              v-if="get_type === 'SUP' || get_type === 'PUR'"
            >
              <span class="headline font-weight-medium">Ödeme Bilgileri</span>
            </v-flex>
            <v-flex xs12 v-if="get_type === 'SUP' || get_type === 'PUR'">
              <v-divider class="mx-1" inset horizontal></v-divider>
            </v-flex>
            <v-flex xs12 lg6 v-if="get_type === 'SUP' || get_type === 'PUR'">
              <v-text-field
                readonly
                v-model="get_info.ZTERM"
                label="Ödeme Vadesi Kodu"
              ></v-text-field>
            </v-flex>
            <v-flex xs12 lg6 v-if="get_type === 'SUP' || get_type === 'PUR'">
              <v-text-field
                readonly
                v-model="get_info.ZTERM_DESC"
                label="Ödeme Vadesi Tanımı"
              ></v-text-field>
            </v-flex>
            <v-flex
              xs12
              class="mt-3"
              v-if="get_type === 'SUP' || get_type === 'PUR'"
            >
              <span class="headline font-weight-medium">Banka Bilgileri</span>
            </v-flex>
            <v-flex xs12 v-if="get_type === 'SUP' || get_type === 'PUR'">
              <v-divider class="mx-1" inset horizontal></v-divider>
            </v-flex>
            <v-flex xs12 v-if="get_type === 'SUP' || get_type === 'PUR'">
              <v-data-table
                :headers="headers"
                :items="get_info.BANK"
                :items-per-page="5"
                class="elevation-1"
                :footer-props="{
                  'items-per-page-text': 'Sayfa Başına Banka Bilgisi',
                }"
              >
              </v-data-table>
            </v-flex>
            <v-flex
              xs12
              class="mt-4"
              v-if="get_type === 'SUP' || get_type === 'PUR'"
            >
              <span class="headline font-weight-medium"
                >İlgili Kişi Bilgileri</span
              >
            </v-flex>
            <v-flex xs12 v-if="get_type === 'SUP' || get_type === 'PUR'">
              <v-divider class="mx-1" inset horizontal></v-divider>
            </v-flex>
            <v-flex xs12 v-if="get_type === 'SUP' || get_type === 'PUR'">
              <v-data-table
                :headers="headersz"
                hide-default-header
                :items="get_info.RESP_PERS"
                :items-per-page="5"
                class="elevation-1"
                :footer-props="{
                  'items-per-page-text': 'Sayfa Başına İlgili Kişi',
                }"
              >
              </v-data-table>
            </v-flex>
            <v-flex v-if="get_type === 'SUP'" xs12 class="mt-4">
              <span class="headline font-weight-medium">Ek Yüklemeleri</span>
            </v-flex>
            <v-flex xs12 v-if="get_type === 'SUP'">
              <v-divider class="mx-1" inset horizontal></v-divider>
            </v-flex>
            <v-flex
              xs12
              v-if="get_type === 'SUP'"
              class="text-xs-center text-sm-center text-md-center text-lg-center"
            >
              <v-text-field
                label="Dosya Seçiniz"
                @click="pickFile"
                v-model="fileName"
                prepend-icon="attach_file"
              ></v-text-field>
              <input
                type="file"
                style="display: none"
                ref="files"
                v-on:change="handleFilesUpload()"
              />
            </v-flex>
            <v-flex xs12 class="mt-4">
              <span class="headline font-weight-medium">Ekler</span>
            </v-flex>
            <v-flex xs12>
              <v-divider class="mx-1" inset horizontal></v-divider>
            </v-flex>
            <v-flex xs12 class="mt-2">
              <v-data-table
                :headers="headersEk"
                :items="getVAttach"
                item-key="id"
                :items-per-page="5"
                class="elevation-1"
                :footer-props="{
                  'items-per-page-text': 'Sayfa Başına Ek',
                }"
              >
              </v-data-table>
            </v-flex>
          </v-layout>
        </v-container>
      </v-card-text>
      <v-card-actions>
        <v-spacer></v-spacer>
        <v-btn
          v-if="get_type === 'SUP'"
          color="success"
          class="btn"
          round
          @click="revDialog = true"
          >Şirket Bilgilerini Güncelle</v-btn
        >
      </v-card-actions>
    </v-card>
  </div>
</template>

<style>
#first {
  text-decoration: underline;
  color: blue;
}
.del {
  color: red;
}

.ony {
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
.isim {
  font-size: 20px;
  font-weight: bold;
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
      kayitAlert: false,
      detailedIndex: undefined,
      perDialog: false,
      ekAlert: false,
      sureDialog: false,
      revDialog: false,
      selectedFile: [],
      sendFile: [],
      fileName: "",
      files: [],
      sendFile: [],
      fileName: "",
      attachProp: {
        doc_type: undefined,
        date: undefined,
      },
      docType: [
        "İşletme Kayıt veya Onay Belgesi",
        "Gıda Güvenliği Yönetim Sistemi Belgeleri (FSSC 22000 veya BRC veya IFS veya AIB)",
        "GDO içermez belgesi",
        "ISO 9001 Kalite Yönetim Sistemi Belgesi",
        "ISO 140001 Çevre Yönetim Sistemi Belgesi",
        "TS 180001 İş Sağlığı ve Güvenliği Belgesi",
        "ISO 27001 Bilgi Güvenliği Yönetim Sistemi Belgesi",
        "ISO 50001 Enerji Yönetim Sistemi Belgesi",
        "Helal Belgesi",
        "Kosher Belgesi",
        "Alerjen Kontrol Formu",
        "Ambalaj Migrasyon Analizleri",
        "Mikotoksin",
        "Pestisit",
        "Ağır metal analizleri",
      ],
      perInfo: {
        oldnamev: undefined,
        oldname1: undefined,
        namev: undefined,
        name1: undefined,
        email: undefined,
        telf: undefined,
        mobil: undefined,
        data: undefined,
      },
      sureDialog: false,
      headersEk: [
        {
          text: "Döküman Adı",
          value: "data_name",
          sortable: false,
        },
        {
          text: "Döküman Boyutu",
          value: "data_size",
          sortable: false,
        },
        {
          text: "Döküman Türü",
          value: "doc_type",
          sortable: false,
        },
        {
          text: "Geçerlilik Bitiş Tarihi",
          value: "date",
          sortable: false,
        },
        {
          text: "İşlemler",
          value: "data_name",
          sortable: false,
        },
      ],
      headers: [
        {
          text: "Banka Anahtarı",
          value: "BANKL",
          sortable: false,
        },
        {
          text: "Banka Adı",
          value: "BANKL_DESC",
          sortable: false,
        },
        {
          text: "Hesap Numarası",
          value: "BANKN",
          sortable: false,
        },
        {
          text: "Banka Ülke Anahtarı:",
          value: "BANKS",
          sortable: false,
        },
      ],
      headersz: [
        {
          text: "İsim - Soyisim",
          value: "NAMEV",
          sortable: false,
        },
        {
          text: "Mail Adresi",
          value: "SMTP_ADDR",
          sortable: false,
        },
        {
          text: "Telefon No",
          value: "TELF1",
          sortable: false,
        },
        {
          text: "Mobil Telefon No",
          value: "MOBIL_TEL",
          sortable: false,
        },
      ],
    };
  },

  beforeMount() {
    this.pull_info({
      sup_id: this.$route.fullPath.replace("/sup/", ""),
    });
  },

  computed: {
    ...mapFields("supplierInfo", {
      compSabit: "vendor_info.APPR_TELF1",
      compMobil: "vendor_info.APPR_TELF2",
      compFax: "vendor_info.APPR_TELFX",
      compMail: "vendor_info.APPR_SMTP_ADDR",
      compRESP: "vendor_info.RESP_PERS",
    }),

    ...mapGetters({
      get_type: "getUserType",
      get_info: "supplierInfo/getInfo",
      getLoading: "supplierInfo/getLoading",
      getVAttach: "supplierInfo/getAttach",
    }),

    loading() {
      var loading = this.getLoading;
      return loading;
    },
  },

  methods: {
    ...mapActions({
      pull_info: "supplierInfo/get_info",
      sendRevPerInfo: "supplierInfo/sendRevPerInfo",
      sendRevInfo: "supplierInfo/sendRevInfo",
      sendAttach: "supplierInfo/send_attach",
      deleteAttach: "supplierInfo/del_attach",
      sendApprove: "supplierInfo/sendApprove",
    }),

    pickFile() {
      this.$refs.files.click();
    },

    download(item) {
      debugger;
      var byteString = atob(item.data_content);
      var mimeString = "octet/stream";
      var ab = new ArrayBuffer(byteString.length);
      var ia = new Uint8Array(ab);
      for (var i = 0; i < byteString.length; i++) {
        ia[i] = byteString.charCodeAt(i);
      }
      var bb = new Blob([ab]);
      const downloadLink = document.createElement("a");
      const fileName = item.data_name;
      downloadLink.href = window.URL.createObjectURL(bb); //linkSource;
      downloadLink.download = fileName;
      downloadLink.click();
    },

    deleteItem(item) {
      if (this.get_type === "SUP") {
        this.deleteAttach({
          file: item.doc_type,
          sup_id: this.$route.fullPath.replace("/sup/", ""),
        });
      } else {
        this.$toast.show("Silmek için yetkiniz bulunmamaktadır !", {
          theme: "bubble",
          icon: "cancel",
          type: "error",
          position: "bottom-right",
          duration: 5000,
        });
      }
    },

    handleFilesUpload() {
      var uploadedFiles = this.$refs.files.files;
      var fileReader = new FileReader();
      if (uploadedFiles) {
        for (var i = 0; uploadedFiles.length > i; i++) {
          var uploadedFile = uploadedFiles[i];
          this.fileName = uploadedFile.name;
          fileReader.onloadend = (function (file) {
            return function (onLoadEvent) {
              $nuxt.$store.commit("supplierInfo/updateField", {
                path: "content",
                value: {
                  dataContent: fileReader.result,
                },
              });
            };
          })(uploadedFile);
          fileReader.readAsDataURL(uploadedFile);
          this.selectedFile.push(uploadedFile);
          this.sureDialog = true;
        }
      }
    },

    removeFile() {
      this.selectedFile = [];
      this.sendFile = [];
      this.fileName = "";
      this.sureDialog = false;
    },

    acceptFile() {
      debugger;
      var zcontent = this.$store.state.supplierInfo.content.dataContent;
      var zFile = {
        name: this.selectedFile[0].name,
        size: this.selectedFile[0].size,
        content: zcontent,
      };
      this.sendFile.push(zFile);
      this.selectedFile = [];
      this.fileName = "";
      this.sureDialog = false;
      var yıl = this.attachProp.date.split("-")[0];
      var ay = this.attachProp.date.split("-")[1];
      var gun = this.attachProp.date.split("-")[2];
      this.attachProp.date = gun + "/" + ay + "/" + yıl;
      if (this.sendFile.length > 0) {
        this.sendAttach({
          file: this.sendFile,
          sup_id: this.$route.fullPath.replace("/sup/", ""),
          doc_type: this.attachProp.doc_type,
          date: this.attachProp.date,
        });
      }
      this.sendFile = [];
    },

    perDialogInfo(item) {
      this.perDialog = true;
      this.perInfo.oldnamev = item.NAMEV;
      this.perInfo.oldname1 = item.NAME1;
      this.perInfo.namev = item.APPR_NAMEV;
      this.perInfo.name1 = item.APPR_NAME1;
      this.perInfo.email = item.APPR_SMTP_ADDR;
      this.perInfo.telf = item.APPR_TELF1;
      this.perInfo.mobil = item.APPR_MOBIL_TEL;
      this.perInfo.data = item;
    },

    perInfoSave(item) {
      this.detailedIndex = this.get_info.RESP_PERS.indexOf(item);
      this.sendRevPerInfo({
        DATA: this.get_info,
        NDATA: this.perInfo,
        INDEX: this.detailedIndex,
        sup_id: this.$route.fullPath.replace("/sup/", ""),
      });
      this.perDialog = false;
    },
    revInfoSave() {
      var zaman = new Date();
      var saat = zaman.getHours();
      var dakika = zaman.getMinutes();
      var dd = String(zaman.getDate()).padStart(2, "0");
      var mm = String(zaman.getMonth() + 1).padStart(2, "0");
      var yyyy = zaman.getFullYear();

      var date = dd + "/" + mm + "/" + yyyy;
      var time = saat + ":" + dakika;

      this.sendRevInfo({
        REV_INFO: this.get_info,
        sup_id: this.$route.fullPath.replace("/sup/", ""),
      });
      this.revDialog = false;
    },

    revAcceptButton(item) {
      this.sendApprove({ DATA: this.get_info, ACTION: "APPROVE" });
      this.perDialog = false;
    },

    revRejectButton(item) {
      this.sendApprove({ DATA: this.get_info, ACTION: "REJECT" });
      this.perDialog = false;
    },
  },
};
</script>
