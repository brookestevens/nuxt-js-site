
export default {
  mode: 'universal',
  /*
  ** Headers of the page
  */
  head: {
    title: process.env.npm_package_name || '',
    meta: [
      { charset: 'utf-8' },
      { name: 'viewport', content: 'width=device-width, initial-scale=1' },
      { hid: 'description', name: 'description', content: process.env.npm_package_description || '' }
    ],
    link: [
      { rel: 'icon', type: 'image/x-icon', href: '/favicon.ico' }
    ]
  },
  /*
  ** Customize the progress-bar color
  */
  loading: { color: '#fff' },
  /*
  ** Global CSS
  */
  css: [
  ],
  /*
  ** Plugins to load before mounting the App
  */
  plugins: [
  ],
  /*
  ** Nuxt.js dev-modules
  */
  buildModules: [
  ],
  /*
  ** Nuxt.js modules
  */
  modules: [
    // Doc: https://bootstrap-vue.js.org
    'bootstrap-vue/nuxt',
    '@nuxtjs/onesignal',
    '@nuxtjs/pwa',
    '@nuxtjs/proxy'
  ],
  oneSignal: {
    init: {
      appId: process.env.APP_ID,
      allowLocalhostAsSecureOrigin: true,
      welcomeNotification: {
          disable: false,
          title: "Welcome",
          message: "Thanks for visiting!"
      },
      notifyButton: {
        enable: true,
        size: 'medium',
        position: 'bottom-left'
      }
    }
  },
  proxy: {
    '/api' : {
      target: 'http://localhost:8000'
    }
  },
  /*
  ** Build configuration
  */
  build: {
    extend (config, ctx) {
    }
  }
}
