import Vue from 'vue'
import VueRouter from 'vue-router'
import store from '@/store'
Vue.use(VueRouter)

const routes = [
  {
    path: '/', // 网页打开第一次默认路由路径就是'/'
    component: () => import('@/views/layout'),
    redirect: '/home', // 默认显示首页的二级路由 （重定向，会导致路由规则数组再次匹配）
    children: [
      // 侧边栏导航，点击会切换路由地址，路由地址靠数据请求回来铺设上去的
      // 所以你的路由规则要配合它保持一致
      {
        path: 'home',
        component: () => import('@/views/home')
      },
      {
        path: 'user-info', // 这里必须叫user-info, 因为侧边栏导航切换的是它
        component: () => import('@/views/user/userInfo')
      },
      {
        path: 'user-avatar', // 必须用这个值
        component: () => import('@/views/user/userAvatar')
      },
      {
        path: 'user-pwd', // 必须用这个值
        component: () => import('@/views/user/userPwd')
      },
      {
        path: 'art-cate', // 文章分类
        component: () => import('@/views/article/artCate')
      },
      {
        path: 'art-list', // 文章列表
        component: () => import('@/views/article/artList')
      }
    ]
  },
  {
    path: '/reg',
    component: () => import('@/views/register')
    // webpack提供import函数来路由懒加载导入组件
    // 路由懒加载，就是页面路由由路径切换到/reg,才去加载对应组件代码
    // 好处：让首页加载文件体积更新，打开更快
  },
  {
    path: '/login',
    component: () => import('@/views/login')
  }
]

const router = new VueRouter({
  routes
})

const whiteList = ['/login', '/reg'] // 白名单（无需登录就可以访问的路由地址）
// 全局前置路由守卫
// 浏览器第一次打开项目页面，会触发一次全局前置路由守卫函数
// 有token就证明登录了，无token未登录
// next()如果强制切换路由地址，会不会走路由守卫？ 会再次走路由守卫再次去匹配路由表
router.beforeEach((to, from, next) => {
  const token = store.state.token
  if (token) {
    // 登录了
    if (!store.state.userInfo.username) {
      // 有token但是没有用户信息, 才去请求用户信息保存到vuex里
      // 调用actions里方法请求数据
      store.dispatch('initUserInfo')
      // 下次切换页面vuex里有用户信息数据就不会重复请求用户信息
    }

    next() // 路由放行
  } else {
    // 未登录
    // 数组.includes(值)，作用:判断值是否在数组里出现过，出现过原地返回true
    if (whiteList.includes(to.path)) {
      // 未登录，可以访问的路由地址，则放行（路由全局前置守卫不会再触发了，而是匹配路由表，让组件挂载）
      next()
    } else {
      // next()强制切换到登录路径上
      next('/login')
    }
  }
})

export default router
