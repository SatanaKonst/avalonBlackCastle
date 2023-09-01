<template>
  <div class="hello">
    <h1>{{msg}}</h1>
    <router-link class="btn btn-success" to="/game">Game</router-link>
    <router-link class="btn btn-info" to="/editor">Editor</router-link>
  </div>
</template>

<script>
export default {
  name: 'index',
  data () {
    return {
      msg: 'Главная страница'
    }
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>

</style>
