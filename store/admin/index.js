import { getField, updateField } from 'vuex-map-fields'
export const strict = false

export const state = () => ({
    adminDialog: true,
    loading: '',
    users: []
})

export const getters = {
  getField,
  getDialog(state) {
    try {
      return state.adminDialog
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
  getUserInfo(state) {
    try {
      return state.users
    } catch (error) {
      return ''
    }
  },
}

export const mutations = {
  updateField
}

export const actions = {
  async sendAdminPass({commit}, item) {

    const token = this.$cookies.get('refresh-token')
    this.$axios.defaults.headers.common['Authorization'] = 'Bearer ' + token

    try {
      commit('updateField', {
        path: 'loading',
        value: true
      })
      const response = await this.$axios.post('/sendPass', item)
      

      commit('updateField', {
        path: 'adminDialog',
        value: response.data.dialog
      })
      commit('updateField', {
        path: 'loading',
        value: false
      })
      this.$toast.show('Girdiğiniz şifre başarıyla doğrulanmıştır.', { 
        theme: "bubble", 
        icon : 'check',
        type: 'success',
        position: "bottom-right", 
        duration : 3000,
      })
      this.$cookies.set('refresh-token', response.data.refresh_token)
    } catch (error) {
      commit('updateField', {
        path: 'loading',
        value: false
      })
      if(error.response.status === 422) {
        this.$router.push('/sign')
      }
      else if(error.response.status === 401) {
        this.$cookies.remove('refresh-token')
        this.$router.push('/sign')
      }
      else {
        this.$router.push({ path: '/error', query: {title: error.response.data, status: error.response.status} })
      }
    }
  },

  async getUsers({commit}, item) {

    const token = this.$cookies.get('refresh-token')
    this.$axios.defaults.headers.common['Authorization'] = 'Bearer ' + token

    try {
      commit('updateField', {
        path: 'loading',
        value: true
      })
      const response = await this.$axios.post('/getUsers', item)
      

      commit('updateField', {
        path: 'users',
        value: response.data.users
      })
      commit('updateField', {
        path: 'loading',
        value: false
      })
      this.$toast.show('Kullanıcılar ve şifreleri başarıyla çekilmiştir.', { 
        theme: "bubble", 
        icon : 'check',
        type: 'success',
        position: "bottom-right", 
        duration : 3000,
      })
      this.$cookies.set('refresh-token', response.data.refresh_token)
    } catch (error) {
      commit('updateField', {
        path: 'loading',
        value: false
      })
      if(error.response.status === 422) {
        this.$router.push('/sign')
      }
      else if(error.response.status === 401) {
        this.$cookies.remove('refresh-token')
        this.$router.push('/sign')
      }
      else {
        this.$router.push({ path: '/error', query: {title: error.response.data, status: error.response.status} })
      }
    }
  },

  async sendInfoDB({commit}, item) {

    const token = this.$cookies.get('refresh-token')
    this.$axios.defaults.headers.common['Authorization'] = 'Bearer ' + token

    try {
      commit('updateField', {
        path: 'loading',
        value: true
      })
      const response = await this.$axios.post('/update', item)
      

      commit('updateField', {
        path: 'users',
        value: response.data.users
      })
      commit('updateField', {
        path: 'loading',
        value: false
      })
      this.$toast.show('Kullanıcı bilgileri başarıyla değiştirilmiştir.', { 
        theme: "bubble", 
        icon : 'check',
        type: 'success',
        position: "bottom-right", 
        duration : 3000,
      })
      this.$cookies.set('refresh-token', response.data.refresh_token)
    } catch (error) {
      commit('updateField', {
        path: 'loading',
        value: false
      })
      if(error.response.status === 422) {
        this.$router.push('/sign')
      }
      else if(error.response.status === 401) {
        this.$cookies.remove('refresh-token')
        this.$router.push('/sign')
      }
      else {
        this.$router.push({ path: '/error', query: {title: error.response.data, status: error.response.status} })
      }
    }
  },

  async sendDelInfo({commit}, item) {

    const token = this.$cookies.get('refresh-token')
    this.$axios.defaults.headers.common['Authorization'] = 'Bearer ' + token

    try {
      commit('updateField', {
        path: 'loading',
        value: true
      })
      const response = await this.$axios.post('/delete', item)
      

      commit('updateField', {
        path: 'users',
        value: response.data.users
      })
      commit('updateField', {
        path: 'loading',
        value: false
      })
      this.$toast.show('Kullanıcı başarıyla silinmiştir.', { 
        theme: "bubble", 
        icon : 'check',
        type: 'success',
        position: "bottom-right", 
        duration : 3000,
      })
      this.$cookies.set('refresh-token', response.data.refresh_token)
    } catch (error) {
      commit('updateField', {
        path: 'loading',
        value: false
      })
      if(error.response.status === 422) {
        this.$router.push('/sign')
      }
      else if(error.response.status === 401) {
        this.$cookies.remove('refresh-token')
        this.$router.push('/sign')
      }
      else {
        this.$router.push({ path: '/error', query: {title: error.response.data, status: error.response.status} })
      }
    }
  },
}
