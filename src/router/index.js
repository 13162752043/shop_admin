import Vue from 'vue'
import Router from 'vue-router'
import Login from '@/components/login'
import Home from '@/components/home'
import User from '@/components/user'

Vue.use(Router)

const router= new Router ({
  routes: [
    { path: '/', redirect: '/login' },
    { path: '/login', component: Login },
    { path: '/home', component: Home,
    // 配置嵌套user路由
      children: [
        {
          path: '/user',
          component: User
        }
      ]
    }
  ]
})
// 设置路由守卫
router.beforeEach((to, from, next) => {

  // 获取token的值
 const token=localStorage.getItem('token')
 if (to.path==='/login'|| token){
  //  放行
    next()
 } else {
    next('/login')
 }
})

export default router