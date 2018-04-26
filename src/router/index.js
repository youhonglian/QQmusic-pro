import Vue from 'vue'
import Router from 'vue-router'
import musicDis from '@/components/musicDis'
import myMusic from '@/components/myMusic'
import myList from '@/components/myMusic-c/myList'
import myLove from '@/components/myMusic-c/myLove'
import artList from '@/components/artList'
import player from '../pages/player'
import singer from '../components/singer'
import cd from '../components/cd'
import mv from '../components/mv'


Vue.use(Router)

export default new Router({
  routes: [
    {
      path: '/',
      name: 'musicDis',
      component: musicDis
    },
    {
      path: '/musicDis',
      component: musicDis
    },
    {
      path: '/myMusic',
      name: 'myMusic',
      component: myMusic
    },
    {
      path: '/myMusic/myList',
      name: 'myList',
      component: myList,
      meta: {
        requireAuth: true
      },
      beforeEnter: function (to, from, next) {
      if (sessionStorage.username) {
        next()
      } else {
        alert('请先登录！')
        next({
          path: '/myMusic'
        })
       }
      }
    },
    {
      path: '/myMusic/myLove',
      name: 'myLove',
      component: myLove,
      meta: {
        requireAuth: true
      },
      beforeEnter: function (to, from, next) {
      if (sessionStorage.username) {
        next()
      } else {
        alert('请先登录！')
        next({
          path: '/myMusic'
        })
       }
      }
    },
    {
      path: '/artList',
      name: 'artList',
      component: artList
    },
    {
      path: '/player/:id',
      name: 'player',
      component: player
    },
    {
      path: '/musicDis/singer',
      name: 'singer',
      component: singer
    },
    {
      path: '/cd',
      name: 'cd',
      component: cd
    },
    {
      path: '/mv',
      name: 'mv',
      component: mv
    }
  ]
})
