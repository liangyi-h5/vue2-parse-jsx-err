<template>
  <div class="">home</div>
</template>

<script>

import Toast from '../toast/index'
export default {
  mounted () {

    Toast({
      duration: 2000,
      content: (
        <span class="toast-text" place="points">
          {'message'}
        </span>
      )
    })
  }
}
</script>

<style>

</style>