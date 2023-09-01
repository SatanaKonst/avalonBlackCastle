<template>
  <div class="container bg-primary mh-100 p-0 game-zone">
    <div class="row game-header bg-danger">
      <div class="col-3">
        Cила
        <div class="progress">
          <div class="progress-bar"
               role="progressbar"
               :style="'width:' +(100/maxUserSettingsVariant * userSettings.strength)+'%'"
               :aria-valuenow="userSettings.strength"
               aria-valuemin="0"
               :aria-valuemax="maxUserSettingsVariant">{{userSettings.strength}}</div>
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
               :aria-valuemax="maxUserSettingsVariant">{{userSettings.agility}}</div>
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
               :aria-valuemax="maxUserSettingsVariant">{{userSettings.charisma}}</div>
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
          Инвентарь
        </template>
        <template v-else>
          <template v-if="currentLevel===null">
            Ошибка получения стартового уровня
          </template>
          <template v-else>
            <h1 class="text-center mb-2">{{ currentLevel.data.name }}</h1>
            <p class="mb-2" v-if="currentLevel.data.description">
              {{ currentLevel.data.description }}
            </p>
            <div class="row" v-for="(resource, resourceKey) in currentLevel.data.resource"
                 :key="'resource'+resourceKey">
              <template v-if="resourceKey==='images'">
                <div class="col-12">
                  <img v-for="(image, imageIndex) in resource" :key="'image'+imageIndex" :src="image"
                       class="img-thumbnail rounded" alt="image">
                </div>
              </template>
              <template v-if="resourceKey==='audio'">
                <div class="col-12">
                  <audio controls v-for="(audio, audioIndex) in resource" :key="'audio'+audioIndex">
                    <source :src="audio">
                    Your browser does not support the audio element.
                  </audio>
                </div>
              </template>
              <template v-if="resourceKey==='video'">
                <div class="col-12">
                  Тут блоки с видео
                </div>
              </template>
            </div>
          </template>
        </template>
      </div>
    </div>

    <div class="row game-footer bg-success">
      <div class="col-12 pt-2 pb-2 text-center" v-if="showInventar===false">
        <template v-if="currentLevel!==null && currentLevel.links">
          <h3>Следующая локация</h3>
          <button class="btn btn-sm btn-info m-1"
                  v-for="(level, levelIndex) in currentLevel.links"
                  v-if="Number(level.toId)!==Number(currentLevel.id)"
                  :key="'level'+levelIndex"
                  @click="selectNextLevel(level.toId)"
          >
            {{ getNextLevelName(level.toId) }}
          </button>
        </template>
      </div>
    </div>
  </div>
</template>

<script>
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
  mounted () {
    let link = document.createElement("link");
    link.href = "/static/fontawesome-6.4.0/css/all.css";
    link.type = "text/css";
    link.rel = "stylesheet";

    document.getElementsByTagName("head")[0].appendChild(link);

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
    getNextLevelName (levelId) {
      for (let levelIndex in this.levels) {
        let level = this.levels[levelIndex]
        if (Number(level.id) === Number(levelId)) {
          return level.data.name
        }
      }
    },
    selectNextLevel (levelId) {
      for (let levelIndex in this.levels) {
        let level = this.levels[levelIndex]
        if (Number(level.id) === Number(levelId)) {
          this.currentLevel = level
        }
      }
    }
  }
})
</script>

<style scoped>
.game-zone {
  height: 100vh;
}

.game-header {
  height: 10vh;
}

.game-content {
  height: 60vh;
  overflow-y: auto;
}

.game-content .img-thumbnail {
  height: 150px;
}

.game-footer {
  height: 30vh;
  overflow-y: auto;
}
</style>
