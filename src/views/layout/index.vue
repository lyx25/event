<template>
  <el-container class="main-container">
    <!-- 头部区域 -->
    <el-header>
      <!-- 左侧的 logo -->
      <img src="../../assets/images/logo.png" alt="" />
      <!-- 右侧的菜单 -->
      <el-menu
        class="el-menu-top"
        mode="horizontal"
        background-color="#23262E"
        text-color="#fff"
        active-text-color="#409EFF"
      >
        <el-submenu index="1">
          <template slot="title">
            <!-- 头像 -->
            <img src="../../assets/images/logo.png" alt="" class="avatar" />
            <span>个人中心</span>
          </template>
          <el-menu-item index="1-1"><i class="el-icon-s-operation"></i>基本资料</el-menu-item>
          <el-menu-item index="1-2"><i class="el-icon-camera"></i>更换头像</el-menu-item>
          <el-menu-item index="1-3"><i class="el-icon-key"></i>重置密码</el-menu-item>
        </el-submenu>
        <el-menu-item index="2" @click="logoutFn"><i class="el-icon-switch-button"></i>退出</el-menu-item>
      </el-menu>
    </el-header>
    <el-container>
      <!-- 侧边栏区域 -->
      <!-- 左侧边栏的用户信息 -->
      <el-aside width="200px">
        <div class="user-box">
          <img :src="user_pic" alt="" v-if="user_pic" />
          <img src="../../assets/images/logo.png" alt="" v-else />
          <span>欢迎 {{ nickname || username }}</span>
        </div>
        <!-- 左侧导航菜单 -->
         <el-menu
          default-active="$route.path"
          class="el-menu-vertical-demo"
          @open = "handleOpen"
          @close = "handleClose"
          background-color="#23262E"
          text-color="#fff"
          active-text-color="#409EFF"
          unique-opened
          router
        >
         <template v-for="item in menus">
            <!-- 不包含子菜单的“一级菜单” -->
            <el-menu-item :index="item.indexPath" :key="item.indexPath" v-if="!item.children">
              <i :class="item.icon"></i>{{ item.title }}
            </el-menu-item>

            <!-- 包含子菜单的“一级菜单” -->
            <el-submenu :index="item.indexPath" :key="item.indexPath" v-else>
              <template slot="title">
                <i :class="item.icon"></i>
                <span>{{ item.title }}</span>
              </template>
              <!-- 循环渲染“二级菜单” -->
              <el-menu-item :index="subItem.indexPath" v-for="subItem in item.children" :key="subItem.indexPath">
                <i :class="subItem.icon"></i>{{ subItem.title }}
              </el-menu-item>
            </el-submenu>
          </template>
        </el-menu>
      </el-aside>
      <el-container>
        <!-- 页面主体区域 -->
        <el-main>
          <router-view></router-view>
        </el-main>
        <!-- 底部 footer 区域 -->
        <el-footer>© www.itheima.com - 黑马程序员</el-footer>
      </el-container>
    </el-container>
  </el-container>
</template>

<script>
// 经验：在组建标签上绑定的所有事件（包括原生事件的名字click，input等）
// 都是自定义事件，需要组件内$emit来触发才行
// 万一组件内不支持这个原生事件名字
// 解决：@事件名.native="methods里的方法名"
// .native给组件内根标签，绑定这个原生的事件
import { mapGetters } from 'vuex'
import { getMenusAPI } from '@/api'
export default {
  name: 'my-layout',
  // ...其他
  data () {
    return {
      menus: [] // 侧边栏数据
    }
  },
  computed: {
    ...mapGetters(['nickname', 'username', 'user_pic'])
  },
  methods: {
    logoutFn () {
      // 询问用户是否退出登录
      this.$confirm('您确认退出登录吗？', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        // TODO：执行退出登录的操作
        // 1. 清空 token
        this.$store.commit('updateToken', '')
        this.$store.commit('updateUserInfo', {})
        // 2. 跳转到登录页面
        this.$router.push('/login')
      }).catch((err) => err)
    },
    handleClose (key, keyPatch) {
      console.log(key, keyPatch)
    },
    handleOpen (key, keyPatch) {
      console.log(key, keyPatch)
    },
    // ...其他
    // 获取侧边栏菜单数据
    async getMenusListFn () {
      const { data: res } = await getMenusAPI()
      console.log(res)
      this.menus = res.data
    }
  },
  created () {
    this.getMenusListFn()
  }
}
</script>

<style lang="less" scoped>
.main-container {
  height: 100%;
  .el-header,
  .el-aside {
    background-color: #23262e;
  }
  .el-header {
    padding: 0;
    display: flex;
    justify-content: space-between;
  }
  .el-main {
    overflow-y: scroll;
    height: 0;
    background-color: #F2F2F2;
  }
  .el-footer {
    background-color: #eee;
    font-size: 12px;
    display: flex;
    justify-content: center;
    align-items: center;
  }
}

.avatar {
  border-radius: 50%;
  width: 35px;
  height: 35px;
  background-color: #fff;
  margin-right: 10px;
  object-fit: cover;
}

// 左侧边栏用户信息区域
.user-box {
  height: 70px;
  display: flex;
  justify-content: center;
  align-items: center;
  border-top: 1px solid #000;
  border-bottom: 1px solid #000;
  user-select: none;
  img {
    width: 35px;
    height: 35px;
    border-radius: 50%;
    background-color: #fff;
    margin-right: 15px;
    object-fit: cover;
  }
  span {
    color: white;
    font-size: 12px;
  }
}

// 侧边栏菜单的样式
.el-aside {
  .el-submenu,
  .el-menu-item {
    width: 200px;
    user-select: none;
  }
}
</style>
