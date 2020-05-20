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
        redirect: 'wrapper'
      },
      {
        path: 'wrapper',
        component: () => import(/* webpackChunkName: "uipane" */ '@views/Base/WrapperForm/index.vue'),
        meta: {
          keepAlive: true
        }
      },
      {
        path: 'table',
        component: () => import(/* webpackChunkName: "uipane" */ '@views/Base/TableForm/index.vue'),
        meta: {
          keepAlive: true
        }
      },
      {
        path: 'cmd',
        component: () => import(/* webpackChunkName: "uipane" */ '@views/Base/CmdForm/index.vue'),
        meta: {
          keepAlive: true
        }
      },
      {
        path: 'list',
        component: () => import(/* webpackChunkName: "uipane" */ '@views/Base/ListForm/index.vue'),
        meta: {
          keepAlive: true
        }
      },
      {
        path: 'pictureText',
        component: () => import(/* webpackChunkName: "uipane" */ '@views/Base/PictureText/index.vue'),
        meta: {
          keepAlive: true
        }
      },
      {
        path: 'setting',
        component: () => import(/* webpackChunkName: "uipane" */ '@views/Base/SettingForm/index.vue'),
        meta: {
          keepAlive: true
        }
      }
    ]
  },
  {
    path: '/custom',
    component: () => import('@views/Custom/index.vue'),
    meta: {
      keepAlive: true
    }
  },
  {
    path: '/materials',
    component: () => import('@views/Materials/index.vue'),
    meta: {
      keepAlive: true
    }
  }, {
    path: '/asciiflow',
    component: () => import('@views/AsciiFlow/index.vue'),
    meta: {
      keepAlive: true
    }
  }
]

const router = new VueRouter({
  mode: 'hash',
  routes
})

export default router
