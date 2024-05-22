import Toast from './toast.vue'
import Vue from 'vue'

console.log(Toast, 'Toast------')
Toast.newInstance = properties => {
  const props = Object.assign({
    visible: true
  }, properties) || {}

  const Instance = new Vue({
    data: props,
    render (h) {
      return h(Toast, {
        props: props
      })
    }
  })
  const component = Instance.$mount()
  document.body.appendChild(component.$el)

  // if (props.duration > 0) {
  //   component.timer = setTimeout(() => {
  //     props.visible = false
  //   }, props.duration)
  // }

  return {
    show (params) {
      props.content = params.content
      props.duration = params.duration
      props.visible = true
      if (component.timer) {
        clearTimeout(component.timer)
        component.timer = null
      }

      if (props.duration > 0) {
        component.timer = setTimeout(() => {
          props.visible = false
        }, props.duration)
      }
    },
    hide () {
      props.visible = false
    }
  }
}

export default Toast
