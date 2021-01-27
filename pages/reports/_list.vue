<template>
  <div class="arka">
    <div class="loading-page" v-if="loading">
      <div class="lds-hourglass"></div>
    </div>
    <v-toolbar dark color="#1B5E20">
      <v-toolbar-title>
        {{ pageDetail.pageName }}
      </v-toolbar-title>
      <v-spacer></v-spacer>
      <v-btn rounded class="mr-2" @click="filterDialog = true">
        <v-icon class="mr-2">filter_list</v-icon>Filtrele
      </v-btn>
      <v-btn rounded class="mr-2" @click="getReportsDB">
        <v-icon class="mr-2">search</v-icon>Ara
      </v-btn>
      <v-btn
        rounded
        class="mr-2"
        @click="excelExport(csvData, pageDetail.pageName)"
      >
        <v-icon class="mr-2">arrow_downward</v-icon>Excel
      </v-btn>
      <v-btn rounded class="mr-2" @click="clean()">
        <v-icon class="mr-2">delete_sweep</v-icon>Temizle
      </v-btn>
      <v-dialog
        v-model="showSelected"
        max-width="400px"
        @keydown.esc="showSelected = false"
        persistent
      >
        <v-card>
          <v-toolbar dark>
            <v-toolbar-title>Seçenekler</v-toolbar-title>
            <v-spacer></v-spacer>
            <v-icon @click="showSelected = false">clear</v-icon>
          </v-toolbar>
          <v-card-text>
            <v-container grid-list-md>
              <v-layout wrap>
                <v-flex xs12 v-if="this.selectedLIFNR.length > 0">
                  <div class="title">Tedarikçi Numaraları</div>
                </v-flex>
                <v-flex v-if="this.selectedLIFNR.length > 0">
                  <v-divider class="mb-2" horizontal></v-divider>
                </v-flex>
                <v-flex
                  xs12
                  class="title"
                  v-for="(item, i) in selectedLIFNR"
                  :key="'A' + i"
                >
                  <v-input
                    @click:append="deleteSelectLIFNR(i)"
                    append-icon="delete_outline"
                    >{{ i + 1 }} - {{ item }}</v-input
                  >
                </v-flex>
                <v-flex xs12 v-if="this.selectedEBELN.length > 0">
                  <div class="title">Sipariş Numaraları</div>
                </v-flex>
                <v-flex v-if="this.selectedEBELN.length > 0">
                  <v-divider class="mb-2" horizontal></v-divider>
                </v-flex>
                <v-flex
                  xs12
                  class="title"
                  v-for="(item, i) in selectedEBELN"
                  :key="'B' + i"
                >
                  <v-input
                    @click:append="deleteSelectEBELN(i)"
                    append-icon="delete_outline"
                    >{{ i + 1 }} - {{ item }}</v-input
                  >
                </v-flex>
                <v-flex xs12 v-if="this.selectedMATNR.length > 0">
                  <div class="title">Malzeme Kodları</div>
                </v-flex>
                <v-flex v-if="this.selectedMATNR.length > 0">
                  <v-divider class="mb-2" horizontal></v-divider>
                </v-flex>
                <v-flex
                  xs12
                  class="title"
                  v-for="(item, i) in selectedMATNR"
                  :key="'C' + i"
                >
                  <v-input
                    @click:append="deleteSelectMATNR(i)"
                    append-icon="delete_outline"
                    >{{ i + 1 }} - {{ item }}</v-input
                  >
                </v-flex>
              </v-layout>
            </v-container>
          </v-card-text>
          <v-card-actions>
            <v-spacer></v-spacer>
          </v-card-actions>
        </v-card>
      </v-dialog>
      <v-dialog
        v-model="filterDialog"
        max-width="1200px"
        @keydown.esc="filterDialog = false"
        persistent
      >
        <v-form ref="form">
          <v-card color="supBack">
            <v-toolbar dark>
              <v-toolbar-title>Filtre Seçenekleri</v-toolbar-title>
              <v-spacer></v-spacer>
              <v-icon @click="filterDialog = false">clear</v-icon>
            </v-toolbar>
            <v-card-text>
              <v-container fluid grid-list-md>
                <v-layout wrap>
                  <v-flex xs12 class="mb-4">
                    <span class="uyarı">
                      <strong
                        >*** Tedarikçi Numarası , Malzeme Kodu , Sipariş
                        Numarası</strong
                      >
                      gibi alanlarda birden fazla seçim yapmak için yazdıktan
                      sonra <strong>"ENTER"</strong> tuşuna basınız.
                    </span>
                  </v-flex>
                  <v-flex xs12 class="mb-4">
                    <span class="uyarı">
                      <strong>***</strong> Seçtiğiniz alanları görmek için alana
                      ait kutucuğa <strong>"ÇİFT TIKLAYINIZ"</strong>.
                    </span>
                  </v-flex>
                  <v-flex
                    xs4
                    v-if="this.$route.fullPath === '/reports/revreport'"
                  >
                    <h2>Revizyon Filtreleri</h2>
                    <v-flex xs12>
                      <v-divider class="mb-3" horizontal></v-divider>
                    </v-flex>
                    <v-layout wrap>
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
                              v-model="editedRDATES"
                              label="Revizyon Tarihi (Başlangıç)"
                              prepend-icon="mdi-calendar"
                              readonly
                              v-bind="attrs"
                              v-on="on"
                            ></v-text-field>
                          </template>
                          <v-date-picker
                            color="green lighten-1"
                            light
                            locale="tr-TR"
                            v-model="editedRDATES"
                            @input="menu = false"
                          ></v-date-picker>
                        </v-menu>
                      </v-flex>
                      <v-flex xs6>
                        <v-menu
                          v-model="menu1"
                          :close-on-content-click="false"
                          :nudge-right="40"
                          transition="scale-transition"
                          offset-y
                          min-width="290px"
                        >
                          <template v-slot:activator="{ on, attrs }">
                            <v-text-field
                              v-model="editedRDATEF"
                              label="Revizyon Tarihi (Bitiş)"
                              prepend-icon="mdi-calendar"
                              readonly
                              v-bind="attrs"
                              v-on="on"
                            ></v-text-field>
                          </template>
                          <v-date-picker
                            color="green lighten-1"
                            light
                            v-model="editedRDATEF"
                            locale="tr-TR"
                            @input="menu1 = false"
                          ></v-date-picker>
                        </v-menu>
                      </v-flex>
                      <v-flex xs6>
                        <v-select
                          clearable
                          :items="who"
                          item-text="yazi"
                          item-value="numara"
                          v-model="editedBY"
                          outline
                          label="Revizyon Talep Eden"
                        ></v-select>
                      </v-flex>
                      <v-flex xs6>
                        <v-select
                          clearable
                          :items="why"
                          item-text="yazi1"
                          item-value="numara1"
                          v-model="editedWHY"
                          outline
                          label="Revizyon Nedeni"
                        ></v-select>
                      </v-flex>
                    </v-layout>
                  </v-flex>
                  <v-flex
                    xs4
                    v-if="this.$route.fullPath === '/reports/spreport'"
                  >
                    <h2>Tarih Filtreleri</h2>
                    <v-flex xs12>
                      <v-divider class="mb-3" horizontal></v-divider>
                    </v-flex>
                    <v-layout wrap>
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
                              v-model="editedEINDTS"
                              label="Onaylı Sipariş Teslim Tarihi (Başlangıç)"
                              prepend-icon="mdi-calendar"
                              readonly
                              v-bind="attrs"
                              v-on="on"
                            ></v-text-field>
                          </template>
                          <v-date-picker
                            color="green lighten-1"
                            light
                            v-model="editedEINDTS"
                            locale="tr-TR"
                            @input="menu2 = false"
                          ></v-date-picker>
                        </v-menu>
                      </v-flex>
                      <v-flex xs6>
                        <v-menu
                          v-model="menu3"
                          :close-on-content-click="false"
                          :nudge-right="40"
                          transition="scale-transition"
                          offset-y
                          min-width="290px"
                        >
                          <template v-slot:activator="{ on, attrs }">
                            <v-text-field
                              v-model="editedEINDTF"
                              label="Onaylı Sipariş Teslim Tarihi (Bitiş)"
                              prepend-icon="mdi-calendar"
                              readonly
                              v-bind="attrs"
                              v-on="on"
                            ></v-text-field>
                          </template>
                          <v-date-picker
                            color="green lighten-1"
                            light
                            v-model="editedEINDTF"
                            locale="tr-TR"
                            @input="menu3 = false"
                          ></v-date-picker>
                        </v-menu>
                      </v-flex>
                      <v-flex xs6>
                        <v-menu
                          v-model="menu4"
                          :close-on-content-click="false"
                          :nudge-right="40"
                          transition="scale-transition"
                          offset-y
                          min-width="290px"
                        >
                          <template v-slot:activator="{ on, attrs }">
                            <v-text-field
                              v-model="editedMGDATES"
                              label="Mal Giriş Kayıt Tarihi (Başlangıç)"
                              prepend-icon="mdi-calendar"
                              readonly
                              v-bind="attrs"
                              v-on="on"
                            ></v-text-field>
                          </template>
                          <v-date-picker
                            color="green lighten-1"
                            light
                            v-model="editedMGDATES"
                            locale="tr-TR"
                            @input="menu4 = false"
                          ></v-date-picker>
                        </v-menu>
                      </v-flex>
                      <v-flex xs6>
                        <v-menu
                          v-model="menu5"
                          :close-on-content-click="false"
                          :nudge-right="40"
                          transition="scale-transition"
                          offset-y
                          min-width="290px"
                        >
                          <template v-slot:activator="{ on, attrs }">
                            <v-text-field
                              v-model="editedMGDATEF"
                              label="Mal Giriş Kayıt Tarihi (Bitiş)"
                              prepend-icon="mdi-calendar"
                              readonly
                              v-bind="attrs"
                              v-on="on"
                            ></v-text-field>
                          </template>
                          <v-date-picker
                            color="green lighten-1"
                            light
                            v-model="editedMGDATEF"
                            locale="tr-TR"
                            @input="menu5 = false"
                          ></v-date-picker>
                        </v-menu>
                      </v-flex>
                    </v-layout>
                  </v-flex>
                  <v-flex xs4>
                    <h2>Sipariş Filtreleri</h2>
                    <v-flex xs12>
                      <v-divider class="mb-3" horizontal></v-divider>
                    </v-flex>
                    <v-layout wrap>
                      <v-flex xs12>
                        <v-text-field
                          @keydown.enter="selectEBELN"
                          @dblclick="showSelected = true"
                          v-model="editedEBELN"
                          clearable
                          counter
                          maxlength="10"
                          outline
                          label="Sipariş Numarası"
                        ></v-text-field>
                      </v-flex>
                      <v-flex xs12>
                        <v-text-field
                          clearable
                          counter
                          maxlength="3"
                          v-model="editedEKGRP"
                          outline
                          label="Satın Alma Grubu"
                        ></v-text-field>
                      </v-flex>
                    </v-layout>
                  </v-flex>
                  <v-flex xs4>
                    <h2>Tedarikçi Filtreleri</h2>
                    <v-flex xs12>
                      <v-divider class="mb-3" horizontal></v-divider>
                    </v-flex>
                    <v-layout wrap>
                      <v-flex xs12>
                        <v-select
                          outline
                          attach
                          chips
                          multiple
                          :items="getUsers"
                          item-text="complete"
                          item-value="user_sys_id"
                          v-model="selectedLIFNR"
                          label="Tedarikçi Numaraları"
                        ></v-select>
                      </v-flex>
                    </v-layout>
                    <v-layout wrap>
                      <v-flex xs12>
                        <v-text-field
                          @keydown.enter="selectMATNR"
                          @dblclick="showSelected = true"
                          v-model="editedMATNR"
                          clearable
                          counter
                          maxlength="18"
                          outline
                          label="Malzeme Kodu"
                        ></v-text-field>
                      </v-flex>
                    </v-layout>
                  </v-flex>
                </v-layout>
              </v-container>
            </v-card-text>
          </v-card>
        </v-form>
      </v-dialog>
      <v-dialog
        v-model="detailDialog"
        max-width="500px"
        @keydown.esc="detailDialog = false"
        persistent
      >
        <v-card>
          <v-toolbar dark>
            <v-toolbar-title>Rapor Detayları</v-toolbar-title>
            <v-spacer></v-spacer>
            <v-icon @click="detailDialog = false">clear</v-icon>
          </v-toolbar>
          <v-card-text>
            <v-container fluid grid-list-md>
              <v-layout wrap>
                <v-flex
                  xs12
                  v-if="this.$route.fullPath === '/reports/revreport'"
                >
                  <v-text-field
                    readonly
                    label="Revizyonu Talep Eden"
                    v-model="detailedItem.LOGTYPE"
                  ></v-text-field>
                </v-flex>
                <v-flex xs12>
                  <v-text-field
                    readonly
                    label="Tedarikçi Kodu ve Adı"
                    v-model="detailedItem.LIFNRandNAME1"
                  ></v-text-field>
                </v-flex>
                <v-flex xs12>
                  <v-text-field
                    readonly
                    label="Malzeme Kodu ve Tanımı"
                    v-model="detailedItem.MATNRandMATKL"
                  ></v-text-field>
                </v-flex>
                <v-flex xs6>
                  <v-text-field
                    readonly
                    label="SAS Numarası"
                    v-model="detailedItem.EBELN"
                  ></v-text-field>
                </v-flex>
                <v-flex xs6>
                  <v-text-field
                    readonly
                    label="Kalem Numarası"
                    v-model="detailedItem.EBELP"
                  ></v-text-field>
                </v-flex>
                <v-flex xs6>
                  <v-text-field
                    readonly
                    label="Satın Alma Grubu"
                    v-model="detailedItem.EKGRP"
                  ></v-text-field>
                </v-flex>
                <v-flex xs6 v-if="this.$route.fullPath === '/reports/spreport'">
                  <v-text-field
                    readonly
                    label="Onaylanmış Teslim Tarihi"
                    v-model="detailedItem.ZEINDT"
                  ></v-text-field>
                </v-flex>
                <v-flex xs6 v-if="this.$route.fullPath === '/reports/spreport'">
                  <v-text-field
                    readonly
                    label="Mal Giriş Tarihi"
                    v-model="detailedItem.CPUDT"
                  ></v-text-field>
                </v-flex>
                <v-flex xs6 v-if="this.$route.fullPath === '/reports/spreport'">
                  <v-text-field
                    readonly
                    id="second"
                    label="Tarih Farkı"
                    v-model="detailedItem.ZMINUS"
                  ></v-text-field>
                </v-flex>
                <v-flex
                  xs6
                  v-if="this.$route.fullPath === '/reports/revreport'"
                >
                  <v-text-field
                    readonly
                    label="Revizyon Talep Tarihi"
                    v-model="detailedItem.LOG_DATUM"
                  ></v-text-field>
                </v-flex>
                <v-flex
                  xs6
                  v-if="this.$route.fullPath === '/reports/revreport'"
                >
                  <v-text-field
                    readonly
                    label="Revizyon Öncesi Üretim Yeri"
                    v-model="detailedItem.WERKS"
                  ></v-text-field>
                </v-flex>
                <v-flex
                  xs6
                  v-if="this.$route.fullPath === '/reports/revreport'"
                >
                  <v-text-field
                    readonly
                    id="second"
                    label="Revizyon Sonrası Üretim Yeri"
                    v-model="detailedItem.ZREVIZYON_WERKS"
                  ></v-text-field>
                </v-flex>
                <v-flex
                  xs6
                  v-if="this.$route.fullPath === '/reports/revreport'"
                >
                  <v-text-field
                    readonly
                    label="Revizyon Öncesi Adet"
                    v-model="detailedItem.MENGE"
                  ></v-text-field>
                </v-flex>
                <v-flex
                  xs6
                  v-if="this.$route.fullPath === '/reports/revreport'"
                >
                  <v-text-field
                    readonly
                    id="second"
                    label="Revizyon Sonrası Adet"
                    v-model="detailedItem.ZREVIZYON_MENGE"
                  ></v-text-field>
                </v-flex>
                <v-flex
                  xs6
                  v-if="this.$route.fullPath === '/reports/revreport'"
                >
                  <v-text-field
                    readonly
                    label="Revizyon Öncesi Teslim Tarihi"
                    v-model="detailedItem.EINDT"
                  ></v-text-field>
                </v-flex>
                <v-flex
                  xs6
                  v-if="this.$route.fullPath === '/reports/revreport'"
                >
                  <v-text-field
                    readonly
                    id="second"
                    label="Revizyon Sonrası Teslim Tarihi"
                    v-model="detailedItem.ZREVIZYON_EINDT"
                  ></v-text-field>
                </v-flex>
                <v-flex xs6 v-if="this.$route.fullPath === '/reports/spreport'">
                  <v-text-field
                    readonly
                    label="Sipariş Adedi"
                    v-model="detailedItem.MENGE"
                  ></v-text-field>
                </v-flex>
                <v-flex xs6 v-if="this.$route.fullPath === '/reports/spreport'">
                  <v-text-field
                    readonly
                    id="second"
                    label="Mal Giriş Adedi"
                    v-model="detailedItem.MGMENGE"
                  ></v-text-field>
                </v-flex>
              </v-layout>
            </v-container>
          </v-card-text>
        </v-card>
      </v-dialog>
    </v-toolbar>
    <v-data-table
      :headers="nHeaders"
      :items="reports"
      hide-default-footer
      :items-per-page="-1"
      class="elevation-15"
    >
      <template v-slot:[`item.EBELN`]="{ item }">{{ item.EBELN }}</template>
      <template v-slot:[`item.EBELP`]="{ item }">{{
        item.EBELP.toString().replace(/\b0+/g, "")
      }}</template>
      <template v-slot:[`item.LIFNR`]="{ item }"
        ><td id="first" @click="showDetail(item)">
          {{ item.LIFNR.toString().replace(/\b0+/g, "") }} - {{ item.NAME1 }}
        </td></template
      >
      <template v-slot:[`item.MATNR`]="{ item }"
        >{{ item.MATNR.toString().replace(/\b0+/g, "") }} -
        {{ item.MATKL }}</template
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

