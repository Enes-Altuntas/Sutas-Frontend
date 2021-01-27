<template>
  <v-navigation-drawer dark fixed clipped app expand-on-hover width="500">
    <v-list-item class="px-2" dense>
      <v-list-item-avatar>
        <img src="../static/avatar.png" />
      </v-list-item-avatar>
      <v-list-item-title
        >{{ getUserInfo }} - {{ getUserTypeDesc }}</v-list-item-title
      >
    </v-list-item>
    <v-divider></v-divider>
    <v-list dense>
      <v-toolbar flat class="transparent">
        <v-dialog
          v-model="showSelected"
          max-width="400px"
          @keydown.esc="exit"
          persistent
        >
          <v-card>
            <v-toolbar dark>
              <v-toolbar-title>Seçilen Filtreler</v-toolbar-title>
              <v-spacer></v-spacer>
              <v-icon @click="exit">clear</v-icon>
            </v-toolbar>
            <v-card-text>
              <v-container grid-list-md>
                <v-layout wrap>
                  <v-flex xs12 v-if="this.selectedEBELN.length > 0">
                    <div class="title">Sipariş Numaraları</div>
                    <v-divider class="mb-2" horizontal></v-divider>
                  </v-flex>
                  <v-flex
                    xs12
                    class="title"
                    v-for="(item, i) in selectedEBELN"
                    :key="'A' + i"
                  >
                    <v-input
                      @click:append="deleteSelectEBELN(i)"
                      append-icon="delete_outline"
                      >{{ i + 1 }} - {{ item }}</v-input
                    >
                  </v-flex>
                  <v-flex xs12 v-if="this.selectedEBELP.length > 0">
                    <div class="title">Sipariş Kalemleri</div>
                    <v-divider class="mb-2" horizontal></v-divider>
                  </v-flex>
                  <v-flex
                    xs12
                    class="title"
                    v-for="(item, i) in selectedEBELP"
                    :key="'A' + i"
                  >
                    <v-input
                      @click:append="deleteSelectEBELP(i)"
                      append-icon="delete_outline"
                      >{{ i + 1 }} - {{ item }}</v-input
                    >
                  </v-flex>
                  <v-flex xs12 v-if="this.selectedLIFNR.length > 0">
                    <div class="title">Tedarikçi Numaraları</div>
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
                  <v-flex xs12 v-if="this.selectedMATNR.length > 0">
                    <div class="title">Malzeme Kodları</div>
                    <v-divider class="mb-2" horizontal></v-divider>
                  </v-flex>
                  <v-flex
                    xs12
                    class="title"
                    v-for="(item, i) in selectedMATNR"
                    :key="'A' + i"
                  >
                    <v-input
                      @click:append="deleteSelectMATNR(i)"
                      append-icon="delete_outline"
                      >{{ i + 1 }} - {{ item }}</v-input
                    >
                  </v-flex>
                  <v-flex xs12 v-if="this.selectedWERKS.length > 0">
                    <div class="title">Üretim Yerleri</div>
                    <v-divider class="mb-2" horizontal></v-divider>
                  </v-flex>
                  <v-flex
                    xs12
                    class="title"
                    v-for="(item, i) in selectedWERKS"
                    :key="'B' + i"
                  >
                    <v-input
                      @click:append="deleteSelectWERKS(i)"
                      append-icon="delete_outline"
                      >{{ i + 1 }} - {{ item }}</v-input
                    >
                  </v-flex>
                  <v-flex xs12 v-if="this.selectedEKGRP.length > 0">
                    <div class="title">Satınalma Grupları</div>
                    <v-divider class="mb-2" horizontal></v-divider>
                  </v-flex>
                  <v-flex
                    xs12
                    class="title"
                    v-for="(item, i) in selectedEKGRP"
                    :key="'C' + i"
                  >
                    <v-input
                      @click:append="deleteSelectEKGRP(i)"
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
          v-model="findDialog"
          persistent
          max-width="1200px"
          @keydown.esc="findDialog = false"
        >
          <v-card>
            <v-toolbar color="indexToolbar" dark>
              <v-toolbar-title>Diğer Siparişler</v-toolbar-title>
              <v-spacer></v-spacer>
              <v-icon @click="findDialog = false">clear</v-icon>
            </v-toolbar>
            <v-card-text>
              <v-container fluid grid-list-md>
                <v-layout wrap>
                  <v-flex xs12 class="mb-4">
                    <span class="uyarı">
                      <strong
                        >*** Tedarikçi Numarası , Malzeme Kodu , Sipariş
                        Numarası , Sipariş Kalemi , Üretim Yeri , Satınalma
                        Grubu</strong
                      >
                      gibi alanlarda birden fazla seçim yapmak için yazdıktan
                      sonra <strong>"+"</strong> tuşuna basınız.
                    </span>
                  </v-flex>
                  <v-flex xs12 class="mb-4">
                    <span class="uyarı">
                      <strong>***</strong> Seçtiğiniz alanları görmek için alana
                      ait kutucuğa <strong>"ÇİFT TIKLAYINIZ"</strong>.
                    </span>
                  </v-flex>
                  <v-flex xs12>
                    <h2>Sipariş Filtreleri</h2>
                    <v-flex xs12>
                      <v-divider class="mb-3" horizontal></v-divider>
                    </v-flex>
                    <v-layout wrap>
                      <v-flex xs12>
                        <v-text-field
                          @dblclick="showSelected = true"
                          v-model="editedEBELN"
                          clearable
                          counter
                          maxlength="10"
                          append-icon="add"
                          @click:append="selectEBELN"
                          outline
                          label="Sipariş Numarası"
                        ></v-text-field>
                      </v-flex>
                      <v-flex xs12>
                        <v-text-field
                          @dblclick="showSelected = true"
                          clearable
                          counter
                          maxlength="5"
                          v-model="editedEBELP"
                          append-icon="add"
                          @click:append="selectEBELP"
                          outline
                          label="Sipariş Kalemi"
                        ></v-text-field>
                      </v-flex>
                      <v-flex xs12>
                        <v-text-field
                          clearable
                          @dblclick="showSelected = true"
                          counter
                          maxlength="3"
                          v-model="editedEKGRP"
                          append-icon="add"
                          @click:append="selectEKGRP"
                          outline
                          label="Satın Alma Grubu"
                        ></v-text-field>
                      </v-flex>
                      <v-flex xs12>
                        <v-text-field
                          clearable
                          @dblclick="showSelected = true"
                          counter
                          maxlength="4"
                          v-model="editedWERKS"
                          append-icon="add"
                          @click:append="selectWERKS"
                          outline
                          label="Üretim Yeri"
                        ></v-text-field>
                      </v-flex>
                      <v-flex xs12>
                        <v-text-field
                          clearable
                          counter
                          @dblclick="showSelected = true"
                          maxlength="18"
                          v-model="editedLIFNR"
                          append-icon="add"
                          @click:append="selectLIFNR"
                          outline
                          label="Satıcı Numarası"
                        ></v-text-field>
                      </v-flex>
                      <v-flex xs12>
                        <v-text-field
                          clearable
                          counter
                          @dblclick="showSelected = true"
                          maxlength="12"
                          v-model="editedMATNR"
                          append-icon="add"
                          @click:append="selectMATNR"
                          outline
                          label="Malzeme Kodu"
                        ></v-text-field>
                      </v-flex>
                      <v-flex xs12>
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
                              v-model="editedBEDAT"
                              label="Belge Tarihi"
                              prepend-icon="mdi-calendar"
                              readonly
                              v-bind="attrs"
                              v-on="on"
                            ></v-text-field>
                          </template>
                          <v-date-picker
                            color="green lighten-1"
                            light
                            v-model="editedBEDAT"
                            @input="menu = false"
                            locale="tr-TR"
                          ></v-date-picker>
                        </v-menu>
                      </v-flex>
                    </v-layout>
                  </v-flex>
                  <v-flex xs12>
                    <v-data-table
                      :headers="headers"
                      :items="po_list"
                      item-key="ID"
                      :items-per-page="5"
                      class="elevation-1"
                      :footer-props="{
                        'items-per-page-text': 'Sayfa Başına Sipariş',
                      }"
                    >
                      <template v-slot:[`item.BEDAT`]="{ item }">{{
                        dateFormatted(item.BEDAT)
                      }}</template>
                    </v-data-table>
                  </v-flex>
                  <v-btn block @click="findPo()" color="success">Ara</v-btn>
                </v-layout>
              </v-container>
            </v-card-text>
          </v-card>
        </v-dialog>
      </v-toolbar>
      <v-list-item
        v-for="item in staticButton"
        :key="item.title"
        :to="item.url"
        active-class="default-class"
        class="hidden-md-and-up"
      >
        <v-list-item-action>
          <v-icon>{{ item.icon }}</v-icon>
        </v-list-item-action>
        <v-list-item-title>{{ item.title }}</v-list-item-title>
      </v-list-item>

      <v-list-group
        v-for="(item, i) in openedModules"
        :key="i"
        no-action
        :prepend-icon="item.icon"
      >
        <template v-slot:activator>
          <v-list-item-content>
            <v-list-item-title>{{ item.description }}</v-list-item-title>
          </v-list-item-content>
        </template>

        <v-list-item
          v-for="(subItem, i) in item.subMenu"
          :key="'A' + i"
          :to="subItem.url"
        >
          <v-list-item-icon
            ><v-icon :color="subItem.color">{{
              subItem.icon
            }}</v-icon></v-list-item-icon
          >
          <v-list-item-title>{{ subItem.description }}</v-list-item-title>
        </v-list-item>
      </v-list-group>

      <v-list-item link @click="findDialog = true">
        <v-list-item-action>
          <v-icon>search</v-icon>
        </v-list-item-action>
        <v-list-item-title>Siparişin Güncel Durumu</v-list-item-title>
      </v-list-item>

      <v-list-item
        v-for="(item, i) in withoutSub"
        :key="'B' + i"
        active-class="default-class"
        :prepend-icon="item.icon"
        :to="item.url"
      >
        <v-list-item-icon>
          <v-icon>{{ item.icon }}</v-icon>
        </v-list-item-icon>
        <v-list-item-title :color="item.color">{{
          item.description
        }}</v-list-item-title>
      </v-list-item>

      <v-list-item
        active-class="default-class"
        class="hidden-md-and-up"
        @click="logout"
      >
        <v-list-item-action>
          <v-icon>account_circle</v-icon>
        </v-list-item-action>
        <v-list-item-title>Çıkış Yap</v-list-item-title>
      </v-list-item>
    </v-list>
  </v-navigation-drawer>
