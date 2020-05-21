import Vue from 'vue'
import VueRouter from 'vue-router'
import Base from '@views/Base/index.vue'
import Wrapper from '@views/Base/WrapperForm/index.vue'
import Table from '@views/Base/TableForm/index.vue'
import List from '@views/Base/ListForm/index.vue'
import PicText from '@views/Base/PictureText/index.vue'
import Setting from '@views/Base/SettingForm/index.vue'

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
        component: Wrapper,
        meta: {
          keepAlive: true
        }
      },
      {
        path: 'table',
        component: Table,
        meta: {
          keepAlive: true
        }
      },
      // {
      //   path: 'cmd',
      //   component: () => import(/* webpackChunkName: "uipane" */ '@views/Base/CmdForm/index.vue'),
      //   meta: {
      //     keepAlive: true
      //   }
      // },
      {
        path: 'list',
        component: List,
        meta: {
          keepAlive: true
        }
      },
      {
        path: 'pictureText',
        component: PicText,
        meta: {
          keepAlive: true
        }
      },
      {
        path: 'setting',
        component: Setting,
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
