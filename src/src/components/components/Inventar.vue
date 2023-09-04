<template>
  <section>
    <div class="row p-3 text-center justify-content-center">
      <div class="col-3 border border-dark p-2 m-1" v-for="(inventarItem, inventarKey) in inventar"
           :key="'inventar'+inventarKey">
        <img class="inventarIcon" v-if="inventarItem.icon && inventarItem.icon!==null" :src="inventarItem.icon" alt="">
        <p>{{ inventarItem.name }}</p>
        <span class="inventarCount">{{ inventarItem.value }}</span>
      </div>
    </div>
    <video ref="qrCodeScan"></video>
    <div class="row container game-footer bg-success position-absolute bottom-0">
      <div class="col-12 pt-2 pb-2 text-center">
        <button class="btn btn-sm btn-info" @click="readQrCode">
          Сканировать код
        </button>
      </div>
    </div>
  </section>
</template>

<script>
import QrScanner from 'qr-scanner'

export default ({
  name: 'Inventar',
  props: {
    inventar: Array
  },
  methods: {
    addInventarItem () {
      this.$props.inventar.push({
        name: 'Монеты',
        value: 5,
        icon: null
      })
    },
    readQrCode () {
      const qrScanner = new QrScanner(
        this.$refs.qrCodeScan,
        (result) => {
          console.log(result)
          qrScanner.stop()
        },
        {
          onDecodeError: error => {
            console.error(error)
          },
          highlightScanRegion: true,
          highlightCodeOutline: true
        })
      qrScanner.start()
    }
  }
})
</script>

<style scoped>
.inventarIcon {
  width: 50px;
  height: 50px;
}

.inventarCount {
  color: red
}

video {
  width: 100%;
}
</style>
