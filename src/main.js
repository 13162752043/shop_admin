// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import App from './App'
import router from './router'
// 导入 ElementUI组件库
import ElementUI from 'element-ui'
// 导入ElementUI的样式
import 'element-ui/lib/theme-chalk/index.css'
// 引入公共样式
import './assets/css/common.css'

import ElTreeGrid from 'element-tree-grid'
// 注册一个全局的组件
// el-table-tree-column
// console.log('el-table-tree-column', ElTreeGrid)
Vue.component(ElTreeGrid.name, ElTreeGrid)
// 使用elementUI这个插件
Vue.use(ElementUI)
// 1、把axios绑定在vue实例上
import axios from 'axios'
Vue.prototype.axios = axios
// 2、设置全局默认地址
axios.defaults.baseURL = 'http://localhost:8888/api/private/v1/'

// 3、请求拦截器，拦截请求
axios.interceptors.request.use(
  function(config) {
    // 在发送请求之前做些什么
    config.headers.Authorization = localStorage.getItem('token')
    return config
  },
  function(error) {
    // 对请求错误做些什么
    return Promise.reject(error)
  }
)

// 添加响应拦截器
axios.interceptors.response.use(
  function(response) {
    // 对响应数据做点什么
    return response.data
  },
  function(error) {
    // 对响应错误做点什么
    return Promise.reject(error)
  }
)

Vue.config.productionTip = false

/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  components: { App },
  template: '<App/>'
})
