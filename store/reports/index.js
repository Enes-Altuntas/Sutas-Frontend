import { getField, updateField } from 'vuex-map-fields'
export const strict = false

export const state = () => ({
  reports: [],
  loading: ''
})

export const getters = {
  getField,
  getReports(state) {
    try {
      return state.reports
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
}

export const mutations = {
  updateField
}

export const actions = {
  cleanTable({ commit }) {
    commit('updateField', {
      path: 'reports',
      value: []
    })
  },
  async sendFilter({ commit }, item) {

    const token = this.$cookies.get('refresh-token')
    this.$axios.defaults.headers.common['Authorization'] = 'Bearer ' + token

    try {
      commit('updateField', {
        path: 'loading',
        value: true
      })
      const response = await this.$axios.post('/getReport', item)

      commit('updateField', {
        path: 'reports',
        value: response.data.reports
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
}
