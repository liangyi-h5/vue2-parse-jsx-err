<script>

let num = 0

function getId () {
  return 'alert_' + (num++)
}
export default {
  name: 'OrderToast',
  functional: true,
  render (h, context) {
    const { props } = context
    const {
      visible,
      content
    } = props
    const key = getId()
    return (
      <Transition name="fade" appear>
        {
          visible ? (
            <div class="order-toast" key={key}>
              {typeof content === 'function' ? content(h) : content}
            </div>
          ) : null
        }
      </Transition>
    )
  }
}

</script>
<style scoped>

.order-toast {
  max-width: 82%;
  z-index: 1000;
  width: auto;
  background-color: rgba(0, 0, 0, 0.8);
  position: fixed;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  padding: 14px 18px;
  text-align: center;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #FFFFFF;
  width: fit-content;
}
</style>