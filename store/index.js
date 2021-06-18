import { getField, updateField } from "vuex-map-fields";

export const state = () => ({
  form: {
    username: undefined,
    password: undefined
  },
  staticButton: [
    {
      icon: "dashboard",
      title: "Ana Sayfa",
      url: "/",
      action: ""
    },
    {
      icon: "call",
      title: "Kullanıcı Dokümanları",
      url: "/about",
      action: ""
    }
  ],
  sideNav: true,
  openedModules: [],
  withoutSub: [],
  loading: "",
  user: "",
  anounces: [],
  quans: [],
  werks: [],
  badge: [],
  findPo: [],
  admin_info: undefined,
  valid: undefined
});

export const getters = {
  getField,
  getLoading(state) {
    try {
      return state.loading;
    } catch (error) {
      return "";
    }
  },
  getSideNav(state) {
    try {
      return state.sideNav;
    } catch (error) {
      return "";
    }
  },
  getQuans(state) {
    try {
      return state.quans;
    } catch (error) {
      return "";
    }
  },
  getWerks(state) {
    try {
      return state.werks;
    } catch (error) {
      return "";
    }
  },
  getUser(state) {
    try {
      return state.user;
    } catch (error) {
      return "";
    }
  },
  getAnounces(state) {
    try {
      return state.anounces;
    } catch (error) {
      return "";
    }
  },
  getUserInfo(state) {
    try {
      return state.openedModules[0].username;
    } catch (error) {
      return "";
    }
  },
  getUserType(state) {
    try {
      return state.openedModules[0].user_type;
    } catch (error) {
      return "";
    }
  },

  getUserTypeDesc(state) {
    try {
      return state.openedModules[0].type_desc;
    } catch (error) {
      return "";
    }
  },

  getUserCount(state) {
    try {
      return state.admin_info;
    } catch (error) {
      return "";
    }
  },

  getFindPo(state) {
    try {
      return state.findPo;
    } catch (error) {
      return "";
    }
  },
  getUserId(state) {
    try {
      return state.openedModules[0].user_sys_id;
    } catch (error) {
      return "";
    }
  },
  getColor(state) {
    try {
      return state.openedModules[0].subMenu;
    } catch (error) {
      return "";
    }
  },
  getBadge(state) {
    try {
      return state.badge;
    } catch (error) {
      return "";
    }
  }
};

export const mutations = {
  updateField
};

