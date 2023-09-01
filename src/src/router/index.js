import Vue from 'vue'
import Router from 'vue-router'
import Index from '@/components/Index.vue'
import Editor from '@/components/Editor.vue'
import Game from '@/components/Game.vue'

Vue.use(Router)

export default new Router({
  routes: [
    {
      path: '/',
      name: 'Index',
      component: Index
    },
    {
      path: '/editor',
      name: 'editor',
      component: Editor
    },
    {
      path: '/game',
      name: 'game',
      component: Game
    }
  ]
})
