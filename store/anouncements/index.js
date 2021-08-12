import { getField, updateField } from 'vuex-map-fields'
export const strict = false

export const state = () => ({
  anounces: [],
  user_ids: [],
  attaches: [],
  loading: '',
  content: []
})

export const getters = {
  getField,
  getAnounce(state) {
    try {
      return state.anounces
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
  getUsers(state) {
    try {
      return state.user_ids
    } catch (error) {
      return ''
    }
  },
  getHelpAtt(state) {
    try {
      return state.attaches
    } catch (error) {
      return ''
    }
  },
}

export const mutations = {
  updateField
}

export const actions = {
  async pullAnounce({ commit }) {

    const token = this.$cookies.get('refresh-token')
    this.$axios.defaults.headers.common['Authorization'] = 'Bearer ' + token
    try {
      commit('updateField', {
        path: 'loading',
        value: true
      })
      const response = await this.$axios.post('/anounce')
      commit('updateField', {
        path: 'anounces',
        value: response.data.anounces
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

  async sendAnounce({ commit }, item) {

    const token = this.$cookies.get('refresh-token')
    this.$axios.defaults.headers.common['Authorization'] = 'Bearer ' + token

    try {
      commit('updateField', {
        path: 'loading',
        value: true
      })
      const response = await this.$axios.post('/anounceadd', item)
      commit('updateField', {
        path: 'anounces',
        value: response.data.anounces
      })
      commit('updateField', {
        path: 'loading',
        value: false
      })
      this.$toast.show('Duyurunuz başarıyla yüklenmiştir.', {
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

  async pullAttach({ commit }, item) {

    const token = this.$cookies.get('refresh-token')
    this.$axios.defaults.headers.common['Authorization'] = 'Bearer ' + token

    try {
      commit('updateField', {
        path: 'loading',
        value: true
      })
      const response = await this.$axios.post('/getHelpAtt', item)
      commit('updateField', {
        path: 'attaches',
        value: response.data.attaches
      })
      commit('updateField', {
        path: 'loading',
        value: false
      })
      this.$toast.show('Kullanıcı kılavuzlarınız çekilmiştir !', {
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

  async delAnounce({ commit }, item) {

    const token = this.$cookies.get('refresh-token')
    this.$axios.defaults.headers.common['Authorization'] = 'Bearer ' + token

    try {
      commit('updateField', {
        path: 'loading',
        value: true
      })
      const response = await this.$axios.post('/anouncedel', item)
      commit('updateField', {
        path: 'anounces',
        value: response.data.anounces
      })
      commit('updateField', {
        path: 'loading',
        value: false
      })
      this.$toast.show('Duyurunuz başarıyla silinmiştir.', {
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

  async pushAttach({ commit }, item) {

    const token = this.$cookies.get('refresh-token')
    this.$axios.defaults.headers.common['Authorization'] = 'Bearer ' + token

    try {
      commit('updateField', {
        path: 'loading',
        value: true
      })
      const response = await this.$axios.post('/pushAttach', item)

      commit('updateField', {
        path: 'attaches',
        value: response.data.attaches
      })
      commit('updateField', {
        path: 'loading',
        value: false
      })
      this.$toast.show('Ek yüklemem işleminiz başarıyla gerçekleşmiştir !', {
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

  async delAttach({ commit }, item) {

    const token = this.$cookies.get('refresh-token')
    this.$axios.defaults.headers.common['Authorization'] = 'Bearer ' + token

    try {
      commit('updateField', {
        path: 'loading',
        value: true
      })
      const response = await this.$axios.post('/delHelpAtt', item)

      commit('updateField', {
        path: 'attaches',
        value: response.data.attaches
      })
      commit('updateField', {
        path: 'loading',
        value: false
      })
      this.$toast.show('Ek silme işleminiz başarıyla gerçekleşmiştir !', {
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
  }
}
