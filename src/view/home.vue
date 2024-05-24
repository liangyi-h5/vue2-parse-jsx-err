<template>
  <div class="">home</div>
</template>

<script >

import Toast from '../toast/index'

interface O {
  id: string
}
export default {
  mounted () {
    const a:O = {
      id: 'sfcd'
    }
    console.log(a)
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