</template>
<style></style>
<script>
import { mapFields, mapMultiRowFields } from "vuex-map-fields";
import { mapActions, mapGetters } from "vuex";

export default {
  data() {
    return {
      findDialog: false,
      menu: false,
      showSelected: false,
      editedEBELN: undefined,
      editedEBELP: undefined,
      editedMATNR: undefined,
      editedEKGRP: undefined,
      editedLIFNR: undefined,
      editedWERKS: undefined,
      editedBEDAT: undefined,
      selectedEBELN: [],
      selectedEBELP: [],
      selectedEKGRP: [],
      selectedLIFNR: [],
      selectedMATNR: [],
      selectedWERKS: [],
      headers: [
        {
          text: "Sipariş Numarası",
          value: "EBELN",
          sortable: false,
        },
        {
          text: "Sipariş Kalemi",
          value: "EBELP",
          sortable: false,
        },
        {
          text: "Satıcı Numarası",
          value: "LIFNR",
          sortable: false,
        },
        {
          text: "Malzeme Kodu",
          value: "EKPO_MATNR",
          sortable: false,
        },
        {
          text: "Üretim Yeri",
          value: "WERKS",
          sortable: false,
        },
        {
          text: "Satınalma Grubu",
          value: "EKGRP",
          sortable: false,
        },
        {
          text: "Sipariş Tarihi",
          value: "BEDAT",
          sortable: false,
        },
        {
          text: "Sipariş Durumu",
          value: "LOG_TAB_TEXT",
          sortable: false,
        },
      ],
    };
  },
  computed: {
    ...mapFields({
      compSideNav: "sideNav",
    }),
    ...mapGetters({
      sideNav: "getSideNav",
    }),
    ...mapMultiRowFields({
      openedModules: "openedModules",
      withoutSub: "withoutSub",
      staticButton: "staticButton",
    }),
    ...mapGetters({
      getUserInfo: "getUserInfo",
      getUserType: "getUserType",
      getUserTypeDesc: "getUserTypeDesc",
      po_list: "getFindPo",
    }),
  },
  methods: {
    ...mapActions({
      logout: "logout",
      sendFilterPo: "sendFilterPo",
      cleanTable: "cleanTable",
    }),

    selectEBELN() {
      if (this.editedEBELN != "") {
        this.selectedEBELN.push(this.editedEBELN);
        this.editedEBELN = "";
      }
    },
    selectEBELP() {
      if (this.editedEBELP != "") {
        this.selectedEBELP.push(this.editedEBELP);
        this.editedEBELP = "";
      }
    },
    selectMATNR() {
      if (this.editedMATNR != "") {
        this.selectedMATNR.push(this.editedMATNR);
        this.editedMATNR = "";
      }
    },
    selectEKGRP() {
      if (this.editedEKGRP != "") {
        this.selectedEKGRP.push(this.editedEKGRP);
        this.editedEKGRP = "";
      }
    },
    selectLIFNR() {
      if (this.editedLIFNR != "") {
        this.selectedLIFNR.push(this.editedLIFNR);
        this.editedLIFNR = "";
      }
    },
    selectWERKS() {
      if (this.editedWERKS != "") {
        this.selectedWERKS.push(this.editedWERKS);
        this.editedWERKS = "";
      }
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
    deleteSelectEBELP(id) {
      this.selectedEBELP.splice(id, 1);
    },
    deleteSelectEKGRP(id) {
      this.selectedEKGRP.splice(id, 1);
    },
    deleteSelectWERKS(id) {
      this.selectedWERKS.splice(id, 1);
    },

    exit() {
      this.showSelected = false;
      this.cleanTable();
    },

    findPo() {
      var poFilter = {
        EBELN: this.selectedEBELN,
        EBELP: this.selectedEBELP,
        WERKS: this.selectedWERKS,
        LIFNR: this.selectedLIFNR,
        MATNR: this.selectedMATNR,
        EKGRP: this.selectedEKGRP,
        BEDAT: this.editedBEDAT,
      };
      this.sendFilterPo({ DATA: poFilter });
    },
  },
};
</script>
