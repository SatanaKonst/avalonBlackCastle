<template>
  <div class="container bg-primary mh-100 game-zone">
    <div class="row game-header bg-danger">
      <div class="col-3">
        Cила
        <div class="progress">
          <div class="progress-bar"
               role="progressbar"
               :style="'width:' +(100/maxUserSettingsVariant * userSettings.strength)+'%'"
               :aria-valuenow="userSettings.strength"
               aria-valuemin="0"
               :aria-valuemax="maxUserSettingsVariant">{{ userSettings.strength }}
          </div>
        </div>
      </div>
      <div class="col-3">
        Ловкость
        <div class="progress">
          <div class="progress-bar"
               role="progressbar"
               :style="'width:' +(100/maxUserSettingsVariant * userSettings.agility)+'%'"
               :aria-valuenow="userSettings.agility"
               aria-valuemin="0"
               :aria-valuemax="maxUserSettingsVariant">{{ userSettings.agility }}
          </div>
        </div>
      </div>
      <div class="col-3">
        Обаяние
        <div class="progress">
          <div class="progress-bar"
               role="progressbar"
               :style="'width:' +(100/maxUserSettingsVariant * userSettings.charisma)+'%'"
               :aria-valuenow="userSettings.charisma"
               aria-valuemin="0"
               :aria-valuemax="maxUserSettingsVariant">{{ userSettings.charisma }}
          </div>
        </div>
      </div>
      <div class="col-3 align-self-center">
        <button class="btn btn-secondary float-end" @click="showInventar=!showInventar">
          <i class="fa-solid fa-box"></i>
        </button>
      </div>
    </div>

    <div class="row game-content bg-warning">
      <div class="col-12">
        <template v-if="levels.length===0">
          <label>
            Загрузите сценарий игры
            <input class="form-control"
                   type="file"
                   @change="importExportFile"
                   value="Импорт">
          </label>
        </template>
        <template v-else-if="showInventar===true">
          <inventar-component :inventar="inventar"
                              :objects="objects"
                              @useInventarObject="useInventarObject($event)"></inventar-component>
        </template>
        <template v-else>
          <play-component v-if="currentLevel!==null"
                          :currentLevel="currentLevel"
                          :levels="levels"></play-component>
        </template>
      </div>
    </div>

  </div>
</template>

<script>
import Inventar from './components/Inventar.vue'
import play from './components/Play.vue'

export default ({
  name: 'Game',
  data () {
    return {
      maxUserSettingsVariant: 6,
      currentLevel: null,
      userSettings: {
        strength: 0,
        agility: 0,
        charisma: 0
      },
      levels: [],
      objects: [],
      monsters: [],
      showInventar: false,
      inventar: []
    }
  },
  components: {
    inventarComponent: Inventar,
    playComponent: play
  },
  mounted () {
    let link = document.createElement('link')
    link.href = '/static/fontawesome-6.4.0/css/all.css'
    link.type = 'text/css'
    link.rel = 'stylesheet'

    document.getElementsByTagName('head')[0].appendChild(link)

    this.userSettings = this.getStartUserSettings(this.maxUserSettingsVariant)
  },
  methods: {
    getStartUserSettings (max) {
      let generate = function () {
        return Math.floor(Math.random() * max) + 1
      }
      return {
        strength: generate(),
        agility: generate(),
        charisma: generate()
      }
    },
    importExportFile (event) {
      let file = event.target.files[0]
      let fr = new FileReader()
      fr.onload = () => {
        try {
          let tmp = JSON.parse(fr.result)
          this.objects = (tmp.objects) ? tmp.objects : []
          this.monsters = (tmp.monsters) ? tmp.monsters : []
          this.levels = (tmp.nodes) ? tmp.nodes : []
          if (this.levels.length > 0) {
            this.currentLevel = this.levels[0]
          }
        } catch (e) {
          console.error('error parse import file', e)
          this.nodes = []
        }
      }

      fr.readAsText(file)
    },
    useInventarObject (inventarObject) {
      console.log(inventarObject)
      // TODO::Описать использование предмета из инвентаря
    }
  }
})
</script>

<style scoped>

</style>
