import Vue from 'vue'
import VueRouter from 'vue-router'
import Home from '../views/Home.vue'

Vue.use(VueRouter)

const routes = [
  {
    path: '/',
    redirect: '/base'
  },
  {
    path: '/base',
    component: Home,
    children: [
      // this generates a separate chunk (about.[hash].js) for this route
      // which is lazy-loaded when the route is visited.
      {
        path: '',
        component: () => import(/* webpackChunkName: "uipane" */ '@views/ListForm')
      },
      {
        path: 'singleline',
        component: () => import(/* webpackChunkName: "uipane" */ '@views/ListForm')
      },
      {
        path: 'table',
        component: () => import(/* webpackChunkName: "uipane" */ '@views/TableForm')
      },
      {
        path: 'cmd',
        component: () => import(/* webpackChunkName: "uipane" */ '@views/CmdForm')
      },
      {
        path: 'list',
        component: () => import(/* webpackChunkName: "uipane" */ '@views/ListForm')
      }
    ]
  }
]

const router = new VueRouter({
  routes
})

export default router
