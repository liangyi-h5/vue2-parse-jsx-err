import Toast from './toast.js'
let toastInstance

console.log(Toast.newInstance, 'newInstance')
function getInstance (params) {
  toastInstance = toastInstance || Toast.newInstance(params)
  return toastInstance
}

function instance (params) {
  const instance = getInstance(params)

  instance.show(params)
  // return instance
}

export default instance
