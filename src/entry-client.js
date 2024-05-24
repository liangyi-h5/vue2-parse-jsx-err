
import createApp from './main'

const { app, router } = createApp()

router.onReady(() => {
  app.$mount('#app')
})
// app.$mount('#app')
