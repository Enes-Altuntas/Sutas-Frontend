import {
  getField,
  updateField
} from 'vuex-map-fields'

export const state = () => ({
  vendor_info: {
    APPR_TELF1: '',
    APPR_TELF2: '',
    APPR_TELFX: '',
    APPR_SMTP_ADDR: ''
  },
  vendor_list: [],
  vAttach: [],
  content: [],
  loading: '',
})

export const getters = {
  getField,
  getInfo(state) {
    try {
      return state.vendor_info
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
  getlist(state) {
    try {
      return state.vendor_list
    } catch (error) {
      return ''
    }
  },
  getAttach(state) {
    try {
      return state.vAttach
    } catch (error) {
      return ''
    }
  }
}

export const mutations = {
  updateField
}

export const actions = {
  async get_info({ commit }, item) {
    const token = this.$cookies.get('refresh-token')
    this.$axios.defaults.headers.common['Authorization'] = 'Bearer ' + token
    try {
      commit('updateField', {
        path: 'loading',
        value: true
      })
      const response = await this.$axios.post('/vendor', item)
      commit('updateField', {
        path: 'vendor_info',
        value: response.data.vendor_info[0]
      })
      commit('updateField', {
        path: 'vAttach',
        value: response.data.vendor_attachs
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

  async sendApprove({ commit }, item) {
    const token = this.$cookies.get('refresh-token')
    this.$axios.defaults.headers.common['Authorization'] = 'Bearer ' + token
    try {
      commit('updateField', {
        path: 'loading',
        value: true
      })
      const response = await this.$axios.post('/postapprove', item)
      commit('updateField', {
        path: 'vendor_list',
        value: response.data.vendor_list
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
          response.data.sapMsg[i].TYPE = 'info'
          response.data.sapMsg[i].icon = 'info'
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

  async get_list({ commit }, data) {
    const token = this.$cookies.get('refresh-token')
    this.$axios.defaults.headers.common['Authorization'] = 'Bearer ' + token

    try {
      commit('updateField', {
        path: 'loading',
        value: true
      })
      const response = await this.$axios.post('/vendorlist', data)
      commit('updateField', {
        path: 'vendor_list',
        value: response.data.vendor_list
      })
      commit('updateField', {
        path: 'loading',
        value: false
      })
      this.$toast.show('Tedarikçi listeniz başarıyla çekilmiştir.', {
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

  async sendRevPerInfo({ commit }, data) {
    const token = this.$cookies.get('refresh-token')
    this.$axios.defaults.headers.common['Authorization'] = 'Bearer ' + token

    try {
      commit('updateField', {
        path: 'loading',
        value: true
      })
      const response = await this.$axios.post('/vRevPerUpdate', data)
      commit('updateField', {
        path: 'vendor_list',
        value: response.data.vendor_info[0]
      })
      commit('updateField', {
        path: 'show',
        value: true
      })
      commit('updateField', {
        path: 'loading',
        value: false
      })
      this.$toast.show('Yeni firma bilgileriniz onaycıya sunulmuştur.', {
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

  async sendRevInfo({ commit }, data) {
    const token = this.$cookies.get('refresh-token')
    this.$axios.defaults.headers.common['Authorization'] = 'Bearer ' + token

    try {
      commit('updateField', {
        path: 'loading',
        value: true
      })
      const response = await this.$axios.post('/vRevUpdate', data)

      commit('updateField', {
        path: 'vendor_list',
        value: response.data.vendor_info[0]
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
          response.data.sapMsg[i].TYPE = 'info'
          response.data.sapMsg[i].icon = 'info'
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

  async send_attach({ commit }, data) {
    const token = this.$cookies.get('refresh-token')
    this.$axios.defaults.headers.common['Authorization'] = 'Bearer ' + token
    try {
      commit('updateField', {
        path: 'loading',
        value: true
      })
      const response = await this.$axios.post('/postVenAttach', data)
      commit('updateField', {
        path: 'vAttach',
        value: response.data.vendor_attachs
      })
      commit('updateField', {
        path: 'loading',
        value: false
      })
      this.$toast.show('Ekleriniz başarıyla yüklenmiştir.', {
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

  async del_attach({ commit }, data) {
    const token = this.$cookies.get('refresh-token')
    this.$axios.defaults.headers.common['Authorization'] = 'Bearer ' + token
    try {
      commit('updateField', {
        path: 'loading',
        value: true
      })
      const response = await this.$axios.post('/delVenAttach', data)
      commit('updateField', {
        path: 'vAttach',
        value: response.data.vendor_attachs
      })
      commit('updateField', {
        path: 'loading',
        value: false
      })
      this.$toast.show('Ekleriniz başarıyla silinmiştir.', {
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
