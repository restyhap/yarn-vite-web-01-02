import { createApp } from 'vue'
import App from './App.vue'

// 引入tailwindcss样式
import '@/tailwind.css'
// 引入element-plus样式
import 'element-plus/dist/index.css'
import '@/styles/element-plus.css'

// 引入element-plus
import ElementPlus from 'element-plus'
// 引入element-plus图标
import * as ElementPlusIconsVue from '@element-plus/icons-vue'
import router from './router'
// 添加 pinia 依赖
import { createPinia } from 'pinia'
// 实例化 pinia 插件
const pinia = createPinia()

import axios from 'axios'
import VueAxios from 'vue-axios'
import permission from './directives/permission'

const app = createApp(App)
app.use(ElementPlus)

// 注册element-plus图标
for (const [key, component] of Object.entries(ElementPlusIconsVue)) {
  app.component(key, component)
}

// 注册路由
app.use(router)
// 注册仓库
app.use(pinia)

// 注册权限指令
app.directive('permission', permission)

// 挂载实例
app.mount('#app')