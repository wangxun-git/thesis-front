import Vue from 'vue'

import 'normalize.css/normalize.css' // A modern alternative to CSS resets

import ElementUI from 'element-ui'
import 'element-ui/lib/theme-chalk/index.css'
import locale from 'element-ui/lib/locale/lang/en' // lang i18n
import zhlocale from 'element-ui/lib/locale/lang/zh-CN'

import '@/styles/index.scss' // global css

import App from './App'
import router from './router'
import store from './store'

import '@/icons' // icon
import '@/permission' // permission control
// i18n国际化
import i18n from "@/lang";

import '@/assets/iconfont/iconfont.css'  //引入阿里图标库
import '@/assets/font/font.css'  //引入字体库

import { hasBtnPermission } from './utils/permission' // button permission
Vue.prototype.hasPerm = hasBtnPermission

Vue.use(ElementUI, { zhlocale })

Vue.config.productionTip = false

new Vue({
  el: '#app',
  router,
  store,
  i18n,
  render: h => h(App)
})

