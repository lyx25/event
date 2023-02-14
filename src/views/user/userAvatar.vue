<template>
  <el-card class="box-card">
    <div slot="header" class="clearfix">
      <span>更换头像</span>
    </div>
    <div>
     <!-- 图片，用来展示用户选择的头像 -->
    <img class="the_img" v-if="!this.avatar" src="../../assets/images/avatar.jpg" alt="" />
    <img class="the_img" v-else :src="this.avatar" alt="">
      <!-- 按钮区域 -->
      <div class="btn-box">
        <input type="file" accept="image/*" style="display: none" ref="iptRef" @change="onFileChange" />
        <el-button type="primary" icon="el-icon-plus" @click="chooseImg">选择图片</el-button>
        <el-button type="success" icon="el-icon-upload" :disabled="avatar === ''" @click="updateImgFn">上传头像</el-button>
      </div>
    </div>
  </el-card>
</template>

<script>
import { updateUserAvatarAPI } from '@/api'
export default {
  name: 'UserAvatar',
  data () {
    return {
      avatar: '' // 保存图片的链接或者base64字符串
    }
  },
  methods: {
    // 选择图片->点击事件->让选择框出现
    chooseImg () {
      // 模拟点击行为
      this.$refs.iptRef.click()
    },
    // 在选择框中选择图片后触发的改变事件
    onFileChange (e) {
      // 获取用户选择的文件列表（伪数组）
      const files = e.target.files
      if (files.length === 0) {
        // 没有选择图片
        this.avatar = ''
      } else {
        // 选择了图片
        console.log(files[0])
        // 目标：选择的图片文件，要给到img标签上做纯前端的预览
        // img标签的src值
        // 只能是图片的“链接地址”（外链http://开头，图片文件相对路径）
        // 或者是图片的base64字符串（而且字符串还必须是data：image/png;base64,图片转base64字符串）

        // 解决方案一：文件 -> 内存临时地址（这个地址只能在js里内存中不能发给后台）
        // 语法： URL.createObjectURL（文件）
        // 返回值：内存临时地址
        // this.avatar = URL.createObjectURL(files[0])

        // 解决方案2：文件 -> base64字符串（此字符串可以发给后台）
        const fr = new FileReader()
        fr.readAsDataURL(files[0]) // 传入文件对象开始读
        fr.onload = e => { // onload等待把文件读成base64字符串后会触发onload事件函数
          // e.target.result的值就是读完的结果
          this.avatar = e.target.result // 赋予给变量，让它显示在img的src里
        }
      }
    },
    async updateImgFn () {
      // 1. 调用接口, 传递给后台并根据返回结果给用户提示
      const { data: res } = await updateUserAvatarAPI(this.avatar)
      if (res.code !== 0) return this.$message.error('上传头像失败！')
      this.$message.success('上传头像成功！')
      this.$store.dispatch('initUserInfo')
      this.avatar = ''
    }
  }
}
</script>

<style lang="less" scoped>
.btn-box {
  margin-top: 10px;
}
.preview {
  object-fit: cover;
}
.the_img{
    width: 350px;
    height: 350px;
}
</style>
