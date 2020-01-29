import Vue from 'vue'
import Router from 'vue-router'
import Home from './views/Home.vue'

Vue.use(Router)

export default new Router({
  mode: 'history',
  base: process.env.BASE_URL,
  routes: [
    {
      path: '/',
      name: 'home',
      component: Home
    },
    {
      path: '/add-person',
      component: () => import(/* webpackChunkName: "add-person" */ './views/AddPerson.vue')
    },
    {
      path: '/add-property',
      component: () => import(/* webpackChunkName: "add-property" */ './views/AddProperty.vue')
    },
    {
      path: '/add-relation',
      component: () => import(/* webpackChunkName: "add-relation" */ './views/AddRelation.vue')
    },
    {
      path: '/person/:id',
      component: () => import(/* webpackChunkName: "person" */ './views/Person.vue')
    },
    {
      path: '/diary',
      component: () => import(/* webpackChunkName: "diary" */ './views/Diary.vue')
    },
    {
      path: '/diary/new',
      component: () => import(/* webpackChunkName: "diaryEntry" */ './views/DiaryEntry.vue')
    },
    {
      path: '/diary/:id',
      component: () => import(/* webpackChunkName: "diaryEntry" */ './views/DiaryEntry.vue')
    },
    {
      path: '/tags',
      component: () => import(/* webpackChunkName: "tags" */ './views/Tags.vue')
    },
    {
      path: '/tag/:id',
      component: () => import(/* webpackChunkName: "tag" */ './views/Tag.vue')
    },
    {
      path: '/properties',
      component: () => import(/* webpackChunkName: "properties" */ './views/Properties.vue')
    }
  ]
})