export const actions = {
  cleanTable({ commit }) {
    commit("updateField", {
      path: "findPo",
      value: []
    });
  },

  async login({ getters, commit }) {
    const formData = getters.getField("form");

    try {
      commit("updateField", {
        path: "loading",
        value: true
      });
      const response = await this.$axios.post("/login", formData);
      this.$cookies.set("refresh-token", response.data.refresh_token);
      commit("updateField", {
        path: "loading",
        value: false
      });
      this.$router.push("/");
    } catch (error) {
      commit("updateField", {
        path: "loading",
        value: false
      });
      if (error.response.status === 422) {
        this.$router.push("/sign");
      } else if (error.response.status === 401) {
        this.$cookies.remove("refresh-token");
        this.$router.push("/sign");
      } else {
        this.$router.push({
          path: "/error",
          query: { title: error.response.data, status: error.response.status }
        });
      }
    }
  },

  logout({ commit }) {
    commit("updateField", {
      path: "loading",
      value: true
    });
    this.$cookies.remove("refresh-token");
    commit("updateField", {
      path: "loading",
      value: false
    });
    this.$router.push("/sign");
  },

  async getMenu({ commit }) {
    const token = this.$cookies.get("refresh-token");
    this.$axios.defaults.headers.common["Authorization"] = "Bearer " + token;

    try {
      commit("updateField", {
        path: "loading",
        value: true
      });

      const response = await this.$axios.post("/main");

      commit("updateField", {
        path: "openedModules",
        value: response.data.opened_modules
      });
      commit("updateField", {
        path: "withoutSub",
        value: response.data.without_sub
      });
      commit("updateField", {
        path: "user",
        value: response.data.user
      });
      commit("updateField", {
        path: "admin_info",
        value: response.data.admin_info
      });
      commit("updateField", {
        path: "quans",
        value: response.data.quans
      });
      commit("updateField", {
        path: "badge",
        value: response.data.badge
      });
      commit("updateField", {
        path: "werks",
        value: response.data.werks
      });
      commit("updateField", {
        path: "anounces",
        value: response.data.anounces
      });
      commit("updateField", {
        path: "loading",
        value: false
      });
      this.$cookies.set("refresh-token", response.data.refresh_token);
    } catch (error) {
      commit("updateField", {
        path: "loading",
        value: false
      });
      if (error.response.status === 422) {
        this.$router.push("/sign");
      } else if (error.response.status === 401) {
        this.$cookies.remove("refresh-token");
        this.$router.push("/sign");
      } else {
        this.$router.push({
          path: "/error",
          query: { title: error.response.data, status: error.response.status }
        });
      }
    }
  },

  async sendUserName({ commit }, item) {
    try {
      commit("updateField", {
        path: "loading",
        value: true
      });
      const response = await this.$axios.post("/forget", item);
      commit("updateField", {
        path: "valid",
        value: response.data.valid
      });
      commit("updateField", {
        path: "loading",
        value: false
      });
      this.$toast.show("Mail kutunuzu kontrol ediniz.", {
        theme: "bubble",
        icon: "check",
        type: "success",
        position: "bottom-right",
        duration: 5000
      });
    } catch (error) {
      commit("updateField", {
        path: "loading",
        value: false
      });
      if (error.response.status === 422) {
        this.$router.push("/sign");
      } else if (error.response.status === 401) {
        this.$cookies.remove("refresh-token");
        this.$router.push("/sign");
      } else {
        this.$router.push({
          path: "/error",
          query: { title: error.response.data, status: error.response.status }
        });
      }
    }
  },

  async sendFilterPo({ commit }, item) {
    const token = this.$cookies.get("refresh-token");
    this.$axios.defaults.headers.common["Authorization"] = "Bearer " + token;

    try {
      commit("updateField", {
        path: "loading",
        value: true
      });
      const response = await this.$axios.post("/findPo", item);
      commit("updateField", {
        path: "findPo",
        value: response.data.findPo
      });
      commit("updateField", {
        path: "loading",
        value: false
      });
      this.$cookies.set("refresh-token", response.data.refresh_token);
    } catch (error) {
      commit("updateField", {
        path: "loading",
        value: false
      });
      if (error.response.status === 422) {
        this.$router.push("/sign");
      } else if (error.response.status === 401) {
        this.$cookies.remove("refresh-token");
        this.$router.push("/sign");
      } else {
        this.$router.push({
          path: "/error",
          query: { title: error.response.data, status: error.response.status }
        });
      }
    }
  },

  async sendCode({ commit }, item) {
    debugger
    const token = this.$cookies.get("refresh-token");
    this.$axios.defaults.headers.common["Authorization"] = "Bearer " + token;
    try {
      commit("updateField", {
        path: "loading",
        value: true
      });
      const response = await this.$axios.post("/newpass", item);
      commit("updateField", {
        path: "valid",
        value: response.data.valid
      });
      if (response.data.valid === "validated") {
        this.$toast.show("Yeni şifreniz başarıyla kaydedilmiştir !", {
          theme: "bubble",
          icon: "check",
          type: "success",
          position: "bottom-right",
          duration: 5000
        });
      }
      else {
        this.$toast.show("Şifreniz kaydedilirken bir hata ile karşılaşıldı !", {
          theme: "bubble",
          icon: "check",
          type: "error",
          position: "bottom-right",
          duration: 5000
        });
      }
      commit("updateField", {
        path: "loading",
        value: false
      });
    } catch (error) {
      commit("updateField", {
        path: "loading",
        value: false
      });
      if (error.response.status === 422) {
        this.$router.push("/sign");
      } else if (error.response.status === 401) {
        this.$cookies.remove("refresh-token");
        this.$router.push("/sign");
      } else {
        this.$router.push({
          path: "/error",
          query: { title: error.response.data, status: error.response.status }
        });
      }
    }
  }
};
