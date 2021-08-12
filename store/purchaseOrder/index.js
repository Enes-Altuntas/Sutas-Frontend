import { getField, updateField } from 'vuex-map-fields'
export const strict = false

export const state = () => ({
  list: [],
  schList: [],
  list_po_all: [],
  revInfo: [],
  sasAttach: [],
  users: [],
  loading: '',
  asn: [],
  treePo: [],
})

export const getters = {
  getField,
  getPoList(state) {
    try {
      return state.list
    } catch (error) {
      return ''
    }
  },
  getUsers(state) {
    try {
      return state.users
    } catch (error) {
      return ''
    }
  },
  getAsn(state) {
    try {
      return state.asn
    } catch (error) {
      return ''
    }
  },
  getLoading(state) {
    try {
      return state.loading
    } catch (error) {
      return ''
    }
  },
  getSchList(state) {
    try {
      return state.schList
    } catch (error) {
      return ''
    }
  },
  getPoListAll(state) {
    try {
      return state.list_po_all
    } catch (error) {
      return ''
    }
  },
  getAttach(state) {
    try {
      return state.sasAttach
    }
    catch (error) {
      return ''
    }
  },
  getTreePo(state) {
    try {
      return state.treePo
    }
    catch (error) {
      return ''
    }
  }
}

export const mutations = {
  updateField
}