.uyarı {
  color: red;
  font-size: 15px;
}
.back {
  background-color: aqua;
}
#first {
  color: #5ee2ff;
}
#second {
  color: red;
}
</style>
<script>
import { mapFields, mapMultiRowFields } from "vuex-map-fields";
import { mapActions, mapGetters } from "vuex";
export default {
  data() {
    return {
      menu: false,
      menu1: false,
      menu2: false,
      menu3: false,
      menu4: false,
      menu5: false,
      editedMATNR: undefined,
      editedEBELN: undefined,
      editedEKGRP: undefined,
      editedRDATES: undefined,
      editedRDATEF: undefined,
      detailedIndex: undefined,
      editedBY: undefined,
      editedWHY: undefined,
      editedEINDTS: undefined,
      editedEINDTF: undefined,
      editedMGDATES: undefined,
      editedMGDATEF: undefined,
      showSelected: false,
      detailDialog: false,
      filterDialog: false,
      selectedLIFNR: [],
      selectedMATNR: [],
      selectedEBELN: [],
      pageDetail: {
        pageName: "Raporlar",
        pageIcon: undefined,
        pageColor: undefined,
      },
      detailedItem: {
        EBELN: undefined,
        EBELP: undefined,
        LIFNRandNAME1: undefined,
        MATNRandMATKL: undefined,
        EKGRP: undefined,
        ZREVIZYON_MENGE: undefined,
        MENGE: undefined,
        ZREVIZYON_WERKS: undefined,
        WERKS: undefined,
        ZREVIZYON_EINDT: undefined,
        EINDT: undefined,
        LOG_DATUM: undefined,
        CPUDT: undefined,
        ZMINUS: undefined,
        ZEINDT: undefined,
        MGMENGE: undefined,
      },
      why: [
        { yazi1: "Miktar", numara1: "01" },
        { yazi1: "Teslimat Tarihi", numara1: "02" },
        { yazi1: "Üretim Yeri", numara1: "03" },
      ],
      who: [
        { yazi: "Sütaş", numara: "02" },
        { yazi: "Tedarikçi", numara: "01" },
      ],
      nHeaders: [
        {
          text: "Tedarikçi Kodu ve Adı",
          value: "LIFNR",
          sortable: false,
        },
        {
          text: "SAS No",
          value: "EBELN",
          sortable: false,
        },
        {
          text: "Kalem No",
          value: "EBELP",
          sortable: false,
        },
        {
          text: "Satın Alma Grubu",
          value: "EKGRP",
          sortable: false,
        },
        {
          text: "Malzeme Kodu ve Tanımı",
          value: "MATNR",
          sortable: false,
        },
      ],
    };
  },

  watch: {
    "$route.path": function () {
      this.cleanTable();
    },
  },

  created() {
    if (this.$route.fullPath === "/reports/revreport") {
      this.pageDetail.pageName = "Revizyon Raporu";
      this.pageDetail.pageColor = "grey darken-3";
      this.pageDetail.pageIcon = "cached";
    } else {
      this.pageDetail.pageName = "Sipariş Performans Raporu";
      this.pageDetail.pageColor = "grey darken-1";
      this.pageDetail.pageIcon = "build";
    }
  },

  beforeUpdate() {
    if (this.$route.fullPath === "/reports/revreport") {
      this.pageDetail.pageName = "Revizyon Raporu";
      this.pageDetail.pageColor = "grey darken-3";
      this.pageDetail.pageIcon = "cached";
    } else {
      this.pageDetail.pageName = "Sipariş Performans Raporu";
      this.pageDetail.pageIcon = "build";
      this.pageDetail.pageColor = "grey darken-1";
    }
  },

  computed: {
    ...mapGetters({
      getUsers: "getUser",
      reports: "reports/getReports",
      getLoading: "reports/getLoading",
    }),
    loading() {
      var loading = this.getLoading;
      return loading;
    },
    csvData() {
      debugger;
      var excelData = [];
      this.reports.map((item) => {
        if (this.$route.fullPath === "/reports/revreport") {
          var logtype = undefined;
          if (item["LOGTYPE"] === "01") {
            logtype = "Tedarikci";
          } else {
            logtype = "Satinalmaci";
          }

          var cEindt = undefined;
          var cZrevEindt = undefined;

          if (item["EINDT"] === "0000-00-00") {
            cEindt = "";
          } else {
            cEindt = item["EINDT"];
          }

          if (item["ZREVIZYON_EINDT"] === "0000-00-00") {
            cZrevEindt = "";
          } else {
            cZrevEindt = item["ZREVIZYON_WERKS"];
          }

          var excelObject = {
            Revizyonu_Talep_Eden: logtype,
            Malzeme: item["MATNR"].replace(/\b0+/g, "") + " / " + item["MATKL"],
            Tedarikci:
              item["LIFNR"].replace(/\b0+/g, "") + " / " + item["NAME1"],
            Sas_Numarasi: item["EBELN"],
            Kalem_Numarasi: item["EBELP"].replace(/\b0+/g, ""),
            Satinalma_Grubu: item["EKGRP"],
            Revizyon_Talep_Tarihi: item["LOG_DATUM"],
            Revizyon_Oncesi_Uretim_Yeri: item["WERKS"],
            Revizyon_Sonrasi_Uretim_Yeri: item["ZREVIZYON_WERKS"],
            Revizyon_Oncesi_Miktar: item["MENGE"] + " " + item["MEINS"],
            Revizyon_Sonrasi_Miktar:
              item["ZREVIZYON_MENGE"] + " " + item["MEINS"],
            Revizyon_Oncesi_Teslim_Tarihi: cEindt,
            Revizyon_Sonrasi_Teslim_Tarihi: cZrevEindt,
          };
        } else {
          var gun_farki = undefined;
          if (item["CPUDT"] > item["EINDT"]) {
            gun_farki = "- " + item["ZMINUS"];
          } else {
            gun_farki = "+ " + item["ZMINUS"];
          }
          var excelObject = {
            Malzeme: item["MATNR"].replace(/\b0+/g, "") + " / " + item["MATKL"],
            Tedarikci:
              item["LIFNR"].replace(/\b0+/g, "") + " / " + item["NAME1"],
            Sas_Numarasi: item["EBELN"],
            Kalem_Numarasi: item["EBELP"].replace(/\b0+/g, ""),
            Satinalma_Grubu: item["EKGRP"],
            Onaylanmis_Teslim_Tarihi: item["EINDT"],
            Mal_Giris_Tarihi: item["CPUDT"],
            Gun_Farki: gun_farki,
            Siparis_Adedi: item["MENGE"],
            Mal_Giris_Adedi: item["ZREVIZYON_MENGE"],
          };
        }
        excelData.push(excelObject);
      });
      return excelData;
    },
  },

  methods: {
    ...mapActions({
      sendFilter: "reports/sendFilter",
      cleanTable: "reports/cleanTable",
    }),

    selectEBELN() {
      this.selectedEBELN.push(this.editedEBELN);
      this.editedEBELN = "";
    },
    selectMATNR() {
      this.selectedMATNR.push(this.editedMATNR);
      this.editedMATNR = "";
    },

    deleteSelectLIFNR(id) {
      this.selectedLIFNR.splice(id, 1);
    },

    deleteSelectEBELN(id) {
      this.selectedEBELN.splice(id, 1);
    },

    deleteSelectMATNR(id) {
      this.selectedMATNR.splice(id, 1);
    },

    getReportsDB() {
      if (this.$route.fullPath === "/reports/revreport") {
        var reportFilter = {
          EBELN: this.selectedEBELN,
          LIFNR: this.selectedLIFNR,
          MATNR: this.selectedMATNR,
          EKGRP: this.editedEKGRP,
          RDATES: this.editedRDATES,
          RDATEF: this.editedRDATEF,
          BY: this.editedBY,
          WHY: this.editedWHY,
          ACTION: "1",
        };
        if (this.$refs.form.validate()) {
          this.sendFilter({ DATA: reportFilter });
        }
      } else {
        var reportFilter = {
          EBELN: this.selectedEBELN,
          LIFNR: this.selectedLIFNR,
          MATNR: this.selectedMATNR,
          EKGRP: this.editedEKGRP,
          EINDTS: this.editedEINDTS,
          EINDTF: this.editedEINDTF,
          MGDATES: this.editedMGDATES,
          MGDATEF: this.editedMGDATEF,
          ACTION: "2",
        };
        if (this.$refs.form.validate()) {
          this.sendFilter({ DATA: reportFilter });
        }
      }
    },

    clean() {
      this.cleanTable();
    },

    showDetail(item) {
      this.detailDialog = true;
      this.detailedIndex = this.reports.indexOf(item);
      this.detailedItem.MATNRandMATKL =
        this.reports[this.detailedIndex].MATNR.toString().replace(/\b0+/g, "") +
        " - " +
        this.reports[this.detailedIndex].MATKL;
      if (this.reports[this.detailedIndex].CPUDT === "0000-00-00") {
        this.detailedItem.CPUDT = "-";
      } else {
        this.detailedItem.CPUDT = this.dateFormatted(
          this.reports[this.detailedIndex].CPUDT
        );
      }
      if (this.reports[this.detailedIndex].ZMINUS === "0000000000") {
        this.detailedItem.ZMINUS = "-";
      } else {
        this.detailedItem.ZMINUS =
          this.reports[this.detailedIndex].ZMINUS.toString().replace(
            /\b0+/g,
            ""
          ) + " Gün";
      }
      this.detailedItem.ZEINDT = this.dateFormatted(
        this.reports[this.detailedIndex].EINDT
      );
      this.detailedItem.LIFNRandNAME1 =
        this.reports[this.detailedIndex].LIFNR.toString().replace(/\b0+/g, "") +
        " - " +
        this.reports[this.detailedIndex].NAME1;
      this.detailedItem.EBELN = this.reports[this.detailedIndex].EBELN;
      this.detailedItem.EBELP = this.reports[
        this.detailedIndex
      ].EBELP.toString().replace(/\b0+/g, "");
      this.detailedItem.EKGRP = this.reports[this.detailedIndex].EKGRP;
      this.detailedItem.WERKS = this.reports[this.detailedIndex].WERKS;
      this.detailedItem.MENGE =
        this.reports[this.detailedIndex].MENGE +
        " " +
        this.reports[this.detailedIndex].MEINS;
      this.detailedItem.MGMENGE =
        this.reports[this.detailedIndex].ZREVIZYON_MENGE +
        " " +
        this.reports[this.detailedIndex].MEINS;
      this.detailedItem.EINDT = this.dateFormatted(
        this.reports[this.detailedIndex].EINDT
      );
      this.detailedItem.LOG_DATUM = this.dateFormatted(
        this.reports[this.detailedIndex].LOG_DATUM
      );
      this.detailedItem.ZREVIZYON_EINDT = this.dateFormatted(
        this.reports[this.detailedIndex].ZREVIZYON_EINDT
      );
      this.detailedItem.ZREVIZYON_MENGE =
        this.reports[this.detailedIndex].ZREVIZYON_MENGE +
        " " +
        this.reports[this.detailedIndex].MEINS;
      if (this.reports[this.detailedIndex].LOGTYPE === "01") {
        this.detailedItem.LOGTYPE = "Tedarikçi";
      } else {
        this.detailedItem.LOGTYPE = "Sütaş";
      }
    },
  },
};
</script>
