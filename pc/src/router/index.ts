import Vue from 'vue'
import VueRouter from 'vue-router'
import Base from '@views/Base/index.vue'

Vue.use(VueRouter)

const routes = [
  {
    path: '/',
    redirect: '/base'
  },
  {
    path: '/base',
    component: Base,
    children: [
      // this generates a separate chunk (about.[hash].js) for this route
      // which is lazy-loaded when the route is visited.
      {
        path: '',
        redirect: 'singleline'
      },
      {
        path: 'singleline',
        component: () => import(/* webpackChunkName: "uipane" */ '@views/Base/ListForm/index.vue')
      },
      {
        path: 'table',
        component: () => import(/* webpackChunkName: "uipane" */ '@views/Base/TableForm/index.vue')
      },
      {
        path: 'cmd',
        component: () => import(/* webpackChunkName: "uipane" */ '@views/Base/CmdForm/index.vue')
      },
      {
        path: 'list',
        component: () => import(/* webpackChunkName: "uipane" */ '@views/Base/ListForm/index.vue')
      },
      {
        path: 'pictureText',
        component: () => import(/* webpackChunkName: "uipane" */ '@views/Base/PictureText/index.vue')
      },
      {
        path: 'setting',
        component: () => import(/* webpackChunkName: "uipane" */ '@views/Base/SettingForm/index.vue')
      }
    ]
  },
  {
    path: '/custom',
    component: () => import('@views/Custom/index.vue')
  },
  {
    path: '/materials',
    component: () => import('@views/Materials/index.vue')
  }, {
    path: '/template',
    component: () => import('@views/Template/index.vue')
  }
]

const router = new VueRouter({
  routes
})

export default router
