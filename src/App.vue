<template>
  <keep-alive :include="['Home', 'SubActivity', 'product_details', 'category', 'search', 'Favestes', 'dailySpecialDetail', 'flashSale', 'about']" max="11">
    <router-view :key="curRouterLink" ref="pageComponent"></router-view>
  </keep-alive>
</template>

<script>
import Toast from './Toast.vue'
// import Toasts from './toast/index'
export default {
  components: {
    Toast
  },
  computed: {
    curRouterLink () {
      return this.$route.fullPath
    }
  },
  mounted () {
    // Toasts({
    //   duration: 2000,
    //   content: (
    //     <span class="toast-text" place="points">
    //       {'message'}
    //     </span>
    //   )
    // })
  }
}
</script>

<!-- <style>
.product-images{
  background: #f40;
}
</style> -->