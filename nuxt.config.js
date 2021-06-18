import colors from 'vuetify/es5/util/colors'

export default {
  head: {
    titleTemplate: '%s - Tedarikçi Portalı',
    title: 'Sütaş A.Ş.',
    meta: [
      { charset: 'utf-8' },
      { name: 'viewport', content: 'width=device-width, initial-scale=1' },
      { hid: 'description', name: 'description', content: '' }
    ],
    link: [
      { rel: 'icon', type: 'image/x-icon', href: '/sutas.ico' },
      {
        rel: 'stylesheet',
        href:
          'https://fonts.googleapis.com/css?family=Roboto:300,400,500,700|Material+Icons'
      }
    ]
  },

  css: [
  ],

  plugins: [
    { src: '~/plugins/helper' }
  ],

  buildModules: [
    '@nuxtjs/vuetify',
  ],

  modules: [
    '@nuxtjs/axios',
    'cookie-universal-nuxt',
    '@nuxtjs/toast',
  ],


  // axios: {
  //   baseURL: 'http://127.0.0.1:5000/api/v1',
  //   credentials: false
  // },

  axios: {
    baseURL: 'https://tedarikciportalapitest.sutas.com.tr/api/v1',
    credentials: false
  },

  // axios: {
  //   baseURL: 'https://tedarikciportalapi.sutas.com.tr/api/v1',
  //   credentials: false
  // },

  router: {
  },

  vuetify: {
    customVariables: ['~/assets/variables.scss'],
    theme: {
      dark: true,
      themes: {
        dark: {
          primary: colors.grey.lighten5,
          accent: colors.grey.darken3,
          secondary: colors.amber.darken3,
          info: colors.teal.lighten1,
          warning: colors.amber.base,
          error: colors.deepOrange.accent4,
          success: colors.green.accent3
        }
      }
    }
  },

  build: {
  }
}
