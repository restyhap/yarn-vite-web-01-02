import { createRouter, createWebHistory } from 'vue-router'
import type { RouteRecordRaw } from 'vue-router'

const routes: RouteRecordRaw[] = [
  {
    path: '/login',
    name: 'Login',
    component: () => import('@/views/Login.vue')
  },
  {
    path: '/',
    component: () => import('@/views/index/Index.vue'),
    redirect: '/prod/list',
    children: [
      // 规格表管理
      {
        path: 'spec',
        children: [
          {
            path: 'list',
            name: 'SpecList',
            component: () => import('@/views/index/spec/List.vue')
          },
          {
            path: 'create',
            name: 'SpecCreate',
            component: () => import('@/views/index/spec/Create.vue')
          }
        ]
      },
      // 报价单管理
      {
        path: 'quote',
        children: [
          {
            path: 'list',
            name: 'QuoteList',
            component: () => import('@/views/index/quote/List.vue')
          },
          {
            path: 'create',
            name: 'QuoteCreate',
            component: () => import('@/views/index/quote/Create.vue')
          }
        ]
      },
      // 系统设置
      {
        path: 'settings',
        children: [
          {
            path: 'users',
            name: 'SettingsUsers',
            component: () => import('@/views/index/settings/Users.vue')
          },
          {
            path: 'permissions',
            name: 'SettingsPermissions',
            component: () => import('@/views/index/settings/Permissions.vue')
          }
        ]
      }
    ]
  }
]

const router = createRouter({
  history: createWebHistory(),
  routes
})

// 路由守卫
router.beforeEach((to, from, next) => {
  // TODO: 添加登录验证和权限验证逻辑
  next()
})

export default router 