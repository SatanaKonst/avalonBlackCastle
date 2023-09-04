<template>
  <section v-if="currentLevel.data">
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
    <div class="row container game-footer bg-success position-absolute bottom-0">
      <div class="col-12 pt-2 pb-2 text-center">
        <template v-if="currentLevel.links">
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
  </section>
</template>

<script>
export default ({
  name: 'Play',
  props: {
    currentLevel: Object,
    levels: Array
  },
  methods: {
    selectNextLevel(levelId) {
      for (let levelIndex in this.$props.levels) {
        let level = this.$props.levels[levelIndex]
        if (Number(level.id) === Number(levelId)) {
          this.$props.currentLevel = level
        }
      }
    },
    getNextLevelName(levelId) {
      for (let levelIndex in this.$props.levels) {
        let level = this.$props.levels[levelIndex]
        if (Number(level.id) === Number(levelId)) {
          return level.data.name
        }
      }
    }

  }

})
</script>

<style scoped>

</style>
