import "font-awesome/css/font-awesome.css"
import Vue from 'vue'

import App from './App'

import "./config/bootstrap"
import "./config/mq"
import store from "./config/store"
import "./config/axios"
import router from "./config/router"
import "./config/msg"

Vue.config.productionTip = false

new Vue({
  store,
  router,
  render: h => h(App)
}).$mount('#app')