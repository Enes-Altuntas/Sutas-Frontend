<template>
  <div class="arka">
    <div class="loading-page" v-if="loading">
      <div class="lds-hourglass"></div>
    </div>
    <v-toolbar>
      <v-toolbar-title>
        <v-icon>call</v-icon>
        Kullanıcı Dökümanları
      </v-toolbar-title>
    </v-toolbar>
    <v-flex xs12 md12 lg12 v-if="get_type === 'PUR'">
      <v-card dark width="100%">
        <v-card-title>
          Döküman Ekle
          <v-spacer></v-spacer>
          <v-btn light @click="sendFiles()">Ekleri Kaydet</v-btn>
        </v-card-title>
        <v-card-text>
          <v-text-field
            label="Dosya Seçiniz"
            @click="pickFile"
            v-model="fileName"
            prepend-icon="attach_file"
            append-icon="add"
            @click:append="acceptFile"
            @keydown.enter="acceptFile"
          ></v-text-field>
          <input
            type="file"
            style="display: none"
            ref="files"
            v-on:change="handleFilesUpload()"
          />
          <v-flex
            xs12
            v-for="(item, i) in sendFile"
            :key="i"
            active-class="default-class"
          >
            <span class="subheading"
              >{{ i + 1 }} ) {{ item.name }} ( {{ item.size }} KB )</span
            >
            <v-icon class="ml-2" color="red" @click="deleteFromSend(i)"
              >delete</v-icon
            >
          </v-flex>
        </v-card-text>
      </v-card>
    </v-flex>
    <v-flex
      class="mt-4 pl-5 pr-5"
      xs12
      md12
      lg12
      v-for="(item, i) in getHelpAtt"
      :key="i"
    >
      <v-card dark width="100%" class="dialog">
        <v-card-title>
          <v-icon large left> help </v-icon>
          <span class="title font-weight-light"
            >{{ item.data_name }} ( {{ item.data_size }} KB )</span
          >
          <v-spacer></v-spacer>
          <v-icon @click="download(item)"> arrow_downward </v-icon>
          <v-icon v-if="get_type === 'PUR'" @click="sil(item)"> delete </v-icon>
        </v-card-title>
      </v-card>
    </v-flex>
  </div>
</template>
<style>
.arka {
  background: url("../static/dusk.jpg") no-repeat;
  background-size: cover;
  background-attachment: fixed;
  width: 100%;
  height: 100%;
}
.dialog {
  border-radius: 25px;
}
</style>
<script>
import { mapFields, mapMultiRowFields } from "vuex-map-fields";
import { mapActions, mapGetters } from "vuex";

export default {
  data() {
    return {
      files: [],
      fileName: undefined,
      selectedFile: [],
      content: undefined,
      sendFile: [],
    };
  },

  mounted() {
    this.pullHelpAtt();
  },

  computed: {
    ...mapGetters({
      getHelpAtt: "anouncements/getHelpAtt",
      get_type: "getUserType",
    }),

    loading() {
      var loading = this.getLoading;
      return loading;
    },
  },

  methods: {
    ...mapActions({
      pullHelpAtt: "anouncements/pullAttach",
      pushHelpAtt: "anouncements/pushAttach",
      delHelpAtt: "anouncements/delAttach",
    }),

    pickFile() {
      this.$refs.files.click();
    },

    sendFiles() {
      this.pushHelpAtt({ file: this.sendFile });
      this.sendFile = [];
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

    handleFilesUpload() {
      var uploadedFiles = this.$refs.files.files;
      var fileReader = new FileReader();
      if (uploadedFiles) {
        for (var i = 0; uploadedFiles.length > i; i++) {
          var uploadedFile = uploadedFiles[i];
          this.fileName = uploadedFile.name;
          fileReader.onloadend = (function (file) {
            return function (onLoadEvent) {
              $nuxt.$store.commit("anouncements/updateField", {
                path: "content",
                value: {
                  dataContent: fileReader.result,
                },
              });
            };
          })(uploadedFile);
          fileReader.readAsDataURL(uploadedFile);
          this.selectedFile.push(uploadedFile);
        }
      }
    },

    sil(item) {
      this.delHelpAtt({ id: item.id });
    },

    acceptFile() {
      var zcontent = this.$store.state.anouncements.content.dataContent;
      var zFile = {
        name: this.selectedFile[0].name,
        size: this.selectedFile[0].size,
        content: zcontent,
      };
      this.selectedFile = [];
      this.fileName = "";
      this.sendFile.push(zFile);
    },

    deleteFromSend(key) {
      this.sendFile.splice(key, 1);
    },
  },
};
</script>
