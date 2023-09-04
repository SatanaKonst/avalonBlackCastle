<template>
  <div id="app">
    <router-view/>
  </div>
</template>

<script>
export default {
  name: 'App'
}
</script>

<style>
.game-zone {
  height: 100vh;
}

.game-header {
  height: 10vh;
}

.game-content {
  max-height: 70vh;
  height: 70vh;
  overflow-y: auto;
}

.game-content .img-thumbnail {
  height: 150px;
}
.game-footer{
  min-height: 20vh;
  height: 20vh;
}

.mr-1{
  margin-right: 0.25rem;
}
.mr-2{
  margin-right: 0.5rem;
}
.mr-3{
  margin-right: 1rem;
}
.mr-4{
  margin-right: 1.25rem;
}
.mr-5{
  margin-right: 1.5rem;
}

.ml-1{
  margin-left: 0.25rem;
}
.ml-2{
  margin-left: 0.5rem;
}
.ml-3{
  margin-left: 1rem;
}
.ml-4{
  margin-left: 1.25rem;
}
.ml-5{
  margin-left: 1.5rem;
}
</style>
