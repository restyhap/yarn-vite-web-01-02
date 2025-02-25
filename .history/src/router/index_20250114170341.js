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
      { path: "/quote/list", name: "quoteList", component: () => import("@/views/index/quote/List.vue"), },
      { path: "/quote/create" , name : "quoteCreat" , component:()=> import("@/views/index/quote/Create.vue") },
      { path: "/spec/list", name: "specList", component: () => import("@/views/index/spec/List.vue"), },
      { path: "/spec/create" , name : "specCreate" , component:()=> import("@/views/index/spec/Create.vue") },
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

