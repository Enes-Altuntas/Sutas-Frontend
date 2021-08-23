<template>
  <div class="arka">
    <div class="loading-page" v-if="loading">
      <div class="lds-hourglass"></div>
    </div>
    <v-toolbar color="green darken-4" dark>
      <v-icon class="mr-2">{{ pageIcon }}</v-icon>
      <div>
        <v-toolbar-title>{{ pageName }}</v-toolbar-title>
      </div>
      <v-spacer></v-spacer>
      <v-divider class="mx-2" inset vertical></v-divider>
      <v-text-field
        v-model="search"
        append-icon="search"
        class="select mr-3"
        label="Arama"
        clearable
        single-line
        hide-details
      ></v-text-field>
      <v-select
        v-if="get_type === 'PUR'"
        clearable
        class="select mr-3"
        v-model="filterSelect.ZWERKS_S"
        :items="getWerks"
        item-text="complete"
        item-value="WERKS"
        label="Sevk Yeri"
      ></v-select>
      <v-select
        v-if="get_type === 'PLA' || get_type === 'PUR' || get_type === 'QTY'"
        clearable
        class="select"
        v-model="filterSelect.ZLIFNR_S"
        :items="getUsers"
        item-text="complete"
        item-value="user_sys_id"
        label="Kullanıcı Seçiniz"
      ></v-select>
      <v-icon
        @click="filter()"
        class="ml-4"
        v-if="get_type === 'PLA' || get_type === 'PUR'"
        >search</v-icon
      >
      <v-icon @click="filterDialog = true" class="ml-4">filter_list</v-icon>
      <v-btn
        class="ml-4"
        rounded
        v-if="get_type === 'SUP' && this.$route.fullPath === '/po/21'"
        @click="road"
        ><v-icon>arrow_upward</v-icon>Sevk Et</v-btn
      >
      <v-btn rounded @click="excelExport(csvData, pageName)" class="ml-4">
        <v-icon>arrow_downward</v-icon>
        Excel
      </v-btn>
      <v-dialog
        v-model="filterDialog"
        persistent
        max-width="700px"
        @keydown.esc="exit"
      >
        <v-card color="supBack">
          <v-toolbar color="indexToolbar" dark>
            <v-toolbar-title>Filtre Seçenekleri</v-toolbar-title>
            <v-spacer></v-spacer>
            <v-icon @click="exit">clear</v-icon>
          </v-toolbar>
          <v-card-text>
            <v-container grid-list-md>
              <v-layout wrap>
                <v-flex xs6>
                  <v-text-field
                    clearable
                    maxlength="10"
                    counter
                    v-model="filterSelect.ZEBELN_S"
                    @change="padZeros(filterSelect.ZEBELN_S, 'ZEBELN_S')"
                    label="SAS NO (Başlangıç)"
                  ></v-text-field>
                </v-flex>
                <v-flex xs5>
                  <v-text-field
                    maxlength="10"
                    clearable
                    counter
                    v-model="filterSelect.ZEBELN_F"
                    @change="padZeros(filterSelect.ZEBELN_F, 'ZEBELN_F')"
                    label="SAS NO (Bitiş)"
                  ></v-text-field>
                </v-flex>
                <v-flex xs5>
                  <v-menu
                    v-model="menu10"
                    :close-on-content-click="false"
                    :nudge-right="40"
                    transition="scale-transition"
                    offset-y
                    min-width="290px"
                  >
                    <template v-slot:activator="{ on, attrs }">
                      <v-text-field
                        v-model="filterSelect.ZBEDAT_S"
                        label="Sipariş Tarihi (Başlangıç))"
                        prepend-icon="mdi-calendar"
                        readonly
                        v-bind="attrs"
                        v-on="on"
                      ></v-text-field>
                    </template>
                    <v-date-picker
                      color="green lighten-1"
                      light
                      v-model="filterSelect.ZBEDAT_S"
                      @input="menu10 = false"
                      locale="tr-TR"
                    ></v-date-picker>
                  </v-menu>
                </v-flex>
                <v-flex xs5 offset-xs1>
                  <v-menu
                    v-model="menu9"
                    :close-on-content-click="false"
                    :nudge-right="40"
                    transition="scale-transition"
                    offset-y
                    min-width="290px"
                  >
                    <template v-slot:activator="{ on, attrs }">
                      <v-text-field
                        v-model="filterSelect.ZBEDAT_F"
                        label="Sipariş Tarihi (Bitiş)"
                        prepend-icon="mdi-calendar"
                        readonly
                        v-bind="attrs"
                        v-on="on"
                      ></v-text-field>
                    </template>
                    <v-date-picker
                      color="green lighten-1"
                      light
                      v-model="filterSelect.ZBEDAT_F"
                      @input="menu9 = false"
                      locale="tr-TR"
                    ></v-date-picker>
                  </v-menu>
                </v-flex>
                <v-flex xs6>
                  <v-text-field
                    v-if="get_type === 'PLA' || get_type === 'PUR'"
                    maxlength="3"
                    clearable
                    counter
                    v-model="filterSelect.ZEKGRP_S"
                    label="Satın Alma Grubu (Başlangıç)"
                  ></v-text-field>
                </v-flex>
                <v-flex xs6>
                  <v-text-field
                    v-if="get_type === 'PLA' || get_type === 'PUR'"
                    maxlength="3"
                    counter
                    clearable
                    v-model="filterSelect.ZEKGRP_F"
                    label="Satın Alma Grubu (Bitiş)"
                  ></v-text-field>
                </v-flex>
                <v-flex xs6>
                  <v-text-field
                    maxlength="10"
                    counter
                    @change="padZeros(filterSelect.ZLIFNR_S, 'ZLIFNR_S')"
                    v-model="filterSelect.ZLIFNR_S"
                    clearable
                    label="Tedarikçi Kodu (Başlangıç)"
                  ></v-text-field>
                </v-flex>
                <v-flex xs6>
                  <v-text-field
                    maxlength="10"
                    clearable
                    counter
                    v-model="filterSelect.ZLIFNR_F"
                    @change="padZeros(filterSelect.ZLIFNR_F, 'ZLIFNR_F')"
                    label="Tedarikçi Kodu (Bitiş)"
                  ></v-text-field>
                </v-flex>
                <v-flex xs6>
                  <v-text-field
                    maxlength="18"
                    counter
                    v-model="filterSelect.ZMATNR_S"
                    clearable
                    @change="padZeros(filterSelect.ZMATNR_S, 'ZMATNR_S')"
                    label="Malzeme Kodu (Başlangıç)"
                  ></v-text-field>
                </v-flex>
                <v-flex xs6>
                  <v-text-field
                    maxlength="18"
                    counter
                    v-model="filterSelect.ZMATNR_F"
                    clearable
                    @change="padZeros(filterSelect.ZMATNR_F, 'ZMATNR_F')"
                    label="Malzeme Kodu (Bitiş)"
                  ></v-text-field>
                </v-flex>
                <v-flex xs5>
                  <v-menu
                    v-model="menu8"
                    :close-on-content-click="false"
                    :nudge-right="40"
                    transition="scale-transition"
                    offset-y
                    min-width="290px"
                  >
                    <template v-slot:activator="{ on, attrs }">
                      <v-text-field
                        v-model="filterSelect.ZEINDT_S"
                        label="Teslim Tarihi (Başlangıç))"
                        prepend-icon="mdi-calendar"
                        readonly
                        v-bind="attrs"
                        v-on="on"
                      ></v-text-field>
                    </template>
                    <v-date-picker
                      color="green lighten-1"
                      light
                      v-model="filterSelect.ZEINDT_S"
                      @input="menu8 = false"
                      locale="tr-TR"
                    ></v-date-picker>
                  </v-menu>
                </v-flex>
                <v-flex xs5 offset-xs1>
                  <v-menu
                    v-model="menu7"
                    :close-on-content-click="false"
                    :nudge-right="40"
                    transition="scale-transition"
                    offset-y
                    min-width="290px"
                  >
                    <template v-slot:activator="{ on, attrs }">
                      <v-text-field
                        v-model="filterSelect.ZEINDT_F"
                        label="Teslim Tarihi (Bitiş)"
                        prepend-icon="mdi-calendar"
                        readonly
                        v-bind="attrs"
                        v-on="on"
                      ></v-text-field>
                    </template>
                    <v-date-picker
                      color="green lighten-1"
                      light
                      v-model="filterSelect.ZEINDT_F"
                      @input="menu7 = false"
                      locale="tr-TR"
                    ></v-date-picker>
                  </v-menu>
                </v-flex>
                <v-flex xs6>
                  <v-text-field
                    maxlength="4"
                    counter
                    clearable
                    v-model="filterSelect.ZWERKS_S"
                    label="Üretim Yeri (Başlangıç)"
                  ></v-text-field>
                </v-flex>
                <v-flex xs6>
                  <v-text-field
                    maxlength="4"
                    clearable
                    counter
                    v-model="filterSelect.ZWERKS_F"
                    label="Üretim Yeri (Bitiş)"
                  ></v-text-field>
                </v-flex>
                <v-flex xs12>
                  <v-btn block color="secondary" @click="filter()"
                    >Filtrele</v-btn
                  >
                </v-flex>
              </v-layout>
            </v-container>
          </v-card-text>
        </v-card>
      </v-dialog>
      <v-dialog v-model="decDescDialog" width="500" @keydown.esc="exit">
        <v-form>
          <v-card>
            <v-card-title>Satın Alma Kararı</v-card-title>
            <v-container>
              <v-textarea
                outline
                clearable
                v-model="zDecDescInfo"
                label="Neden satın alma kararına bırakmaktasınız ?"
                placeholder="Miktar'a karar verilemedi."
              ></v-textarea>
            </v-container>
            <v-card-actions>
              <v-spacer></v-spacer>
              <v-btn color="secondary" @click="sendPurOK()">Gönder</v-btn>
              <v-btn color="error" @click="decDescDialog = false">Çıkış</v-btn>
            </v-card-actions>
          </v-card>
        </v-form>
      </v-dialog>
      <v-dialog v-model="rejDescDialog" width="500" @keydown.esc="exit">
        <v-form>
          <v-card>
            <v-card-title class="headline grey lighten-2" secondary-title
              >Revizyon Reddi</v-card-title
            >
            <v-container>
              <v-textarea
                outline
                clearable
                v-model="zRejDescInfo"
                label="Neden Revizyonu Reddetmektesiniz ?"
                placeholder="Miktar gönderebileceğim adette değildir."
              ></v-textarea>
            </v-container>
            <v-card-actions>
              <v-spacer></v-spacer>
              <v-btn color="secondary" @click="revDeclineOk()">Gönder</v-btn>
              <v-btn color="error" @click="rejDescDialog = false">Çıkış</v-btn>
            </v-card-actions>
          </v-card>
        </v-form>
      </v-dialog>
      <v-dialog v-model="rejPlanDescDialog" width="500" @keydown.esc="exit">
        <v-form>
          <v-card>
            <v-card-title class="headline grey lighten-2" secondary-title
              >Planlama Revizyon Reddi</v-card-title
            >
            <v-container>
              <v-textarea
                outline
                clearable
                v-model="zRejPlanDescInfo"
                label="Neden Revizyonu Reddetmektesiniz ?"
                placeholder="Üretim tarihimize uymamaktadır."
              ></v-textarea>
            </v-container>
            <v-card-actions>
              <v-spacer></v-spacer>
              <v-btn color="secondary" @click="rrevDeclineOk()">Gönder</v-btn>
              <v-btn color="error" @click="rejPlanDescDialog = false"
                >Çıkış</v-btn
              >
            </v-card-actions>
          </v-card>
        </v-form>
      </v-dialog>
      <v-dialog
        v-model="sureDialog"
        persistent
        max-width="290"
        @keydown.esc="removeFile"
      >
        <v-card>
          <v-card-title class="headline">Dosya/Ek Seçimi</v-card-title>
          <v-card-text>
            <v-container grid-list-md>
              <v-layout wrap>
                <v-select
                  :items="docType"
                  v-model="attachProp.doc_type"
                  label="Döküman Tipi"
                ></v-select>
              </v-layout>
            </v-container>
          </v-card-text>
          <v-card-actions>
            <v-spacer></v-spacer>
            <v-btn color="green darken-1" @click="acceptFile()">Kaydet</v-btn>
            <v-btn color="red" @click="removeFile()">Vazgeç</v-btn>
          </v-card-actions>
        </v-card>
      </v-dialog>
      <v-dialog
        v-model="revDialog"
        persistent
        max-width="500px"
        @keydown.esc="exit"
      >
        <v-card color="supBack">
          <v-toolbar color="indexToolbar" dark>
            <v-toolbar-title>Revizyon Değişiklikleri</v-toolbar-title>
            <v-spacer></v-spacer>
            <v-icon @click="exit">clear</v-icon>
          </v-toolbar>
          <v-card-text>
            <v-form ref="revForm" lazy-validation v-model="validRevForm">
              <v-container grid-list-md>
                <v-layout wrap>
                  <v-flex xs12>
                    <span class="headline font-weight-medium"
                      >Revizyon Alanları</span
                    >
                  </v-flex>
                  <v-flex xs12>
                    <v-divider class="mx-1" inset horizontal></v-divider>
                  </v-flex>
                  <v-flex xs6 class="mt-4">
                    <v-menu
                      v-model="rev_deliv_date_menu"
                      :close-on-content-click="false"
                      :nudge-right="40"
                      transition="scale-transition"
                      offset-y
                      min-width="290px"
                    >
                      <template v-slot:activator="{ on, attrs }">
                        <v-text-field
                          v-model="revInfo.rev_deliv_date"
                          label="Revize Teslim Tarihi"
                          prepend-icon="mdi-calendar"
                          readonly
                          v-bind="attrs"
                          v-on="on"
                        ></v-text-field>
                      </template>
                      <v-date-picker
                        color="green lighten-1"
                        light
                        v-model="revInfo.rev_deliv_date"
                        @input="rev_deliv_date_menu = false"
                        locale="tr-TR"
                      ></v-date-picker>
                    </v-menu>
                  </v-flex>
                  <v-flex xs6 class="mt-4">
                    <v-text-field
                      outline
                      v-model="revInfo.rev_quantity"
                      suffix="ADT"
                      label="Rev. Miktar"
                    ></v-text-field>
                  </v-flex>
                  <v-flex xs12>
                    <v-textarea
                      counter
                      maxlength="255"
                      clearable
                      :rules="descRules"
                      v-model="revInfo.rev_desc"
                      outline
                      label="Revizyon isteme sebebiniz ?"
                    ></v-textarea>
                  </v-flex>
                  <v-flex xs12>
                    <v-btn block color="success" @click="revDemandOk()"
                      >Revize Talep Et</v-btn
                    >
                  </v-flex>
                </v-layout>
              </v-container>
            </v-form>
          </v-card-text>
        </v-card>
      </v-dialog>
      <v-dialog
        persistent
        v-model="sevkDialog"
        max-width="1000px"
        @keydown.esc="exit"
      >
        <v-card color="supBack">
          <v-toolbar color="indexToolbar" dark>
            <v-toolbar-title>Sevk Bilgileri</v-toolbar-title>
            <v-spacer></v-spacer>
            <v-icon @click="exit">clear</v-icon>
          </v-toolbar>
          <v-card-text>
            <v-form ref="sevkForm">
              <v-container grid-list-md>
                <v-layout wrap>
                  <v-flex xs12>
                    <v-data-table
                      :headers="headersSevk"
                      :items="roadSelected"
                      :items-per-page="5"
                      class="elevation-1"
                      :footer-props="{
                        'items-per-page-text': 'Sayfa Başına Sipariş',
                      }"
                    >
                      <template v-slot:no-data>
                        <v-alert :value="true" color="error" icon="warning">
                          Sipariş Bulunmamaktadır !
                        </v-alert>
                      </template>
                      <template v-slot:[`item.EBELP`]="{ item }">{{
                        item.EBELP.toString().replace(/\b0+/g, "")
                      }}</template>
                      <template v-slot:[`item.EKPO_MATNR`]="{ item }">{{
                        item.EKPO_MATNR.toString().replace(/\b0+/g, "")
                      }}</template>
                      <template v-slot:[`item.EKPO_MENGE`]="{ item }">{{
                        item.EKPO_MENGE.toString().replace(
                          /(\d)(?=(\d{3})+(?!\d))/g,
                          "$1,"
                        )
                      }}</template>
                      <template v-slot:[`item.REM_MENGE`]="{ item }"
                        ><v-text-field
                          @change="checkLimits(item)"
                          clearable
                          :rules="asnQuanRules"
                          :placeholder="item.REM_MENGE.toString()"
                          suffix="ADT"
                          v-model="item.CASN_QUAN"
                        ></v-text-field
                      ></template>
                      <template v-slot:[`item.actions`]="{ item }">
                        <v-icon @click="deleteASN(item)" color="red">
                          mdi-close-thick
                        </v-icon>
                      </template>
                    </v-data-table>
                  </v-flex>
                  <v-flex xs12>
                    <v-select
                      :items="BusType"
                      item-text="isim"
                      item-value="no"
                      @input="selectBusTypeInfo"
                      v-model="dispatchInfo.busType"
                      :rules="busRules"
                      label="Araç Tipi"
                    ></v-select>
                  </v-flex>
                  <v-flex xs6>
                    <v-text-field
                      counter
                      maxlength="16"
                      clearable
                      v-model="dispatchInfo.billing_no"
                      label="İrsaliye Numarası"
                      :rules="billNoRules"
                    ></v-text-field>
                  </v-flex>
                  <v-flex xs5 offset-xs1>
                    <v-menu
                      v-model="irsaliye_tarihi_menu"
                      :close-on-content-click="false"
                      :nudge-right="40"
                      transition="scale-transition"
                      offset-y
                      min-width="290px"
                    >
                      <template v-slot:activator="{ on, attrs }">
                        <v-text-field
                          v-model="dispatchInfo.billing_date"
                          label="İrsaliye Tarihi"
                          prepend-icon="mdi-calendar"
                          readonly
                          v-bind="attrs"
                          v-on="on"
                        ></v-text-field>
                      </template>
                      <v-date-picker
                        color="green lighten-1"
                        light
                        v-model="dispatchInfo.billing_date"
                        @input="irsaliye_tarihi_menu = false"
                        locale="tr-TR"
                      ></v-date-picker>
                    </v-menu>
                  </v-flex>
                  <v-flex xs12 v-if="this.busVisible">
                    <v-text-field
                      counter
                      maxlength="55"
                      clearable
                      v-model="dispatchInfo.driver_name"
                      label="Sürücü Adı"
                    ></v-text-field>
                  </v-flex>
                  <v-flex xs6 v-if="this.busVisible">
                    <v-text-field
                      counter
                      maxlength="8"
                      clearable
                      v-model="dispatchInfo.plate_no"
                      label="Plaka Kodu"
                      :rules="plateRules"
                    ></v-text-field>
                  </v-flex>
                  <v-flex xs12 v-if="this.busVisible">
                    <v-text-field
                      mask="phone"
                      clearable
                      v-model="dispatchInfo.phone_number"
                      label="Sürücü Telefon No"
                    ></v-text-field>
                  </v-flex>
                  <v-flex xs12>
                    <v-select
                      :items="getWerks"
                      item-text="complete"
                      item-value="WERKS"
                      v-model="dispatchInfo.werks"
                      :rules="werksRules"
                      label="Sevk Yeri"
                    ></v-select>
                  </v-flex>
                  <v-flex xs6>
                    <v-switch
                      readonly
                      color="secondary"
                      v-model="irsaliye"
                      label="İrsaliye Belgesi"
                    ></v-switch>
                  </v-flex>
                  <v-flex xs6>
                    <v-switch
                      readonly
                      color="secondary"
                      v-model="analiz"
                      label="Analiz Belgesi"
                    ></v-switch>
                  </v-flex>
                  <v-flex>
                    <span class="subheading desc">
                      *** Sevk bilgilerini kaydedip sevk işlemi yapabilmek için
                      <strong>"İrsaliye ve Analiz Sertifikası"</strong> eklerini
                      sisteme yüklemek zorunludur.
                    </span>
                  </v-flex>
                  <v-flex xs12 class="mt-4">
                    <span class="headline font-weight-medium"
                      >Ek Yüklemeleri</span
                    >
                  </v-flex>
                  <v-flex xs12>
                    <v-divider class="mx-1" inset horizontal></v-divider>
                  </v-flex>
                  <v-flex
                    xs12
                    class="
                      text-xs-center
                      text-sm-center
                      text-md-center
                      text-lg-center
                    "
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
                  <v-flex xs12 v-if="this.sendFile.length > 0">
                    <span class="headline font-weight-medium"
                      >Yüklenen Ekler</span
                    >
                  </v-flex>
                  <v-flex xs12 v-if="this.sendFile.length > 0">
                    <v-divider class="mx-1" inset horizontal></v-divider>
                  </v-flex>
                  <v-flex
                    xs12
                    v-for="(item, i) in sendFile"
                    :key="i"
                    active-class="default-class"
                  >
                    <span class="subheading"
                      >{{ i + 1 }}) {{ item.name }} ({{ item.size }} KB) ({{
                        item.doc_type
                      }})</span
                    >
                    <v-icon class="ml-2" color="red" @click="deleteFromSend(i)"
                      >delete</v-icon
                    >
                  </v-flex>
                  <v-flex xs12>
                    <v-btn
                      v-if="this.analiz === true && this.irsaliye === true"
                      block
                      color="secondary"
                      @click="roadOk()"
                      >Sevk Bilgilerini Kaydet</v-btn
                    >
                  </v-flex>
                </v-layout>
              </v-container>
            </v-form>
          </v-card-text>
        </v-card>
      </v-dialog>
      <v-dialog
        persistent
        v-model="dispScreen"
        max-width="800px"
        @keydown.esc="exit"
      >
        <v-card color="supBack">
          <v-toolbar dark color="green darken-4">
            <v-toolbar-title>Teslimat Detay Bilgileri</v-toolbar-title>
            <v-spacer></v-spacer>
            <v-icon @click="dispScreen = false">clear</v-icon>
          </v-toolbar>
          <v-divider class="mx-5" horizontal></v-divider>
          <v-card-text>
            <v-container grid-list-md>
              <v-layout wrap>
                <v-flex xs12>
                  <span class="headline font-weight-medium"
                    >Kalem Bilgileri</span
                  >
                </v-flex>
                <v-flex xs12>
                  <v-divider class="mx-1" inset horizontal></v-divider>
                </v-flex>
                <v-flex xs12 lg6>
                  <v-text-field
                    v-model="this.dispScreenData.po_number"
                    label="SAS No"
                    readonly
                  ></v-text-field>
                </v-flex>
                <v-flex xs12 lg6>
                  <v-text-field
                    v-model="this.dispScreenData.po_item"
                    label="Kalem No"
                    readonly
                  ></v-text-field>
                </v-flex>
                <v-flex xs12>
                  <span class="headline font-weight-medium"
                    >Sürücü Bilgileri</span
                  >
                </v-flex>
                <v-flex xs12>
                  <v-divider class="mx-1" inset horizontal></v-divider>
                </v-flex>
                <v-flex xs12 lg6>
                  <v-text-field
                    v-model="this.dispScreenData.driver_name"
                    label="Sürücü Adı"
                    readonly
                  ></v-text-field>
                </v-flex>
                <v-flex xs12 lg6>
                  <v-text-field
                    v-model="this.dispScreenData.driver_no"
                    label="Sürücü Telefon No"
                    readonly
                  ></v-text-field>
                </v-flex>
                <v-flex xs12 lg6>
                  <v-text-field
                    v-model="this.dispScreenData.plate_no"
                    label="Araç Plaka No"
                    readonly
                  ></v-text-field>
                </v-flex>
                <v-flex xs12 lg6>
                  <v-text-field
                    v-model="this.dispScreenData.bus_type"
                    label="Araç Tipi"
                    readonly
                  ></v-text-field>
                </v-flex>
                <v-flex xs12>
                  <span class="headline font-weight-medium"
                    >İrsaliye Bilgileri</span
                  >
                </v-flex>
                <v-flex xs12>
                  <v-divider class="mx-1" inset horizontal></v-divider>
                </v-flex>
                <v-flex xs12 lg6>
                  <v-text-field
                    v-model="this.dispScreenData.billing_no"
                    label="İrsaliye No"
                    readonly
                  ></v-text-field>
                </v-flex>
                <v-flex xs12 lg6>
                  <v-text-field
                    v-model="this.dispScreenData.billing_date"
                    label="İrsaliye Tarihi"
                    readonly
                  ></v-text-field>
                </v-flex>
                <v-flex xs12>
                  <span class="headline font-weight-medium"
                    >Sevk Bilgileri</span
                  >
                </v-flex>
                <v-flex xs12>
                  <v-divider class="mx-1" inset horizontal></v-divider>
                </v-flex>
                <v-flex xs12 lg6>
                  <v-text-field
                    v-model="this.dispScreenData.disp_date"
                    label="Sevk Tarihi"
                    readonly
                  ></v-text-field>
                </v-flex>
                <v-flex xs12 lg6>
                  <v-text-field
                    v-model="this.dispScreenData.disp_place"
                    label="Sevk Yeri"
                    readonly
                  ></v-text-field>
                </v-flex>
                <v-flex xs12 lg6>
                  <v-text-field
                    v-model="this.dispScreenData.quan"
                    label="Sevk Miktarı"
                    readonly
                  ></v-text-field>
                </v-flex>
              </v-layout>
            </v-container>
          </v-card-text>
        </v-card>
      </v-dialog>
      <v-dialog
        persistent
        v-model="detayDialog"
        max-width="800px"
        @keydown.esc="exit"
      >
        <v-card color="supBack">
          <v-toolbar dark color="indexToolbar">
            <v-toolbar-title>SAS Detay Bilgileri</v-toolbar-title>
            <v-spacer></v-spacer>
            <v-icon class="ml-3" @click="exit">clear</v-icon>
          </v-toolbar>
          <v-divider class="mx-5" horizontal></v-divider>
          <v-card-text>
            <v-container grid-list-md>
              <v-layout wrap>
                <v-flex xs12>
                  <span class="headline font-weight-medium">SAS Başlık</span>
                </v-flex>
                <v-flex xs12>
                  <v-divider class="mx-1" inset horizontal></v-divider>
                </v-flex>
                <v-flex xs12 lg6>
                  <v-text-field
                    v-model="detailedItem.po_number"
                    label="Sas No"
                    readonly
                  ></v-text-field>
                </v-flex>
                <v-flex xs12 lg6>
                  <v-text-field
                    v-model="detailedItem.posting_date"
                    label="Sipariş Tarihi"
                    readonly
                  ></v-text-field>
                </v-flex>
                <v-flex
                  xs12
                  lg6
                  v-if="get_type === 'PLA' || get_type === 'PUR'"
                >
                  <v-text-field
                    v-model="detailedItem.purch_group"
                    label="Satın Alma Grubu"
                    readonly
                  ></v-text-field>
                </v-flex>
                <v-flex xs12 lg6>
                  <v-text-field
                    v-model="detailedItem.vendor"
                    label="Tedarikçi Adı ve Kodu"
                    readonly
                  ></v-text-field>
                </v-flex>
                <v-flex
                  xs12
                  lg6
                  v-if="get_type === 'SUP' || get_type === 'PUR'"
                >
                  <v-text-field
                    v-model="detailedItem.payterm"
                    label="Ödeme Vadesi"
                    readonly
                  ></v-text-field>
                </v-flex>
                <v-flex xs12>
                  <span class="headline font-weight-medium" readonly
                    >Kalem Bilgileri</span
                  >
                </v-flex>
                <v-flex xs12>
                  <v-divider class="mx-1" inset horizontal></v-divider>
                </v-flex>
                <v-flex xs12 lg6>
                  <v-text-field
                    v-model="detailedItem.po_item"
                    label="Kalem No"
                    readonly
                  ></v-text-field>
                </v-flex>
                <v-flex xs12 lg6>
                  <v-text-field
                    v-model="detailedItem.eket_deliv"
                    label="Teslim Tarihi"
                    readonly
                  ></v-text-field>
                </v-flex>
                <v-flex xs12 lg6>
                  <v-text-field
                    v-model="detailedItem.spec"
                    label="Şartname No"
                    readonly
                  ></v-text-field>
                </v-flex>
                <v-flex xs12 lg6>
                  <v-text-field
                    v-model="detailedItem.plant"
                    label="Üretim Yeri Tanımı ve Kodu"
                    readonly
                  ></v-text-field>
                </v-flex>
                <v-flex xs12>
                  <v-text-field
                    v-model="detailedItem.mat"
                    label="Malzeme Tanımı ve Kodu"
                    readonly
                  ></v-text-field>
                </v-flex>
                <v-flex xs12 lg6>
                  <v-text-field
                    v-model="detailedItem.quantity"
                    label="Adet - Birim"
                    readonly
                  ></v-text-field>
                </v-flex>
                <v-flex
                  xs12
                  lg6
                  v-if="get_type === 'PUR' || get_type === 'SUP'"
                >
                  <v-text-field
                    v-model="detailedItem.price"
                    label="Fiyat - Birim Fiyat"
                    readonly
                  ></v-text-field>
                </v-flex>
                <v-flex xs12 lg6>
                  <v-text-field
                    v-model="detailedItem.CASN_QUAN"
                    label="Sevkten Kalan Bakiye"
                    readonly
                  ></v-text-field>
                </v-flex>
                <v-flex
                  xs12
                  lg6
                  v-if="get_type === 'PUR' || get_type === 'PLA'"
                >
                  <v-text-field
                    v-model="detailedItem.GR_QUAN"
                    label="Mal Girişinden Kalan Bakiye"
                    readonly
                  ></v-text-field>
                </v-flex>
                <v-flex xs12 lg6>
                  <v-text-field
                    v-if="
                      this.$route.fullPath === '/po/03' ||
                      this.$route.fullPath === '/po/08' ||
                      this.$route.fullPath === '/po/07' ||
                      this.$route.fullPath === '/po/04'
                    "
                    id="second"
                    v-model="detailedItem.zquan"
                    label="Revizyon Miktar"
                    readonly
                  ></v-text-field>
                </v-flex>
                <v-flex xs12 lg6>
                  <v-text-field
                    v-if="
                      this.$route.fullPath === '/po/03' ||
                      this.$route.fullPath === '/po/08' ||
                      this.$route.fullPath === '/po/07' ||
                      this.$route.fullPath === '/po/04'
                    "
                    id="second"
                    v-model="detailedItem.zdeliv"
                    label="Revizyon Tarih"
                    readonly
                  ></v-text-field>
                </v-flex>
                <v-flex xs12 lg6>
                  <v-text-field
                    v-if="this.$route.fullPath === '/po/08'"
                    id="second"
                    v-model="detailedItem.zplace"
                    label="Üretim Yeri"
                    readonly
                  ></v-text-field>
                </v-flex>
                <v-flex xs12>
                  <v-textarea
                    outline
                    v-if="
                      this.$route.fullPath === '/po/03' ||
                      this.$route.fullPath === '/po/07' ||
                      this.$route.fullPath === '/po/04'
                    "
                    id="second"
                    v-model="detailedItem.revDesc"
                    label="Revizyon Sebebi"
                    readonly
                  ></v-textarea>
                </v-flex>
                <v-flex xs12>
                  <v-textarea
                    outline
                    v-if="this.$route.fullPath === '/po/07'"
                    id="second"
                    v-model="detailedItem.decDesc"
                    label="Satın Alma Kararı Sebebi"
                    readonly
                  ></v-textarea>
                </v-flex>
                <v-flex xs12>
                  <v-textarea
                    outline
                    v-if="this.$route.fullPath === '/po/02'"
                    id="second"
                    v-model="detailedItem.rejDesc"
                    label="Sütaş Revizyon Talebi İptal Sebebi"
                    readonly
                  ></v-textarea>
                </v-flex>
                <v-flex xs12>
                  <v-textarea
                    outline
                    v-if="
                      this.$route.fullPath === '/po/02' ||
                      this.$route.fullPath === '/po/01'
                    "
                    id="second"
                    v-model="detailedItem.rejPlanDesc"
                    label="Planlamacı Revizyon Ret Sebebi"
                    readonly
                  ></v-textarea>
                </v-flex>
                <v-flex
                  xs12
                  class="mt-3"
                  v-if="
                    this.$route.fullPath === '/po/05' ||
                    this.$route.fullPath === '/po/09'
                  "
                >
                  <span class="headline font-weight-medium"
                    >Teslimat Bilgileri</span
                  >
                </v-flex>
                <v-flex
                  xs12
                  v-if="
                    this.$route.fullPath === '/po/05' ||
                    this.$route.fullPath === '/po/09'
                  "
                >
                  <v-divider class="mx-1" inset horizontal></v-divider>
                </v-flex>
                <v-flex
                  xs12
                  class="mt-2"
                  v-if="
                    this.$route.fullPath === '/po/05' ||
                    this.$route.fullPath === '/po/09'
                  "
                >
                  <v-data-table
                    :headers="headersDisp"
                    :items="getAsn"
                    item-key="id"
                    :items-per-page="5"
                    @click:row="dispShow"
                    class="elevation-1"
                    :footer-props="{
                      'items-per-page-text': 'Sayfa Başına Sevk Miktarı',
                    }"
                  >
                    <template v-slot:no-data>
                      <v-alert :value="true" color="error" icon="warning">
                        Sevk Edilmiş Sipariş Bulunmamaktadır !
                      </v-alert>
                    </template>
                    <template v-slot:[`item.EBELP`]="{ item }">{{
                      item.EBELP.toString().replace(/\b0+/g, "")
                    }}</template>
                    <template v-slot:[`item.SEVK_TARIHI`]="{ item }">{{
                      dateFormatted(item.SEVK_TARIHI)
                    }}</template>
                  </v-data-table>
                </v-flex>
                <v-flex
                  xs12
                  class="mt-5"
                  v-if="
                    this.$route.fullPath === '/po/05' ||
                    this.$route.fullPath === '/po/09'
                  "
                >
                  <span class="headline font-weight-medium">Ekler</span>
                </v-flex>
                <v-flex
                  xs12
                  v-if="
                    this.$route.fullPath === '/po/05' ||
                    this.$route.fullPath === '/po/09'
                  "
                >
                  <v-divider class="mx-1" inset horizontal></v-divider>
                </v-flex>
                <v-flex
                  xs12
                  class="mt-2"
                  v-if="
                    this.$route.fullPath === '/po/05' ||
                    this.$route.fullPath === '/po/09'
                  "
                >
                  <v-data-table
                    :headers="headersEk"
                    :items="getAttach"
                    item-key="id"
                    :items-per-page="5"
                    class="elevation-1"
                    @click:row="download"
                    :footer-props="{
                      'items-per-page-text': 'Sayfa Başına Ek Miktarı',
                    }"
                  >
                    <template v-slot:no-data>
                      <v-alert :value="true" color="error" icon="warning">
                        Yüklenmiş Ek Bulunmamaktadır !
                      </v-alert>
                    </template>
                    <template v-slot:[`item.data_size`]="{ item }">{{
                      (item.data_size * 0.0009765625).toFixed(2)
                    }}</template>
                    <template v-slot:[`item.date`]="{ item }">{{
                      dateFormatted(item.date)
                    }}</template>
                  </v-data-table>
                </v-flex>
              </v-layout>
            </v-container>
          </v-card-text>
          <v-card-actions>
            <v-spacer></v-spacer>
            <v-btn
              v-if="get_type === 'SUP' && this.$route.fullPath === '/po/01'"
              color="success"
              @click="poAccept"
              >Siparişi Onayla</v-btn
            >
            <v-btn
              v-if="get_type === 'SUP' && this.$route.fullPath === '/po/01'"
              color="error"
              @click="revDemand"
              >Revizyon Talep Et</v-btn
            >
            <v-btn
              v-if="get_type === 'SUP' && this.$route.fullPath === '/po/08'"
              color="secondary"
              @click="revAccept"
              >Revizyonu Onayla</v-btn
            >
            <v-btn
              v-if="get_type === 'SUP' && this.$route.fullPath === '/po/08'"
              color="error"
              @click="revDecline"
              >Revizyon Reddet</v-btn
            >
            <v-btn
              v-if="get_type === 'SUP' && this.$route.fullPath === '/po/06'"
              color="secondary"
              @click="decDecline"
              >İptal Kabulü</v-btn
            >
            <v-btn
              v-if="get_type === 'SUP' && this.$route.fullPath === '/po/06'"
              color="secondary"
              @click="decAccept"
              >İptal Reddi</v-btn
            >
            <v-btn
              v-if="get_type === 'PUR' && this.$route.fullPath === '/po/07'"
              color="secondary"
              @click="krevDecline"
              >Revizyon İptali</v-btn
            >
            <v-btn
              v-if="get_type === 'PUR' && this.$route.fullPath === '/po/07'"
              color="error"
              @click="kpoDecline"
              >Sipariş İptali</v-btn
            >
            <v-btn
              v-if="get_type === 'PLA' && this.$route.fullPath === '/po/03'"
              color="success"
              @click="rrevAccept"
              >Revizyon Kabul</v-btn
            >
            <v-btn
              v-if="get_type === 'PLA' && this.$route.fullPath === '/po/03'"
              color="error"
              @click="rrevDecline"
              >Revizyon Ret</v-btn
            >
            <v-btn
              v-if="get_type === 'PLA' && this.$route.fullPath === '/po/03'"
              color="secondary"
              @click="sendPur"
              >Mutabık Kalınmamış Siparişlere Aktar</v-btn
            >
            <v-btn
              v-if="get_type === 'SUP' && this.$route.fullPath === '/po/02'"
              color="secondary"
              @click="revDemand"
              >Revizyon Talep Et</v-btn
            >
          </v-card-actions>
        </v-card>
      </v-dialog>
    </v-toolbar>
    <v-data-table
      v-model="selected"
      :headers="headers"
      :items="po_list"
      :search="search"
      class="elevation-1"
      :show-select="show_select"
      item-key="ID"
      :items-per-page="15"
      :footer-props="{
        'items-per-page-text': 'Sayfa Başına Sipariş',
      }"
      @click:row="detay"
    >
      <template v-slot:no-data>
        <v-alert :value="true" color="error" icon="warning">
          Sipariş Bulunmamaktadır !
        </v-alert>
      </template>
      <template v-slot:[`item.EBELN`]="{ item }"
        ><td>{{ item.EBELN }}</td></template
      >
      <template v-slot:[`item.EBELP`]="{ item }">{{
        item.EBELP.toString().replace(/\b0+/g, "")
      }}</template>
      <template v-slot:[`item.LIFNR`]="{ item }">{{
        item.LIFNR.toString().replace(/\b0+/g, "")
      }}</template>
      <template v-slot:[`item.EKPO_MATNR`]="{ item }">{{
        item.EKPO_MATNR.toString().replace(/\b0+/g, "")
      }}</template>
      <template v-slot:[`item.BEDAT`]="{ item }">{{
        dateFormatted(item.BEDAT)
      }}</template>
      <template v-slot:[`item.MENGE_REM`]="{ item }"
        ><v-chip
          :color="getColorMenge(item.EKPO_MENGE, item.EKPO_CASN_QUAN)"
          light
          >{{
            (item.EKPO_MENGE - item.EKPO_CASN_QUAN)
              .toFixed(2)
              .toString()
              .replace(/(\d)(?=(\d{3})+(?!\d))/g, "$1,")
          }}
          {{ item.EKPO_MEINS_T }}</v-chip
        ></template
      >
      <template v-slot:[`item.EKPO_MENGE_MEINS`]="{ item }"
        >{{
          item.EKPO_MENGE.toFixed(2)
            .toString()
            .replace(/(\d)(?=(\d{3})+(?!\d))/g, "$1,")
        }}
        {{ item.EKPO_MEINS_T }}</template
      >
      <template v-slot:[`item.EKET_EINDT`]="{ item }"
        ><v-chip :color="getColorDate(item.EKET_EINDT)" light>{{
          dateFormatted(item.EKET_EINDT)
        }}</v-chip></template
      >
      <template v-slot:[`item.EKPO_WERKS_DESC`]="{ item }"
        >{{ item.EKPO_WERKT }} ({{ item.EKPO_WERKS }})</template
      >
      <v-alert slot="no-results" :value="true" color="error" icon="secondary"
        >Aradığınız "{{ search }}" değeri bulunamadı.</v-alert
      >
    </v-data-table>
  </div>
