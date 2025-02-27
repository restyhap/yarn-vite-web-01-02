const routes: RouteRecordRaw[] = [
  {
    path: '/',
    name: 'login',
    component: () => import('@/views/Login.vue')
  },
  {
    path: '/index',
    component: () => import('@/views/Index.vue'),
    children: [
      {
        path: '',
        name: 'index',
        redirect: '/prod/list'
      },
      {
        path: 'prod',
        children: [
          {
            path: 'list',
            name: 'prodList',
            component: () => import('@/views/index/prod/List.vue')
          },
          // ... 其他子路由
        ]
      },
      // ... 其他路由配置
    ]
  }
] 