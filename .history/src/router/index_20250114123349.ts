import { createRouter, createWebHistory } from 'vue-router'
import type { RouteRecordRaw } from 'vue-router'
import { ElMessage } from 'element-plus'

const routes: RouteRecordRaw[] = [
  {
    path: '/login',
    name: 'Login',
    component: () => import('@/views/Login.vue'),
    meta: {
      title: '登录',
      requiresAuth: false
    }
  },
  {
    path: '/',
    component: () => import('@/views/index/Index.vue'),
    redirect: '/spec/list',
    meta: {
      requiresAuth: true
    },
    children: [
      // 规格表管理
      {
        path: 'spec',
        meta: {
          requiresAuth: true
        },
        children: [
          {
            path: 'list',
            name: 'SpecList',
            component: () => import('@/views/index/spec/List.vue'),
            meta: {
              title: '规格表列表',
              permission: 'spec_view'
            }
          },
          {
            path: 'create',
            name: 'SpecCreate',
            component: () => import('@/views/index/spec/Create.vue'),
            meta: {
              title: '创建规格表',
              permission: 'spec_create'
            }
          },
          {
            path: 'edit/:id',
            name: 'SpecEdit',
            component: () => import('@/views/index/spec/Create.vue'),
            meta: {
              title: '编辑规格表',
              permission: 'spec_edit'
            }
          },
          {
            path: 'view/:id',
            name: 'SpecView',
            component: () => import('@/views/index/spec/Create.vue'),
            meta: {
              title: '查看规格表',
              permission: 'spec_view'
            }
          }
        ]
      },
      // 报价单管理
      {
        path: 'quote',
        meta: {
          requiresAuth: true
        },
        children: [
          {
            path: 'list',
            name: 'QuoteList',
            component: () => import('@/views/index/quote/List.vue'),
            meta: {
              title: '报价单列表',
              permission: 'quote_view'
            }
          },
          {
            path: 'create',
            name: 'QuoteCreate',
            component: () => import('@/views/index/quote/Create.vue'),
            meta: {
              title: '创建报价单',
              permission: 'quote_create'
            }
          },
          {
            path: 'edit/:id',
            name: 'QuoteEdit',
            component: () => import('@/views/index/quote/Create.vue'),
            meta: {
              title: '编辑报价单',
              permission: 'quote_edit'
            }
          },
          {
            path: 'view/:id',
            name: 'QuoteView',
            component: () => import('@/views/index/quote/Create.vue'),
            meta: {
              title: '查看报价单',
              permission: 'quote_view'
            }
          }
        ]
      },
      // 系统设置
      {
        path: 'settings',
        meta: {
          requiresAuth: true
        },
        children: [
          {
            path: 'users',
            name: 'SettingsUsers',
            component: () => import('@/views/index/settings/Users.vue'),
            meta: {
              title: '用户管理',
              permission: 'settings_users'
            }
          },
          {
            path: 'permissions',
            name: 'SettingsPermissions',
            component: () => import('@/views/index/settings/Permissions.vue'),
            meta: {
              title: '权限设置',
              permission: 'settings_permissions'
            }
          }
        ]
      }
    ]
  },
  // 404页面
  {
    path: '/:pathMatch(.*)*',
    name: 'NotFound',
    component: () => import('@/views/404.vue'),
    meta: {
      title: '404',
      requiresAuth: false
    }
  }
]

const router = createRouter({
  history: createWebHistory(),
  routes
})

// 获取用户权限（模拟）
const getUserPermissions = () => {
  const permissions = localStorage.getItem('permissions')
  return permissions ? JSON.parse(permissions) : []
}

// 检查用户是否有权限访问
const hasPermission = (permission: string | undefined) => {
  if (!permission) return true
  const permissions = getUserPermissions()
  return permissions.includes(permission)
}

// 路由守卫
router.beforeEach((to, from, next) => {
  // 设置页面标题
  document.title = to.meta.title ? `${to.meta.title} - 企业表单管理系统` : '企业表单管理系统'

  // 检查是否需要登录验证
  if (to.matched.some(record => record.meta.requiresAuth)) {
    const token = localStorage.getItem('token')
    if (!token) {
      ElMessage.warning('请先登录')
      next({
        path: '/login',
        query: { redirect: to.fullPath }
      })
      return
    }

    // 检查权限
    if (to.meta.permission && !hasPermission(to.meta.permission as string)) {
      ElMessage.error('没有访问权限')
      next(from.fullPath)
      return
    }
  }

  next()
})

// 路由错误处理
router.onError((error) => {
  console.error('路由错误:', error)
  router.push('/404')
})

export default router 