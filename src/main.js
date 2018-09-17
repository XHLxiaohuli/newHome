// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import App from './App'
import router from './router'
import axios from 'axios'
import "babel-polyfill"
import $ from 'jquery'
import cookie from '@/assets/js/cookie'
import '@/assets/js/mediation.js'


// 本地存储js
import '@/assets/js/indexedDB.js'
// 公共js
import '@/assets/js/public.js'
// 微信小图标与表情样式
// import '../static/css/icons.css'

Vue.config.productionTip = false
Vue.prototype.$axios = axios
Vue.prototype.$cookie = cookie

// 线上
// window.api ='192.168.5.167:8080';
window.api = '120.24.102.187:8066';
//window.api = '192.168.5.168:8080';
// window.api = '192.168.5.169:8080';

new Vue({
  el: '#app',
  router,
  components: { App },
  template: '<App/>'
})
