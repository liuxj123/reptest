/*import Vue from 'vue'
import Router from 'vue-router'
import HelloWorld from '@/components/HelloWorld'
import org from '@/components/sysm/org'

Vue.use(Router)

export default new Router({
  routes: [
    {
      path: '/',
      name: 'HelloWorld',
      component: org
    },
    {
      path: '/org',
      name: 'Org',
      component: org
    }
  ]
})*/

import Vue from 'vue'
import Router from 'vue-router'
import Login from '@/pages/login'
import pageFooter from '@/components/footer'
import pageHeader from '@/components/header'
import Home from '@/pages/home'
import Aside from '@/pages/aside'
import Org from '@/pages/sysm/org'

Vue.use(Router)
export default new Router({
  routes: [
    {
      path: '/',
      redirect:"/login"
    },
    {
      path: '/login',
      name: 'Login',
      component: Login
    },
    {
      path: '/home',
      name: 'home',
      component:(resolve) =>{
        require(['../pages/home'],resolve)
      },
      meta:{
        requiresAuth:true
      },
      children:[
        {
        path:"org",
        component:(resolve) =>{
          require(['../pages/sysm/org'],resolve)
        },
        meta:{
          requiresAuth:true
        },
      },
      {
        path:"menus",
        component:(resolve) =>{
          require(['../pages/sysm/menu'],resolve)
        },
        meta:{
          requiresAuth:true
        }
      },
      {
        path:"roles",
        component:(resolve) =>{
          require(['../pages/sysm/role'],resolve)
        },
        meta:{
          requiresAuth:true
        }
      },
      {
        path:"footer",
        component:(resolve) =>{
          require(['../components/footer'],resolve)
        },
        meta:{
          requiresAuth:true
        }
      }
    ]
    }
  ]

})


