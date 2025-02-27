/*
 * @Author: resty restyhap@hotmail.com
 * @Date: 2024-10-31 17:23:18
 * @LastEditors: resty restyhap@hotmail.com
 * @LastEditTime: 2025-02-27 12:02:22
 * @FilePath: /yarn-vite-web-01-02/src/router/index.js
 * @Description: 这是默认设置,请设置`customMade`, 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
 */
import {createWebHistory, createRouter} from "vue-router";
import Index from '../views/index/Index.vue'
import Login from '@/views/login/Login.vue'
const routes = [
  {
    // 主页的重定向
    path:"/",
    name:"login",
    component: Login,
  },
  {
    path: "/index",
    name: "index",
    component: Index,
    children:[
      { path:"", redirect: "/prod/list" },
      { path: "/prod/list", name: "productList", component: () => import("@/views/index/prod/List.vue"), },
      { path: "/prod/create" , name : "productCreate" , component:()=> import("@/views/index/prod/Create.vue") } ,
      { path: "/prod/info/:id", name: "productInfo", component: () => import("@/views/index/prod/Info.vue") },
      { path: "/quote/list", name: "quoteList", component: () => import("@/views/index/quote/List.vue"), },
      { path: "/quote/create" , name : "quoteCreat" , component:()=> import("@/views/index/quote/Create.vue") },
      { path: "/spec/list", name: "specList", component: () => import("@/views/index/spec/List.vue"), },
      { path: "/spec/create" , name : "specCreate" , component:()=> import("@/views/index/spec/Create.vue") },
      { path: "/spec/info/:id", name: "specInfo", component: () => import("@/views/index/spec/Info.vue") },
      { path: "/settings/users" , name : "users" , component:()=> import("@/views/index/settings/Users.vue") },
      { path: "/settings/permissions" , name : "permissions" , component:()=> import("@/views/index/settings/Permissions.vue") }
    ]
  },


]

const router = createRouter({
  //参考:https://router.vuejs.org/zh/api/#history
  //import.meta.env.BASE_URL 就是base 也就是指定的根路径.
  mode: "history",
  history: createWebHistory(import.meta.env.BASE_URL),
  routes
});

export default router;

