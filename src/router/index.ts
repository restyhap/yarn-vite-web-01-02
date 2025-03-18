/*
 * @Author: resty restyhap@hotmail.com
 * @Date: 2024-10-31 17:23:18
 * @LastEditors: resty restyhap@hotmail.com
 * @LastEditTime: 2025-03-13 09:07:32
 * @FilePath: /yarn-vite-web-01-02/src/router/index.ts
 * @Description: 这是默认设置,请设置`customMade`, 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
 */
/// <reference types="vite/client" />
import {createWebHistory, createRouter} from "vue-router";
import Index from '../views/index/Index.vue'
import Login from '@/views/login/Login.vue'
import { useUserStore } from '@/pinia/user';
import { checkPermission, ModuleType, PermissionAction } from '@/utils/permissionUtils';
import { ElMessage } from 'element-plus';

// 路由配置
const routes = [
  {
    // 主页的重定向
    path:"/",
    name:"login",
    component: Login,
    meta: { requiresAuth: false }
  },
  {
    path: "/index",
    component: Index,
    meta: { requiresAuth: true },
    children:[
      { path:"", name: "index", redirect: "/prod/list" },
      { 
        path: "/prod/list", 
        name: "productList", 
        component: () => import("@/views/index/prod/List.vue"),
        meta: { 
          requiresAuth: true,
          module: ModuleType.PROD,
          action: PermissionAction.VIEW
        }
      },
      { 
        path: "/prod/create", 
        name: "productCreate", 
        component:()=> import("@/views/index/prod/Create.vue"),
        meta: { 
          requiresAuth: true,
          module: ModuleType.PROD,
          action: PermissionAction.CREATE
        }
      },
      { 
        path: "/prod/info/:id", 
        name: "productInfo", 
        component: () => import("@/views/index/prod/Info.vue"),
        meta: { 
          requiresAuth: true,
          module: ModuleType.PROD,
          action: PermissionAction.VIEW
        }
      },
      { 
        path: "/quote/list", 
        name: "quoteList", 
        component: () => import("@/views/index/quote/List.vue"),
        meta: { 
          requiresAuth: true,
          module: ModuleType.QUOTE,
          action: PermissionAction.VIEW
        }
      },
      { 
        path: "/quote/create", 
        name: "quoteCreat", 
        component:()=> import("@/views/index/quote/Create.vue"),
        meta: { 
          requiresAuth: true,
          module: ModuleType.QUOTE,
          action: PermissionAction.CREATE
        }
      },
      { 
        path: "/quote/info/:id", 
        name: "quoteInfo", 
        component: () => import("@/views/index/quote/Info.vue"),
        meta: { 
          requiresAuth: true,
          module: ModuleType.QUOTE,
          action: PermissionAction.VIEW
        }
      },
      { 
        path: "/spec/list", 
        name: "specList", 
        component: () => import("@/views/index/spec/List.vue"),
        meta: { 
          requiresAuth: true,
          module: ModuleType.SPEC,
          action: PermissionAction.VIEW
        }
      },
      { 
        path: "/spec/create", 
        name: "specCreate", 
        component:()=> import("@/views/index/spec/Create.vue"),
        meta: { 
          requiresAuth: true,
          module: ModuleType.SPEC,
          action: PermissionAction.CREATE
        }
      },
      { 
        path: "/spec/info/:id", 
        name: "specInfo", 
        component: () => import("@/views/index/spec/Info.vue"),
        meta: { 
          requiresAuth: true,
          module: ModuleType.SPEC,
          action: PermissionAction.VIEW
        }
      },
      { 
        path: "/settings/users", 
        name: "users", 
        component:()=> import("@/views/index/settings/Users.vue"),
        meta: { 
          requiresAuth: true,
          module: ModuleType.SETTINGS,
          action: PermissionAction.USERS
        }
      },
      { 
        path: "/settings/permissions", 
        name: "permissions", 
        component:()=> import("@/views/index/settings/Permissions.vue"),
        meta: { 
          requiresAuth: true,
          module: ModuleType.SETTINGS,
          action: PermissionAction.PERMISSIONS
        }
      }
    ]
  },
];

const router = createRouter({
  //参考:https://router.vuejs.org/zh/api/#history
  //import.meta.env.BASE_URL 就是base 也就是指定的根路径.
  history: createWebHistory(import.meta.env.BASE_URL),
  routes
});

// 路由守卫
router.beforeEach(async (to, from, next) => {
  // 判断是否需要登录
  if (to.matched.some(record => record.meta.requiresAuth)) {
    const userStore = useUserStore();
    
    // 检查是否已登录
    if (!userStore.token) {
      ElMessage.error('请先登录');
      next({ name: 'login' });
      return;
    }
    
    // 检查是否有权限访问
    if (to.meta.module && to.meta.action) {
      const hasPermission = await checkPermission(
        to.meta.module as ModuleType, 
        to.meta.action as PermissionAction
      );
      
      if (!hasPermission) {
        ElMessage.error('您没有权限访问此页面');
        next(from.path);
        return;
      }
    }
    
    next();
  } else {
    // 如果是登录页面，直接放行
    next();
  }
});

export default router;

