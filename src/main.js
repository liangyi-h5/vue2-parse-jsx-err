import Vue from 'vue'
import App from './App.vue'
import createRouter from './router/index'

export default (context) => {
  const router = createRouter()
  const app = new Vue({
    data: { url: context ? context.url : '' },
    router,
    render: (h) => h(App)
  })

  return { app, router }
}
