import Vue from 'vue'
import VueRouter from 'vue-router'
const Home = () => import('@/view/home.vue')
// 参考 issue https://github.com/vuejs/vue-router/issues/2881#issuecomment-520554378
const originalPush = VueRouter.prototype.push
VueRouter.prototype.push = function push (location, onResolve, onReject) {
  if (onResolve || onReject) return originalPush.call(this, location, onResolve, onReject)
  return originalPush.call(this, location).catch((err) => {
    if (VueRouter.isNavigationFailure(err)) {
      // resolve err
      return err
    }
    // rethrow error
    return Promise.reject(err)
  })
}

Vue.use(VueRouter)

const routers = [
  {
    path: '/',
    name: 'home',
    component: Home,
    meta: {
      trackPageName: 'home',
      storeModule: 'home'
    }
  },
]
export default () => {
  const routes = [...routers]
  // const routes = [...activity, ...product, ...checkout, ...login, ...account, ...helpCenter, ...article, ...photowall, ...landing, ...blog, ...press]
  const langPath = '/:lang([a-z]{2,2})?'
  const langRoutes = routes.map(router => {
    if (router.path.indexOf(langPath) < 0) {
      router.path = langPath + router.path
    }
    return router
  })
  const router = new VueRouter({
    mode: 'history',
    routes: langRoutes,
    scrollBehavior (to, from, savedPosition) {
      if (savedPosition) {
        const patPagePosition = window._patPagePosition_
        if (patPagePosition && Object.prototype.hasOwnProperty.call(patPagePosition, to.fullPath)) {
          // 解决回退滚动位置问题
          return { x: 0, y: window._patPagePosition_[to.fullPath] }
        }
        return savedPosition
      } else {
        return { x: 0, y: 0 }
      }
    }
  })
  return router
}

const getRouterName = data => {
  let arr = []
  data.forEach(item => {
    if (item.name) {
      arr.push(item.name)
    }
    if (item.children && item.children.length > 0) {
      arr = arr.concat(getRouterName(item.children))
    }
  })
  return arr
}

const routerNameArr = getRouterName([])
/**
 * @description 获取所有路由name，提供branch页面浏览数据上报, 路由name改变注意branch事件上报对应的name要保持一致
 */
export const routerConfig = routerNameArr
