export default {
  mode: 'universal',
  /*
  ** Headers of the page
  */
  head: {
    title: process.env.npm_package_name || '',
    meta: [
      { charset: 'utf-8' },
      { name: 'viewport', content: 'width=device-width, initial-scale=1, shrink-to-fit=no' },
      { hid: 'description', name: 'description', content: process.env.npm_package_description || '' }
    ],
    link: [
      { rel: 'icon', type: 'image/x-icon', href: '/favicon.ico' },
      { rel: 'stylesheet', href: 'https://fonts.googleapis.com/css?family=Fredoka+One|Quicksand&display=swap'},
      { rel: 'apple-touch-icon', href: '/icon.png' },
      { rel: "apple-touch-startup-image", href: "/icon.png", media: "(device-width: 375px) and (device-height: 812px) and (-webkit-device-pixel-ratio: 3)" },
      // for iphone 6/7/8
      { rel: "apple-touch-startup-image", href: "/icon-375-667.png", media: "(device-width: 375px) and (device-height: 667px) and (-webkit-device-pixel-ratio: 2)" },
      { rel: "apple-touch-startup-image", href: "/icon.png", media: "(device-width: 414px) and (device-height: 736px) and (-webkit-device-pixel-ratio: 3)" },
      { rel: "apple-touch-startup-image", href: "/icon.png", media: "(device-width: 320px) and (device-height: 568px) and (-webkit-device-pixel-ratio: 2)" }
    ]
  },
  /*
  ** Customize the progress-bar color
  */
  loading: { color: '#E27272' },
  /*
  ** Global CSS - cannot access SCSS variales when using this. Styles must be in that file for it to work
  */
  css: [],
  /*
  ** Plugins to load before mounting the App
  */
  plugins: [{
    src: './plugins/localStorage.js',
    mode: 'client'
  }],
  /*
  ** Nuxt.js dev-modules
  */
  buildModules: [
  ],
  /*
  ** Nuxt.js modules
  */
  modules: [
    'bootstrap-vue/nuxt',
    '@nuxtjs/onesignal',
    '@nuxtjs/pwa',
    '@nuxtjs/proxy',
    '@nuxtjs/style-resources'
  ],
  bootsrapVue:{
    componentPlugins: ['ModalPlugin'],
    bootstrapVue: {
      bootstrapCSS: false,
      bootstrapVueCSS: false
    }
  },
  oneSignal: {
    init: {
      appId: process.env.APP_ID || '78791ca2-73df-4beb-9bec-a94da1b0a71e',
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
  pwa:{
    workbox:{
      skipWaiting : true,
      importScripts: ['./webPush-worker.js'],
      workboxExtensions: './plugins/backgroundSync-workbox.js'
    },
    manifest:{
      name: 'Nibble',
      background_color: '#E27272',
      lang: "en-US",
      orientation: "portrait-primary"
    },
    meta:{
      viewport: 'width=device-width, initial-scale=1, user-scalable=no',
      mobileAppIOS: true
    }
  },
  proxy: {
    '/api' : {
      target: 'http://localhost:8000'
    }
  },
  // Allows for using global varaibles in component files
  styleResources:{
    scss: [
      './assets/_global.scss', 
    ]
  },
  /*
  ** Build configuration
  */
  build: {
    extend (config, ctx) {
    }
  }
}