export const actions = {
  async get_list({ commit }, item) {

    const token = this.$cookies.get('refresh-token')
    this.$axios.defaults.headers.common['Authorization'] = 'Bearer ' + token

    try {
      commit('updateField', {
        path: 'loading',
        value: true
      })
      const response = await this.$axios.post('/po', item)
      commit('updateField', {
        path: 'list',
        value: response.data.sentData
      })
      commit('updateField', {
        path: 'loading',
        value: false
      })
      var MESSAGE = ''
      if (response.data.sentData.length > 0) {
        MESSAGE = response.data.sentData.length + ' adet siparişiniz başarıyla çekilmiştir.'
      }
      else {
        MESSAGE = 'Bu kategoride hiç siparişiniz bulunmamaktadır.'
      }
      this.$toast.show(MESSAGE, {
        theme: "bubble",
        icon: 'check',
        type: 'success',
        position: "bottom-right",
        duration: 3000,
      })
    } catch (error) {
      commit('updateField', {
        path: 'loading',
        value: false
      })
      if (error.response.status === 422) {
        this.$cookies.remove("access-token");
        this.$cookies.remove("refresh-token");
        this.$router.push('/sign')
      }
      else if (error.response.status === 401) {
        this.$cookies.remove("access-token");
        this.$cookies.remove('refresh-token')
        this.$router.push('/sign')
        this.$toast.show("Başka bir tarayıcıda açık oturumunuz bulunduğu için oturumunuz sonlandırılmıştır !", {
          theme: "bubble",
          icon: "check",
          type: "error",
          position: "bottom-right",
          duration: 5000
        });
      }
      else {
        this.$router.push({ path: '/error', query: { title: error.response.data, status: error.response.status } })
      }
    }
  },

  async get_tree_po({ commit }, item) {

    const token = this.$cookies.get('refresh-token')
    this.$axios.defaults.headers.common['Authorization'] = 'Bearer ' + token

    try {
      commit('updateField', {
        path: 'loading',
        value: true
      })
      const response = await this.$axios.post('/po', item)
      commit('updateField', {
        path: 'treePo',
        value: response.data.sentData
      })
      commit('updateField', {
        path: 'loading',
        value: false
      })
    } catch (error) {
      commit('updateField', {
        path: 'loading',
        value: false
      })
      if (error.response.status === 422) {
        this.$cookies.remove("access-token");
        this.$cookies.remove("refresh-token");
        this.$router.push('/sign')
      }
      else if (error.response.status === 401) {
        this.$cookies.remove("access-token");
        this.$cookies.remove('refresh-token')
        this.$router.push('/sign')
        this.$toast.show("Başka bir tarayıcıda açık oturumunuz bulunduğu için oturumunuz sonlandırılmıştır !", {
          theme: "bubble",
          icon: "check",
          type: "error",
          position: "bottom-right",
          duration: 5000
        });
      }
      else {
        this.$router.push({ path: '/error', query: { title: error.response.data, status: error.response.status } })
      }
    }
  },

  async change_status({ commit }, item) {
    const token = this.$cookies.get('refresh-token')
    this.$axios.defaults.headers.common['Authorization'] = 'Bearer ' + token

    try {
      commit('updateField', {
        path: 'loading',
        value: true
      })
      const response = await this.$axios.post('/changestatus', item)
      commit('updateField', {
        path: 'list',
        value: response.data.sentData
      })
      commit('updateField', {
        path: 'loading',
        value: false
      })
      for (var i = 0; i < response.data.sapMsg.length; i++) {
        if (response.data.sapMsg[i].TYPE === 'S') {
          response.data.sapMsg[i].TYPE = 'success'
          response.data.sapMsg[i].icon = 'check'
        }
        else if (response.data.sapMsg[i].TYPE === 'E') {
          response.data.sapMsg[i].TYPE = 'error'
          response.data.sapMsg[i].icon = 'cancel'
        }
        else if (response.data.sapMsg[i].TYPE === 'W') {
          response.data.sapMsg.splice(i, 1)
        }
        else if (response.data.sapMsg[i].TYPE === 'I') {
          response.data.sapMsg.splice(i, 1)
        }
        this.$toast.show(response.data.sapMsg[i].MESSAGE, {
          theme: "bubble",
          icon: response.data.sapMsg[i].icon,
          type: response.data.sapMsg[i].TYPE,
          position: "bottom-right",
          duration: 20000,
          action: {
            text: 'Close',
            onClick: (e, toastObject) => {
              toastObject.goAway(0);
            }
          }
        })
      }
    } catch (error) {
      commit('updateField', {
        path: 'loading',
        value: false
      })
      if (error.response.status === 422) {
        this.$cookies.remove("access-token");
        this.$cookies.remove("refresh-token");
        this.$router.push('/sign')
      }
      else if (error.response.status === 401) {
        this.$cookies.remove("access-token");
        this.$cookies.remove('refresh-token')
        this.$router.push('/sign')
        this.$toast.show("Başka bir tarayıcıda açık oturumunuz bulunduğu için oturumunuz sonlandırılmıştır !", {
          theme: "bubble",
          icon: "check",
          type: "error",
          position: "bottom-right",
          duration: 5000
        });
      }
      else {
        this.$router.push({ path: '/error', query: { title: error.response.data, status: error.response.status } })
      }
    }
  },

  async get_attach({ commit }, item) {

    const token = this.$cookies.get('refresh-token')
    this.$axios.defaults.headers.common['Authorization'] = 'Bearer ' + token

    try {
      commit('updateField', {
        path: 'loading',
        value: true
      })
      const response = await this.$axios.post('/getSasAttach', item)
      commit('updateField', {
        path: 'sasAttach',
        value: response.data.attach
      })
      commit('updateField', {
        path: 'asn',
        value: response.data.sentData
      })
      commit('updateField', {
        path: 'loading',
        value: false
      })
    } catch (error) {
      commit('updateField', {
        path: 'loading',
        value: false
      })
      if (error.response.status === 422) {
        this.$cookies.remove("access-token");
        this.$cookies.remove("refresh-token");
        this.$router.push('/sign')
      }
      else if (error.response.status === 401) {
        this.$cookies.remove("access-token");
        this.$cookies.remove('refresh-token')
        this.$router.push('/sign')
        this.$toast.show("Başka bir tarayıcıda açık oturumunuz bulunduğu için oturumunuz sonlandırılmıştır !", {
          theme: "bubble",
          icon: "check",
          type: "error",
          position: "bottom-right",
          duration: 5000
        });
      }
      else {
        this.$router.push({ path: '/error', query: { title: error.response.data, status: error.response.status } })
      }
    }
  },

  async filterItems({ commit }, item) {

    const token = this.$cookies.get('refresh-token')
    this.$axios.defaults.headers.common['Authorization'] = 'Bearer ' + token

    try {
      commit('updateField', {
        path: 'loading',
        value: true
      })
      const response = await this.$axios.post('/filter', item)
      commit('updateField', {
        path: 'list',
        value: response.data.sentData
      })
      commit('updateField', {
        path: 'loading',
        value: false
      })
      this.$toast.show('Siparişleriniz başarıyla filtrelenmiştir.', {
        theme: "bubble",
        icon: 'check',
        type: 'success',
        position: "bottom-right",
        duration: 3000,
      })
    } catch (error) {
      commit('updateField', {
        path: 'loading',
        value: false
      })
      if (error.response.status === 422) {
        this.$cookies.remove("access-token");
        this.$cookies.remove("refresh-token");
        this.$router.push('/sign')
      }
      else if (error.response.status === 401) {
        this.$cookies.remove("access-token");
        this.$cookies.remove('refresh-token')
        this.$router.push('/sign')
        this.$toast.show("Başka bir tarayıcıda açık oturumunuz bulunduğu için oturumunuz sonlandırılmıştır !", {
          theme: "bubble",
          icon: "check",
          type: "error",
          position: "bottom-right",
          duration: 5000
        });
      }
      else {
        this.$router.push({ path: '/error', query: { title: error.response.data, status: error.response.status } })
      }
    }
  },
}
