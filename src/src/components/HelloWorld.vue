<template>
  <div class="hello">
    <h1>{{msg}}</h1>
    <router-link to="/editor">Editor</router-link>
  </div>
</template>

<script>
export default {
  name: 'HelloWorld',
  data () {
    return {
      msg: 'HELLO WORLD!!! sjkdhfkjshdkfjhskdj'
    }
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>

</style>
