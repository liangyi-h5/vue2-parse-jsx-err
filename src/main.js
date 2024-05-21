import { sync } from 'vuex-router-sync'
import Vue from 'vue'
import App from './App.vue'
import createRouter from './router'
import createStore from './store'
import patpatUI from 'patpat-ui'
import { createL10n } from './l10n'
import { createI18n } from './i18n'
import verification from './assets/js/verification'
import { lazyImgFilter } from './vlazy'
import VueLazyload from 'vue-lazyload'
import { getSessionStorage, setSessionStorage, setLocalStore, delSessionStorage } from './utils/storage'
// import PatRouterLink from './components/base/PatRouterLink.vue'
// import PatImg from './components/base/PatImg.vue'
// import PatProductImg from './components/base/PatProductImg.vue'
import I18nTemplate from './components/base/I18nTemplate.vue'
import * as gUtils from './utils/global'
import * as directives from './directives'
import VueSkipTo from '@/plugins/skipto'
import a11yModal from '@/plugins/a11y/modal'
import ClientOnly from 'vue-client-only'
import { getTimeOrigin } from './utils/base'
import intercomSDK from './utils/intercomSDK'
// 完整加载
import VueLuckyCanvas from '@lucky-canvas/vue'

// 公共样式
import './styles/app.less'
import './styles/fonts.less'
import homePositionIdConfig from './configs/homePositionIdConfig'
import { useCloseAddToCartPopup } from './utils/hooks'
import { useRemovePopupClass } from './utils/popupClass'

// ui 库样式单独打包
import(/* webpackChunkName: 'patUi' */'patpat-ui/lib/patpat-ui.css').catch(() => {})

/** @description 在客户端按需加载的css */
import(/* webpackChunkName: 'common' */'./styles/accessibility.less').catch(() => {})

Vue.config.productionTip = false
if (process.env.NODE_ENV !== 'production') {
  Vue.config.devtools = true
}
Vue.prototype.$verify = verification
Vue.prototype.$ppUtils = gUtils
Vue.prototype.$intercom = intercomSDK

Vue.use(patpatUI)

Vue.use(VueSkipTo)
Vue.use(a11yModal)
Vue.use(VueLuckyCanvas)
// hack for dymic render
const originPatDialogs = Vue.prototype.$patDialogs
function patDialogs (options) {
  // 运行时调用，this指向为当前vue实例
  try {
    setTimeout(() => {
      this.$a11yModal('.pat-dialog[role="dialog"]')
    }, 0)
  } catch (error) {
    console.warn('dialog error', error)
  }
  return originPatDialogs.call(this, options)
}
Vue.prototype.$patDialogs = patDialogs
patDialogs.close = originPatDialogs

Vue.use(VueLazyload, lazyImgFilter)

Object.keys(directives).forEach(key => {
  Vue.directive(key, directives[key])
})

// if (process.env.NODE_ENV === 'development' && !Vue.prototype.$isServer) {
//   const VueAxe = require('@/plugins/axe').default
//   Vue.use(VueAxe, {
//     delay: 1500,
//     allowConsoleClears: false,
//     clearConsoleOnUpdate: false
//   })
// }

// Vue.component(PatRouterLink.name, PatRouterLink)
// Vue.component(PatImg.name, PatImg)
// Vue.component(PatProductImg.name, PatProductImg)
Vue.component(I18nTemplate.name, I18nTemplate)
Vue.component('ClientOnly', ClientOnly)

export default () => {
  const router = createRouter()
  const store = createStore()
  // sync so that route state is available as part of the store
  sync(store, router)

  router.beforeEach(function (to, from, next) {
    if (!Vue.prototype.$isServer) {
      setLocalStore('referrer_url', window.location.origin + from.fullPath)
      if (window.perfStart) {
        window.perfStart = Date.now()
      } else {
        window.perfStart = getTimeOrigin()
      }
      if (to.meta && to.meta.seoTitle) {
        document.title = to.meta.seoTitle
      }
      const lastPagePositionId = getSessionStorage('last_page_position_id')
      document.body.classList.remove('popup-no-scroll')
      document.body.classList.remove('bg-fixed')
      document.body.classList.remove('no-scroll')
      useRemovePopupClass()
      useCloseAddToCartPopup()
      if (lastPagePositionId) {
        const isHomePosition = homePositionIdConfig.some(item => lastPagePositionId.includes(item))
        if (isHomePosition) {
          setSessionStorage('home_position', lastPagePositionId)
          const lastClickPositionContent = getSessionStorage('last_click_position_content')
          lastClickPositionContent && setSessionStorage('home_position_content', lastClickPositionContent)
        }
        if (to.name === 'home') {
          delSessionStorage('home_position', '')
          delSessionStorage('home_position_content', '')
        }
      }
      if (window._patPagePosition_) {
        if (from.name === 'product_details') {
          window._patPagePosition_[from.fullPath] = document.body.scrollTop || document.documentElement.scrollTop
        }
      } else {
        window._patPagePosition_ = {}
      }
    }
    next()
  })

  const l10nCurrency = createL10n()
  const i18n = createI18n()
  const app = new Vue({
    router,
    store,
    i18n,
    l10nCurrency,
    render: (h) => h(App)
  })

  return { app, router, store }
}
