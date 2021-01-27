<template>
  <div>
    <div class="loading-page" v-if="loading">
      <div class="lds-hourglass"></div>
    </div>
    <v-flex xs12>
      <v-card width="500px" class="card">
        <v-img
          :src="this.resim1.src"
          height="250px"
        ></v-img>
        <v-toolbar dark color="green darken-4">
          <v-toolbar-title primary-title>Kullanıcı Giriş Ekranı</v-toolbar-title>
        </v-toolbar>
        <v-form ref="form">
          <v-container>
            <v-text-field
              @keyup.enter="submit"
              clearable
              label="Kullanıcı Adı"
              v-model="username"
              counter
              maxlength="12"
              :rules="userRules"
            />
            <v-text-field
              @keyup.enter="submit"
              clearable
              :append-icon="showPW ? 'visibility_off' : 'visibility'"
              :type="showPW ? 'text' : 'password'"
              @click:append="showPW = !showPW"
              counter
              :rules="passRules"
              label="Kullanıcı Şifresi"
              v-model="password"
            />
            <v-card-actions>
                <v-btn dark color="warning" @click="forget()">Şifremi Unuttum</v-btn>
                <v-spacer></v-spacer>
                <v-btn dark color="green darken-4" @click="giris()">Giriş Yap</v-btn>
            </v-card-actions>
          </v-container>
        </v-form>
      </v-card>
    </v-flex>
  </div>
</template>

<style>
.card {
  border-radius: 20px;
  -webkit-animation: mymove 2s;
  animation: mymove 2s;
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
@-webkit-keyframes mymove {
    from {
        transform: rotateY(0deg);
    }

    to {
        transform: rotateY(360deg);
    }
}

@keyframes mymove {
    from {
        transform: rotateY(0deg);
    }

    to {
        transform: rotateY(360deg);
    }
}
</style>

<script>
import { mapFields, mapMultiRowFields } from "vuex-map-fields";
import { mapActions, mapGetters } from "vuex";

export default {
  layout: "signLayout",
  data() {
    return {
      resim1: {
        src: require("../static/login.jpg")
      },
      showPW: false,
      userRules: [v => !!v || "Kullanıcı adı zorunludur !"],
      passRules: [v => !!v || "Şifre zorunludur !"]
    };
  },

  beforeMount() {
    var cookie = this.$cookies.get('refresh-token')
    if(cookie != undefined) {
      this.$router.push('/')
    }
  },

  computed: {
    ...mapFields({
      username: "form.username",
      password: "form.password"
    }),
    ...mapGetters({
      getLoading: "getLoading"
    }),
    loading() {
      var loading = this.getLoading;
      return loading;
    }
  },
  methods: {
    ...mapActions({
      submit: "login",
      sendUserName: "sendUserName"
    }),
    giris() {
      if (this.$refs.form.validate()) {
        this.submit();
      }
    },
    forget() {
      
      this.sendUserName({ DATA: this.username })
    }
  }
};
</script>
