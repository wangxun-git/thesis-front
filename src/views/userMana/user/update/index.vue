<template>
  <div class="app-container">
    <router-view></router-view>
    <el-form>
      <el-form-item label="用户账号">
        <el-input v-model="user.T_USER_ID" disabled></el-input>
      </el-form-item>

      <el-form-item label="用户名称">
        <el-input v-model="user.T_USERNAME"></el-input>
      </el-form-item>

      <el-form-item label="手机号码">
        <el-input v-model="user.T_MOBILE"></el-input>
      </el-form-item>

      <el-form-item label="用户邮箱">
        <el-input v-model="user.T_EMAIL"></el-input>
      </el-form-item>

      <el-form-item label="用户头像">
        <!-- 头像缩略图 -->
        <pan-thumb :image="avatar"/>

        <el-upload
          :headers="headers"
          :action="BASE_API+'/sys/uploadAvatar'"
          :before-remove="beforeRemove"
          :limit="1"
          :on-success="uploadSuccess">
          <el-button type="primary" icon="el-icon-upload" >更换头像</el-button>
        </el-upload>

      </el-form-item>

      <el-form-item label="用户身份">
        <el-select v-model="user.T_USER_IDENTITY" clearable placeholder="请选择身份信息">
          <el-option
            v-for="item in idenList"
            :key="item.key"
            :label="item.value"
            :value="item.key">
          </el-option>
        </el-select>
      </el-form-item>

      <el-form-item label="用户密码">
        <el-input :type="pwdType" v-model="user.T_PASSWORD" clearable></el-input>
      </el-form-item>

      <el-form-item label="确认密码">
        <el-tooltip class="item" effect="light" :content="contentAgainPwd" placement="top" :popper-class="tooltipPwd">
          <el-input
            :type="pwdType"
            v-model="T_AGAIN_PWD"
            clearable
            :change="checkPwd()"
            :suffix-icon="iconAgainPwd">
          </el-input>
        </el-tooltip>
      </el-form-item>

      <el-form-item>
        <el-button type="success" @click="upadteUserInfo">保存</el-button>
      </el-form-item>

    </el-form>
  </div>
</template>

<script>
  import user from '@/api/custome/user.js'
  import roleApi from '@/api/role/role'
  import sys from "@/api/system/sys";
  import { getToken } from '@/utils/auth'
  import ImageCropper from '@/components/ImageCropper'
  import PanThumb from '@/components/PanThumb'

  export default {
    components: { ImageCropper, PanThumb },

    data() {
      return {
        user: {
          T_USER_ID: '',
          T_USERNAME: '',
          T_PASSWORD: '',
          T_MOBILE: '',
          T_EMAIL: '',
          T_PHOTO: '',
          T_ROLE_ID: ''
        },
        T_AGAIN_PWD: '',
        pwdType: 'password',
        BASE_API: process.env.BASE_API, // 接口API地址
        headers: {token: getToken()},
        avatar: '',  //头像
        photo: '',  //图片地址
        contentAgainPwd: '密码不一致',
        tooltipPwd: 'tooltip-false-pwd',
        iconAgainPwd: 'iconfont icon-true',
        idenList: [
          {
            key: 0,
            value: '研究院管理员'
          },
          {
            key: 3,
            value: '图书馆管理员'
          },
        ]
      }
    },

    created() {
      this.init()
      this.getUserInfo()  //初始化用户信息
    },

    methods: {
      init() {
        if (this.$route.params && this.$route.params.id) {
          const id = this.$route.params.id
          this.user.T_USER_ID = id
        }
      },

      //获取用户信息
      getUserInfo() {
        user.getUserInfoById(this.user.T_USER_ID)
        .then(result => {
          this.user = result.OUT_DATA.data
          console.log(this.user)
          this.photo = result.OUT_DATA.data.T_PHOTO
          this.T_AGAIN_PWD = this.user.T_PASSWORD
          this.avatar = this.BASE_API + '/avatar/' + result.OUT_DATA.data.T_PHOTO
        })
      },

      //删除文件
      beforeRemove(file, fileList){
        return this.$confirm(`确定移除 ${ file.name }？`,'提示',{
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          sys.deletefile(this.user.T_PHOTO)  //删除文件
          .then( result => {
            //删除用户头像存储信息
            this.user.T_PHOTO = this.photo
            //返回用户头像
            this.avatar = this.BASE_API + '/avatar/' + this.photo
          })
        })
      },

      //上传成功
      uploadSuccess(data) {
        this.user.T_PHOTO = data.OUT_DATA.data
        //显示头像信息
        this.avatar = this.BASE_API + '/avatar/' + data.OUT_DATA.data
      },

      checkPwd() {
        if (this.user.T_PASSWORD == '') {
          this.iconAgainPwd = 'iconfont icon-false'
          this.tooltipPwd = 'tooltip-false-pwd'
          this.contentAgainPwd = '请输入密码'
        }else if (this.T_AGAIN_PWD != this.user.T_PASSWORD) {
          this.iconAgainPwd = 'iconfont icon-false'
          this.tooltipPwd = 'tooltip-false-pwd'
          this.contentAgainPwd = '密码不一致'
        }else {
          this.iconAgainPwd = 'iconfont icon-true'
          this.tooltipPwd = 'tooltip-true-pwd'
          this.contentAgainPwd = '密码一致'
        }
      },

      //保存更新内容
      upadteUserInfo(){
        //校验密码
        //校验密码
        if (this.T_AGAIN_PWD != this.user.T_PASSWORD) {
          this.$message({
            type: "error",
            message: "密码不一致,请确认"
          })
          return
        }

        user.updateUserInfo(this.user)
        .then(response => {
          this.$message({
            type: "success",
            message: "修改成功"
          })
        })
      }

    }
  }
</script>

<style>
</style>
