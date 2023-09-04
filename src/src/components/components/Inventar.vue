<template>
  <section>
    <div class="row p-3 text-center justify-content-center" v-if="initScaner===false">
      <div class="col-12 text-center" v-if="inventar.length===0">
        Инвентарь пуст
      </div>
      <div class="col-3 border border-dark p-2 m-1 inventar-object-item"
           v-else
           v-for="(inventarItem, inventarKey) in inventar"
           :key="'inventar'+inventarKey">
        <input type="radio" class="custom-checkbox" name="selectObject" :id="'selectObject'+inventarKey"
               :value="inventarKey" v-model="selectedObject">
        <label :for="'selectObject'+inventarKey">
          <img class="inventarIcon" v-if="inventarItem.icon && inventarItem.icon!==null" :src="inventarItem.icon"
               alt="">
          <p v-if="inventarItem.name">{{ inventarItem.name }}</p>
          <span class="inventarCount" v-if="inventarItem.value">
            {{inventarItem.value}}
          </span>
        </label>
      </div>
    </div>

    <video v-show="initScaner" ref="qrCodeScan"></video>

    <div class="row container game-footer bg-success position-absolute bottom-0 pb-5  text-center pt-2">
      <div class="col-12 mb-2">
        <button class="btn btn-warning" @click="readQrCode">
          <i class="fa fa-qrcode"></i>
          Сканировать
        </button>
      </div>
      <div class="col-6">
        <button class="btn btn-danger" @click="removeInventarObject()">
          <i class="fa fa-trash"></i>
        </button>
      </div>
      <div class="col-6">
        <button class="btn btn-info" @click="useInventarObject()">
          <i class="fa fa-hand"></i>
        </button>
      </div>
    </div>
  </section>
</template>

<script>
import QrScanner from 'qr-scanner'

export default ({
  name: 'Inventar',
  data () {
    return {
      initScaner: false,
      selectedObject: null
    }
  },
  props: {
    inventar: Array,
    objects: Array
  },
  methods: {
    addInventarItem (objectItem) {
      let inventarElements = this.$props.inventar.map((item) => {
        return Number(item.key)
      })
      if (inventarElements.indexOf(objectItem.key) === -1) {
        this.$props.inventar.push(JSON.parse(JSON.stringify(objectItem)))
      }
    },
    readQrCode () {
      this.initScaner = true
      const qrScanner = new QrScanner(
        this.$refs.qrCodeScan,
        (result) => {
          qrScanner.stop()
          this.initScaner = false
          document.querySelectorAll('.scan-region-highlight').forEach((region) => {
            region.remove()
          })

          let qrCodeData = result.data.split(':')
          for (let objectIndex in this.$props.objects) {
            let object = this.$props.objects[objectIndex]
            if (object.use !== true && Number(object.key) === Number(qrCodeData[0])) {
              this.addInventarItem(object)
              object.use = true
            }
          }
        },
        {
          onDecodeError: error => {
            console.error(error)
          },
          highlightScanRegion: true,
          highlightCodeOutline: true
        })

      qrScanner.start()
    },
    removeInventarObject () {
      if (this.selectedObject !== null) {
        this.$props.inventar.splice(this.selectedObject, 1)
        this.selectedObject = null
      }
    },
    useInventarObject () {
      this.$emit('useInventarObject', this.$props.inventar[this.selectedObject])
      this.$props.inventar.splice(this.selectedObject, 1)
    }
  }
})
</script>

<style scoped>
.game-footer{
  //height: 25vh;
}
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

.inventar-object-item * {
  cursor: pointer;
}

.custom-checkbox {
  position: absolute;
  z-index: -1;
  opacity: 0;
}

.custom-checkbox + label {
  display: inline-flex;
  align-items: center;
  user-select: none;
}

.custom-checkbox:checked + label {
  background-color: greenyellow;
}

.custom-checkbox:checked + label::before {
  border-color: #0b76ef;
  background-color: #0b76ef;
  background-image: url("data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 8 8'%3e%3cpath fill='%23fff' d='M6.564.75l-3.59 3.612-1.538-1.55L0 4.26 2.974 7.25 8 2.193z'/%3e%3c/svg%3e");
}

/* стили при наведении курсора на checkbox */
.custom-checkbox:not(:disabled):not(:checked) + label:hover::before {
  border-color: #b3d7ff;
}

/* стили для активного состояния чекбокса (при нажатии на него) */
.custom-checkbox:not(:disabled):active + label::before {
  background-color: #b3d7ff;
  border-color: #b3d7ff;
}

/* стили для чекбокса, находящегося в фокусе */
.custom-checkbox:focus + label::before {
  box-shadow: 0 0 0 0.2rem rgba(0, 123, 255, 0.25);
}

/* стили для чекбокса, находящегося в фокусе и не находящегося в состоянии checked */
.custom-checkbox:focus:not(:checked) + label::before {
  border-color: #80bdff;
}

/* стили для чекбокса, находящегося в состоянии disabled */
.custom-checkbox:disabled + label::before {
  background-color: #e9ecef;
}
</style>