</template>

<style>
#first {
  color: #5ee2ff;
}

#second {
  text-decoration: underline;
  color: red;
}
.desc {
  color: red;
}
#third {
  text-decoration: underline;
  color: green;
}
.select {
  height: 40px;
}
.select2 {
  width: 15px;
  height: 60px;
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
import { mask } from "vue-the-mask";

export default {
  directives: {
    mask,
  },
  data() {
    return {
      descRules: [
        (v) => !!v || "Revizyon sebebi alanı zorunludur !",
        (v) =>
          (v && v.length >= 20) ||
          "Açıklamanız minimum 20 karakter olmalıdır !",
      ],
      billNoRules: [(v) => !!v || "İrsaliye numarası alanı zorunludur !"],
      asnQuanRules: [(v) => !!v || "Sevk miktarı alanı zorunludur !"],
      billDateRules: [(v) => !!v || "İrsaliye tarihi alanı zorunludur !"],
      plateRules: [(v) => !!v || "Plaka kodu alanı zorunludur !"],
      busRules: [(v) => !!v || "Araç tipi alanı zorunludur !"],
      werksRules: [(v) => !!v || "Sevk yeri alanı zorunludur !"],
      decDescDialog: false,
      rejDescDialog: false,
      rejPlanDescDialog: false,
      page: 1,
      pageCount: 0,
      busVisible: false,
      poListArray: [],
      pagePath: "",
      zDecDescInfo: "",
      revQuanBefore: "",
      zRejDescInfo: "",
      treeName: undefined,
      treeName2: undefined,
      zPath: undefined,
      irsaliye_tarihi_menu: false,
      zRejPlanDescInfo: "",
      irsaliye: false,
      menu7: false,
      menu8: false,
      show_select: false,
      menu9: false,
      menu10: false,
      analiz: false,
      pageName: "Siparişlerim",
      rev_deliv_date_menu: false,
      pageIcon: undefined,
      check: false,
      vendors: [],
      selectedFile: [],
      validRevForm: true,
      files: [],
      sendFile: [],
      fileName: "",
      sureDialog: false,
      docType: ["İrsaliye", "Analiz Sertifikası", "Diğer"],
      date: null,
      alert: false,
      revDialog: false,
      sevkDialog: false,
      itemsPerPage: 10,
      fromDialog: false,
      treeItems: [],
      geriVar: false,
      ileriVar: false,
      selected: [],
      treeViewArr: [],
      roadSelected: [],
      sevkSelected: [],
      attachRules: {
        irsaliyeAttach: null,
        analizAttach: null,
      },
      schHak: 0,
      search: "",
      detailedIndex: undefined,
      snackbar: true,
      detayDialog: false,
      dispScreen: false,
      filterDialog: false,
      timeout: 6000,
      dispatchInfo: {
        driver_name: undefined,
        billing_no: undefined,
        plate_no: undefined,
        billing_date: undefined,
        phone_number: undefined,
        werks: undefined,
        busType: undefined,
      },
      dropSelect: "",
      BusType: [
        {
          isim: "Tedarikçi Aracı",
          no: "01",
        },
        {
          isim: "Sütaş Aracı",
          no: "02",
        },
        {
          isim: "Kargo",
          no: "03",
        },
      ],
      attachProp: {
        doc_type: undefined,
      },
      filterSelect: {
        ZEBELN_S: "",
        ZEBELN_F: "",
        ZBEDAT_S: undefined,
        ZBEDAT_F: undefined,
        ZEKGRP_S: "",
        ZEKGRP_F: "",
        ZLIFNR_S: "",
        ZLIFNR_F: "",
        ZMATNR_S: "",
        ZMATNR_F: "",
        ZEINDT_S: undefined,
        ZEINDT_F: undefined,
        ZWERKS_S: "",
        ZWERKS_F: "",
      },
      revInfo: {
        rev_deliv_date: undefined,
        rev_quantity: undefined,
        rev_desc: undefined,
      },
      detailedItem: {
        po_number: "",
        topLimit: undefined,
        lowerLimit: undefined,
        vendor: "",
        posting_date: "",
        purch_group: "",
        po_item: "",
        material: "",
        mat_description: "",
        quantity: "",
        price: "",
        plant: "",
        payterm: "",
        eket_deliv: "",
        spec: "",
        zquan: "",
        zdeliv: "",
        zplace: "",
        CASN_QUAN: "",
        GR_QUAN: "",
      },
      dispScreenData: {
        driver_name: "",
        driver_no: "",
        disp_place: "",
        disp_date: "",
        billing_no: "",
        billing_date: "",
        po_number: "",
        po_item: "",
        quan: "",
        bus_type: "",
        plate_no: "",
      },
      headers: [
        {
          text: "SAS Numarası",
          value: "EBELN",
        },
        {
          text: "Kalem No",
          value: "EBELP",
        },
        {
          text: "Sipariş Tarihi",
          value: "BEDAT",
        },
        {
          text: "Tedarikçi Kodu",
          value: "LIFNR",
        },
        {
          text: "Malzeme Kodu",
          value: "EKPO_MATNR",
        },
        {
          text: "Malzeme Açıklama",
          value: "EKPO_MAKTX",
        },
        {
          text: "Miktar / Birim",
          value: "EKPO_MENGE_MEINS",
        },
        {
          text: "Sevk Kalan Bakiye",
          value: "MENGE_REM",
        },
        {
          text: "Teslim Tarihi",
          value: "EKET_EINDT",
        },
        {
          text: "Üretim Yeri Kodu",
          value: "EKPO_WERKS_DESC",
        },
        {
          text: "Şartname Kodu",
          value: "EKPO_ZEINR",
        },
      ],
      headersSevk: [
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
          text: "Malzeme Tanımı",
          value: "EKPO_MAKTX",
          sortable: false,
        },
        {
          text: "Malzeme Numarası",
          value: "EKPO_MATNR",
          sortable: false,
        },
        {
          text: "Miktar",
          value: "EKPO_MENGE",
          sortable: false,
        },
        {
          text: "Sevk Miktarı",
          value: "REM_MENGE",
          sortable: false,
        },
        {
          text: "Sipariş Sil",
          value: "actions",
          sortable: false,
        },
      ],
      headersSevkNew: [
        {
          text: "SAS No",
          value: "EBELN",
          sortable: true,
        },
        {
          text: "Kalem No",
          value: "EBELP",
          sortable: true,
        },
        {
          text: "Malzeme Numarası",
          value: "EKPO_MATNR",
          sortable: true,
        },
        {
          text: "Miktar",
          value: "EKPO_MENGE_MEINS",
          sortable: true,
        },
        {
          text: "Kalan Miktar",
          value: "MENGE_REM",
          sortable: true,
        },
        {
          text: "Teslim Tarihi",
          value: "EKET_EINDT",
          sortable: true,
        },
        {
          text: "Üretim Yeri",
          value: "EKPO_WERKS_DESC",
          sortable: true,
        },
      ],
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
          text: "Ek tarihi",
          value: "date",
          sortable: false,
        },
      ],
      headersDisp: [
        {
          text: "Sas No",
          value: "EBELN",
          sortable: false,
        },
        {
          text: "Kalem No",
          value: "EBELP",
          sortable: false,
        },
        {
          text: "Sevk Tarihi",
          value: "SEVK_TARIHI",
          sortable: false,
        },
      ],
    };
  },

  beforeMount() {
    this.getlist({
      filter: this.$route.fullPath,
      sup_id: this.get_id,
    });
  },

  updated() {
    if (this.$route.fullPath === "/po/01") {
      this.pageName = "Tedarikçi Onayı Bekleyen Siparişler";
      this.pageIcon = "pan_tool";
      this.show_select = false;
    } else if (this.$route.fullPath === "/po/02") {
      this.pageName = "Tedarikçi Tarafından Onaylanan Siparişler";
      this.pageIcon = "done";
      this.show_select = false;
    } else if (this.$route.fullPath === "/po/03") {
      this.pageName = "Tedarikçinin Revizyon Talebinde Bulunduğu Siparişler";
      this.pageIcon = "flight_land";
      this.show_select = false;
    } else if (this.$route.fullPath === "/po/09") {
      this.pageName = "Tamamı Sevk Edilmiş Siparişler";
      this.pageIcon = "gavel";
      this.show_select = false;
    } else if (this.$route.fullPath === "/po/04") {
      this.pageName = "Mutabakat İle İptal Edilen Siparişler";
      this.pageIcon = "thumb_down";
      this.show_select = false;
    } else if (this.$route.fullPath === "/po/20") {
      this.pageName = "İade Edilen Siparişler";
      this.pageIcon = "restore";
      this.show_select = false;
    } else if (this.$route.fullPath === "/po/05") {
      this.pageName = "Kısmen Sevk Edilmiş Siparişler";
      this.pageIcon = "directions_bus";
      this.show_select = false;
    } else if (this.$route.fullPath === "/po/06") {
      this.pageName = "İptal Talebinde Bulunduğumuz Siparişler";
      this.pageIcon = "stars";
      this.show_select = false;
    } else if (this.$route.fullPath === "/po/07") {
      this.pageName = "Mutabık Kalınmamış Siparişler";
      this.pageIcon = "stars";
      this.show_select = false;
    } else if (this.$route.fullPath === "/po/08") {
      this.pageName = "Revizyon Talebinde Bulunduğumuz Siparişler";
      this.pageIcon = "stars";
      this.show_select = false;
    } else if (this.$route.fullPath === "/po/21") {
      this.pageName = "Sevk İşlemi";
      this.pageIcon = "touch_app";
      this.show_select = true;
    }
  },

  computed: {
    ...mapGetters({
      po_list: "purchaseOrder/getPoList",
      sch_list: "purchaseOrder/getSchList",
      get_type: "getUserType",
      get_id: "getUserId",
      getAttach: "purchaseOrder/getAttach",
      getLoading: "purchaseOrder/getLoading",
      getUsers: "getUser",
      getAsn: "purchaseOrder/getAsn",
      getWerks: "getWerks",
    }),

    loading() {
      var loading = this.getLoading;
      return loading;
    },

    csvData() {
      var excelData = [];
      this.po_list.map((item) => {
        var excelObject = {
          Sas_Numarası: item["EBELN"],
          Kalem_Numarası: item["EBELP"].replace(/\b0+/g, ""),
          Siparis_Tarihi: this.dateFormatted(item["BEDAT"]),
          Satinalma_Grubu: item["EKNAM"] + "( " + item["EKGRP"] + " )",
          Tedarikci_Adi:
            item["NAME1"] + "( " + item["LIFNR"].replace(/\b0+/g, "") + " )",
          Odeme_Vadesi: item["ZTERM"] + "( " + item["ZTERT"] + " )",
          Teslim_Tarihi: this.dateFormatted(item["EKET_EINDT"]),
          Uretim_Yeri: item["EKPO_WERKT"] + " (" + item["EKPO_WERKS"] + " )",
          Malzeme:
            item["EKPO_MAKTX"] +
            " (" +
            item["EKPO_MATNR"].replace(/\b0+/g, "") +
            " )",
          Adet: item["EKPO_MENGE"],
          Adet_Birim: item["EKPO_MEINS_T"],
          Sevk_Kalan_Bakiye: item["EKPO_MENGE"] - item["EKPO_CASN_QUAN"],
          Sevk_Kalan_Bakiye_Birim: item["EKPO_MEINS_T"],
          Fiyat: item["EKPO_MENGE"] * item["EKPO_NETPR"],
          Fiyat_Birim: item["WAERS"],
          Birim_Fiyat:
            item["EKPO_NETPR"] +
            " " +
            item["WAERS"] +
            " / " +
            item["EKPO_PEINH"] +
            item["EKPO_MEINS_T"],
        };
        excelData.push(excelObject);
      });
      return excelData;
    },
  },

  watch: {
    "$route.path": function () {
      this.pageName = this.$route.fullPath;
      this.getlist({
        filter: this.$route.fullPath,
        sup_id: this.get_id,
      });
    },
  },

  methods: {
    ...mapActions({
      getlist: "purchaseOrder/get_list",
      getTreePo: "purchaseOrder/get_tree_po",
      updateStatus: "purchaseOrder/change_status",
      get_attach: "purchaseOrder/get_attach",
      filterItems: "purchaseOrder/filterItems",
    }),

    getColorDate(date) {
      var today = new Date();
      var target = new Date(date);
      var diffTime = today - target;
      var diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
      if (diffDays > 0) return "red";
    },

    getColorMenge(menge, casn) {
      if (casn > 0) return "red";
    },

    dispShow(item) {
      this.dispScreen = true;
      this.dispScreenData.po_number = item.EBELN;
      this.dispScreenData.po_item = item.EBELP;
      this.dispScreenData.driver_name = item.SURUCU_ADI;
      this.dispScreenData.driver_no = item.SURUCU_TELEFON;
      this.dispScreenData.disp_place = item.SEVK_YERI;
      this.dispScreenData.disp_date = this.dateFormatted(item.SEVK_TARIHI);
      this.dispScreenData.billing_no = item.IRSALIYE_NO;
      this.dispScreenData.billing_date = this.dateFormatted(
        item.IRSALIYE_TARIHI
      );
      this.dispScreenData.plate_no = item.ARAC_PLAKA;
      this.dispScreenData.bus_type = item.ARAC_TIPI;
      this.dispScreenData.quan = item.CASN_QUAN + " " + item.MEINS;
    },

    selectBusTypeInfo(a) {
      if (a === "01" || a === "02") {
        this.busVisible = true;
      } else {
        this.busVisible = false;
      }
    },

    checkLimits(item) {
      var topLimit = (item.EKPO_MENGE / 100) * (item.TOP + 100);
      item.REM_MENGE = parseFloat(item.REM_MENGE);
      item.CASN_QUAN = parseFloat(item.CASN_QUAN);
      if (item.CASN_QUAN != item.REM_MENGE) {
        topLimit = topLimit - item.EKPO_MENGE + item.REM_MENGE;
      }
      if (item.CASN_QUAN > topLimit) {
        this.$toast.show(
          "Girdiğiniz adet limitlerin dışındadır ! Üst limitiniz : " +
            topLimit +
            " " +
            item.EKPO_MEINS_T,
          {
            theme: "bubble",
            icon: "cancel",
            type: "error",
            position: "bottom-right",
            duration: 5000,
          }
        );
        item.CASN_QUAN = undefined;
      }
    },

    currencyInputRevMenge(num) {
      this.revInfo.rev_quantity = num.replace(/,/g, "");
      var converter = this.revInfo.rev_quantity;
      this.revQuanBefore = converter
        .toString()
        .replace(/(\d)(?=(\d{3})+(?!\d))/g, "$1,");
    },

    currencyFormat(num) {
      return num.toString().replace(/(\d)(?=(\d{3})+(?!\d))/g, "$1,");
    },

    padZeros(num, txt) {
      if (txt === "ZLIFNR_S") {
        this.filterSelect.ZLIFNR_S = num.padStart(10, "0");
      } else if (txt === "ZLIFNR_F") {
        this.filterSelect.ZLIFNR_F = num.padStart(10, "0");
      } else if (txt === "ZEBELN_S") {
        this.filterSelect.ZEBELN_S = num.padStart(10, "0");
      } else if (txt === "ZEBELN_F") {
        this.filterSelect.ZEBELN_F = num.padStart(10, "0");
      } else if (txt === "ZMATNR_S") {
        this.filterSelect.ZMATNR_S = num.padStart(18, "0");
      } else if (txt === "ZMATNR_F") {
        this.filterSelect.ZMATNR_F = num.padStart(18, "0");
      }
    },

    download(item) {
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

    filter() {
      this.filterItems({
        route: this.$route.fullPath,
        FILTER_SELECTS: this.filterSelect,
        sup_id: this.get_id,
      });
      this.filterDialog = false;
    },

    detay(item) {
      this.detayDialog = true;
      this.detailedIndex = this.po_list.indexOf(item);
      this.goster(this.detailedIndex);
      if (
        this.$route.fullPath === "/po/05" ||
        this.$route.fullPath === "/po/09"
      ) {
        this.get_attach({
          po_number: this.po_list[this.detailedIndex].EBELN,
          po_item: this.po_list[this.detailedIndex].EBELP,
        });
      }
    },

    deleteFromSend(key) {
      if (this.sendFile[key].doc_type === "İrsaliye") {
        this.irsaliye = false;
        this.sendFile.splice(key, 1);
      } else if (this.sendFile[key].doc_type === "Analiz Sertifikası") {
        this.analiz = false;
        this.sendFile.splice(key, 1);
      }
    },

    deleteASN(item) {
      var index = this.roadSelected.findIndex(
        (f) => f.EBELN === item.EBELN && f.EBELP === item.EBELP
      );
      if (index != -1) {
        this.roadSelected.splice(index, 1);
      }
    },

    exit() {
      (this.dispScreen = false), (this.detayDialog = false);
      this.revDialog = false;
      this.sevkDialog = false;
      this.sendFile = [];
      this.filterDialog = false;
      this.detailedIndex = "";
      this.poListArray = [];
      this.irsaliye = false;
      this.analiz = false;
      this.decDescDialog = false;
    },

    //Ekrana bastırdığımız dataları bind ettiğimiz fonksiyon
    goster(index) {
      this.poListArray = [];
      this.detailedIndex = index;
      if (
        this.detailedIndex == 0 &&
        this.detailedIndex + 1 == this.po_list.length
      ) {
        this.geriVar = true;
        this.ileriVar = true;
      } else if (this.detailedIndex + 1 == this.po_list.length) {
        this.ileriVar = true;
        this.geriVar = false;
      } else if (this.detailedIndex == 0) {
        this.geriVar = true;
        this.ileriVar = false;
      }
      this.detailedItem.po_number = this.po_list[this.detailedIndex].EBELN;
      this.detailedItem.CASN_QUAN =
        this.po_list[this.detailedIndex].EKPO_MENGE -
        this.po_list[this.detailedIndex].EKPO_CASN_QUAN;
      this.detailedItem.GR_QUAN =
        this.po_list[this.detailedIndex].EKPO_MENGE -
        this.po_list[this.detailedIndex].EKPO_GR_QUAN;
      this.detailedItem.revDesc = this.po_list[this.detailedIndex].revDesc;
      this.detailedItem.decDesc = this.po_list[this.detailedIndex].decDesc;
      this.detailedItem.rejDesc = this.po_list[this.detailedIndex].rejDesc;
      this.detailedItem.rejPlanDesc =
        this.po_list[this.detailedIndex].rejPlanDesc;
      this.detailedItem.posting_date = this.dateFormatted(
        this.po_list[this.detailedIndex].BEDAT
      );
      this.detailedItem.purch_group =
        this.po_list[this.detailedIndex].EKNAM +
        " " +
        "(" +
        this.po_list[this.detailedIndex].EKGRP.toString().replace(/\b0+/g, "") +
        ")";
      this.detailedItem.topLimit =
        (this.po_list[this.detailedIndex].EKPO_MENGE / 100) *
        (this.po_list[this.detailedIndex].EKPO_UEBTO + 100);
      this.detailedItem.lowerLimit =
        (this.po_list[this.detailedIndex].EKPO_MENGE / 100) *
        (100 - this.po_list[this.detailedIndex].EKPO_UNTTO);
      this.detailedItem.vendor =
        this.po_list[this.detailedIndex].NAME1 +
        " " +
        "(" +
        this.po_list[this.detailedIndex].LIFNR.toString().replace(/\b0+/g, "") +
        ")";
      this.detailedItem.payterm =
        this.po_list[this.detailedIndex].ZTERM +
        " " +
        "(" +
        this.po_list[this.detailedIndex].ZTERT +
        ")";
      this.detailedItem.po_item = this.po_list[
        this.detailedIndex
      ].EBELP.toString().replace(/\b0+/g, "");
      this.detailedItem.mat =
        this.po_list[this.detailedIndex].EKPO_MAKTX +
        " " +
        "(" +
        this.po_list[this.detailedIndex].EKPO_MATNR.toString().replace(
          /\b0+/g,
          ""
        ) +
        ")";
      this.detailedItem.quantity =
        this.currencyFormat(this.po_list[this.detailedIndex].EKPO_MENGE) +
        " " +
        this.po_list[this.detailedIndex].EKPO_MEINS_T;
      this.detailedItem.eket_deliv = this.dateFormatted(
        this.po_list[this.detailedIndex].EKET_EINDT
      );
      try {
        var lv_price =
          this.po_list[this.detailedIndex].EKPO_NETPR *
          (this.po_list[this.detailedIndex].EKPO_MENGE /
            this.po_list[this.detailedIndex].EKPO_PEINH);
        var lv_str_price = String(lv_price);
        var arr = lv_str_price.split(".");
        if (arr[1] == null) {
          var lv_price_new = arr[0];
        } else {
          var lv_price_new = arr[0] + "." + arr[1].slice(0, 2);
        }
      } catch (err) {}
      this.detailedItem.price =
        this.currencyFormat(lv_price_new) +
        " " +
        this.po_list[this.detailedIndex].WAERS +
        " ( " +
        this.po_list[this.detailedIndex].EKPO_NETPR +
        " " +
        this.po_list[this.detailedIndex].WAERS +
        " / " +
        this.po_list[this.detailedIndex].EKPO_PEINH +
        " " +
        this.po_list[this.detailedIndex].EKPO_MEINS_T +
        " )";
      this.detailedItem.plant =
        this.po_list[this.detailedIndex].EKPO_WERKT +
        " " +
        "(" +
        this.po_list[this.detailedIndex].EKPO_WERKS +
        ")";
      this.detailedItem.spec = this.po_list[this.detailedIndex].EKPO_ZEINR;
      if (this.po_list[this.detailedIndex].EKPO_ZREVIZYON_MENGE === 0.0) {
        this.detailedItem.zquan = "";
      } else {
        this.detailedItem.zquan =
          this.currencyFormat(
            this.po_list[this.detailedIndex].EKPO_ZREVIZYON_MENGE
          ) +
          " " +
          this.po_list[this.detailedIndex].EKPO_MEINS_T;
      }
      if (
        this.po_list[this.detailedIndex].EKET_ZREVIZYON_EINDT === "0000-00-00"
      ) {
        this.detailedItem.zdeliv = "";
      } else {
        this.detailedItem.zdeliv = this.dateFormatted(
          this.po_list[this.detailedIndex].EKET_ZREVIZYON_EINDT
        );
      }

      if (this.po_list[this.detailedIndex].EKPO_ZREVIZYON_WERKST === "") {
        this.detailedItem.zplace = "";
      } else {
        this.detailedItem.zplace =
          this.po_list[this.detailedIndex].EKPO_ZREVIZYON_WERKST +
          " (" +
          this.po_list[this.detailedIndex].EKPO_ZREVIZYON_WERKS +
          ")";
      }
      this.poListArray.push(this.detailedItem);
    },

    //Tedarikçi Sipariş Onayı (Açık Siparişler)
    poAccept() {
      this.updateStatus({
        po_number: this.po_list[this.detailedIndex].EBELN,
        po_item: this.po_list[this.detailedIndex].EBELP,
        filter: this.$route.fullPath,
        sup_id: this.get_id,
        onay: "true",
      });
      this.detayDialog = false;
    },

    //Tedarikçi Revizyon Talebi (Açık Siperişler)
    revDemand() {
      this.revDialog = true;
    },
    //Tedarikçi Revizyon Talebi Onay Dialog(Açık Siperişler) //Tedarikçi Revizyon Talep Eder(Onaylı Siparişler)
    revDemandOk() {
      if (this.$refs.revForm.validate()) {
        if (this.revInfo.rev_quantity === undefined) {
          this.revInfo.rev_quantity = "0";
        }
        if (this.revInfo.rev_deliv_date === undefined) {
          this.revInfo.rev_deliv_date = "00000000";
        }
        this.updateStatus({
          zrev_quan: this.revInfo.rev_quantity,
          zrev_deliv: this.revInfo.rev_deliv_date,
          zrev_desc: this.revInfo.rev_desc,
          po_number: this.po_list[this.detailedIndex].EBELN,
          po_item: this.po_list[this.detailedIndex].EBELP,
          filter: this.$route.fullPath,
          sup_id: this.get_id,
          onay: "false",
        });
        this.revDialog = false;
        this.detayDialog = false;
        this.$refs.revForm.reset();
      }
    },

    //Tedarikçi Sütaş Revizyonunu Onaylar (Sütaş Revizyon Talebi)
    revAccept() {
      this.updateStatus({
        po_number: this.po_list[this.detailedIndex].EBELN,
        po_item: this.po_list[this.detailedIndex].EBELP,
        filter: this.$route.fullPath,
        sup_id: this.get_id,
        onay: "true",
      });
      this.detayDialog = false;
    },

    //Tedarikçi Sütaş Revizyonunu Reddeder (Sütaş Revizyon Talebi)
    revDecline() {
      this.rejDescDialog = true;
    },

    revDeclineOk() {
      this.updateStatus({
        rej_info: this.zRejDescInfo,
        po_number: this.po_list[this.detailedIndex].EBELN,
        po_item: this.po_list[this.detailedIndex].EBELP,
        filter: this.$route.fullPath,
        sup_id: this.get_id,
        onay: "false",
      });
      this.rejDescDialog = false;
      this.detayDialog = false;
    },

    //Tedarikçi Sütaş İptal Talebini reddeder (Sütaş İptal Talebi)
    decDecline() {
      this.updateStatus({
        po_number: this.po_list[this.detailedIndex].EBELN,
        po_item: this.po_list[this.detailedIndex].EBELP,
        filter: this.$route.fullPath,
        sup_id: this.get_id,
        onay: "true",
      });
      this.detayDialog = false;
    },

    //Tedarikçi Sütaş İptal Talebini Kabul Eder (Sütaş İptal Talebi)
    decAccept() {
      this.updateStatus({
        po_number: this.po_list[this.detailedIndex].EBELN,
        po_item: this.po_list[this.detailedIndex].EBELP,
        filter: this.$route.fullPath,
        sup_id: this.get_id,
        onay: "false",
      });
      this.detayDialog = false;
    },

    roadControl() {
      var po_list_copied = this.po_list.map((item) => {
        return { ...item };
      });

      var pass = undefined;

      this.roadSelected.forEach((a) => {
        var Index = po_list_copied.findIndex(
          (f) => f.EBELN === a.EBELN && f.EBELP === a.EBELP
        );
        if (Index != -1) {
          po_list_copied.splice(Index, 1);
        }
      });

      this.roadSelected.forEach((x) => {
        po_list_copied.forEach((y) => {
          if (x.EKPO_MATNR === y.EKPO_MATNR && x.EKPO_WERKS === y.EKPO_WERKS) {
            if (x.EKET_EINDT > y.EKET_EINDT) {
              pass = false;
            }
          }
        });
      });

      return pass;
    },

    road() {
      this.selected.forEach((a) => {
        var Index = this.roadSelected.findIndex(
          (f) => f.EBELN === a.EBELN && f.EBELP === a.EBELP
        );
        if (Index != -1) {
          this.roadSelected.splice(Index, 1);
        }
      });

      this.selected.forEach((item) => {
        var itemTree = {
          EBELN: item.EBELN,
          TOP: item.EKPO_UEBTO,
          LOW: item.EKPO_UNTTO,
          EBELP: item.EBELP,
          EKPO_MENGE: item.EKPO_MENGE,
          EKPO_MATNR: item.EKPO_MATNR,
          EKPO_MAKTX: item.EKPO_MAKTX,
          EKPO_CASN_QUAN: undefined,
          EKPO_MEINS_T: item.EKPO_MEINS_T,
          REM_MENGE: item.EKPO_MENGE - item.EKPO_CASN_QUAN,
          EKPO_WERKS: item.EKPO_WERKS,
          EKET_EINDT: item.EKET_EINDT,
        };
        this.roadSelected.push(itemTree);
      });
      this.sevkDialog = true;
    },

    roadOk() {
      var pass = this.roadControl();

      if (pass == false) {
        this.$toast.show(
          "Termin süresi daha yakın olan siparişleriniz varken daha eski olan siparişleri sevk edemezsiniz !",
          {
            theme: "bubble",
            icon: "check",
            type: "error",
            position: "bottom-right",
            duration: 5000,
          }
        );
        return;
      }
      if (this.irsaliye === true && this.analiz === true) {
        if (this.$refs.sevkForm.validate()) {
          if (this.sendFile.length >= 2) {
            this.updateStatus({
              sup_id: this.get_id,
              onay: "true",
              filter: this.$route.fullPath,
              file: this.sendFile,
              ITEMS: this.roadSelected,
              DRIVER_NAME: this.dispatchInfo.driver_name,
              BILLING_NO: this.dispatchInfo.billing_no,
              BILLING_DATE: this.dispatchInfo.billing_date,
              PLATE_NO: this.dispatchInfo.plate_no,
              PHONE_NUMBER: this.dispatchInfo.phone_number,
              SEVK_YERI: this.dispatchInfo.werks,
              ARAC_TIPI: this.dispatchInfo.busType,
            });
          }
          this.exit();
          this.roadSelected = [];
          this.selected = [];
        }
      } else {
        this.$toast.show(
          "İrsaliye Belgenizi ve Analiz Sertifikanızı yüklediğinizden emin olunuz.",
          {
            theme: "bubble",
            icon: "check",
            type: "error",
            position: "bottom-right",
            duration: 5000,
          }
        );
      }
    },

    //Satın Alma Sorumlusu Revizyonu Reddeder (Satın Alma Kararı)
    krevDecline() {
      this.updateStatus({
        po_number: this.po_list[this.detailedIndex].EBELN,
        po_item: this.po_list[this.detailedIndex].EBELP,
        filter: this.$route.fullPath,
        sup_id: this.get_id,
        onay: "true",
      });
      this.detayDialog = false;
    },

    //Satın Alma Sorumlusu Siparişi Reddeder (Satın Alma Kararı)
    kpoDecline() {
      this.updateStatus({
        po_number: this.po_list[this.detailedIndex].EBELN,
        po_item: this.po_list[this.detailedIndex].EBELP,
        filter: this.$route.fullPath,
        sup_id: this.get_id,
        onay: "false",
      });
      this.detayDialog = false;
    },

    //Planlamacı Revizyon Talebini Kabul Eder (Revizyon Talebi)
    rrevAccept() {
      this.updateStatus({
        po_number: this.po_list[this.detailedIndex].EBELN,
        po_item: this.po_list[this.detailedIndex].EBELP,
        filter: this.$route.fullPath,
        sup_id: this.get_id,
        onay: "true",
      });
      this.detayDialog = false;
    },

    //Planlamacı Revizyon Talebini Reddeder (Revizyon Talebi)
    rrevDecline() {
      this.rejPlanDescDialog = true;
    },

    //Planlamacı Revizyon Talebini Reddeder (Revizyon Talebi)
    rrevDeclineOk() {
      this.updateStatus({
        rej_info: this.zRejPlanDescInfo,
        po_number: this.po_list[this.detailedIndex].EBELN,
        po_item: this.po_list[this.detailedIndex].EBELP,
        filter: this.$route.fullPath,
        sup_id: this.get_id,
        onay: "false",
      });
      this.detayDialog = false;
      this.rejPlanDescDialog = false;
    },

    //Planlamacı Revizyon Talebini Satın Alma Sorumlusuna Aktarır (Revizyon Talebi)
    sendPur() {
      this.decDescDialog = true;
    },

    sendPurOK() {
      this.updateStatus({
        dec_info: this.zDecDescInfo,
        po_number: this.po_list[this.detailedIndex].EBELN,
        po_item: this.po_list[this.detailedIndex].EBELP,
        filter: this.$route.fullPath,
        sup_id: this.get_id,
        onay: "dunno",
      });
      this.detayDialog = false;
      this.decDescDialog = false;
    },

    geri() {
      this.goster(this.detailedIndex - 1);
    },
    ileri() {
      this.goster(this.detailedIndex + 1);
    },

    pickFile() {
      this.$refs.files.click();
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
      var zcontent = this.$store.state.supplierInfo.content.dataContent;
      if (this.attachProp.doc_type === "Analiz Sertifikası") {
        this.attachRules.analizAttach = this.selectedFile[0].name;
      } else if (this.attachProp.doc_type === "İrsaliye") {
        this.attachRules.irsaliyeAttach = this.selectedFile[0].name;
      }
      var zFile = {
        name: this.selectedFile[0].name,
        size: this.selectedFile[0].size,
        content: zcontent,
      };
      this.selectedFile = [];
      this.fileName = "";
      this.sureDialog = false;
      var time = new Date();
      var dd = String(time.getDate()).padStart(2, "0");
      var mm = String(time.getMonth() + 1).padStart(2, "0");
      var yyyy = time.getFullYear();
      var today = dd + "-" + mm + "-" + yyyy;
      zFile.date = today;
      zFile.doc_type = this.attachProp.doc_type;
      this.sendFile.push(zFile);
      if (this.attachProp.doc_type === "İrsaliye") {
        this.irsaliye = true;
      } else if (this.attachProp.doc_type === "Analiz Sertifikası") {
        this.analiz = true;
      }
    },
  },
};
</script>
