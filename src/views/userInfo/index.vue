<template>
  <div class="app-container">
    <el-form>
      <el-form-item label="用户账号">
        <el-input v-model="user.T_USER_ID" clearable></el-input>
      </el-form-item>

      <el-form-item label="用户名称">
        <el-input v-model="user.T_USERNAME" clearable></el-input>
      </el-form-item>

      <el-form-item label="手机号码">
        <el-input v-model="user.T_MOBILE" clearable></el-input>
      </el-form-item>

      <el-form-item label="用户邮箱">
        <el-input v-model="user.T_EMAIL" clearable></el-input>
      </el-form-item>

      <!--用户头像-->
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

      <el-form-item label="用户密码">
        <el-input :type="pwdType" v-model="user.T_PASSWORD" clearable :change="checkPwd()" :suffix-icon="iconAgainPwd"></el-input>
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
        <el-button type="success" @click="updateUserInfo">保存</el-button>
      </el-form-item>

    </el-form>
  </div>
</template>

<script>

  import userApi from '@/api/custome/user'
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
          },
          pwdType: 'password',
          T_AGAIN_PWD: '',
          BASE_API: process.env.BASE_API, // 接口API地址
          headers: {token: getToken()},
          avatar: '',
          contentAgainPwd: '密码不一致',
          tooltipPwd: 'tooltip-false-pwd',
          iconAgainPwd: 'iconfont icon-true',
        }
      },

      mounted() {
        //初始化用户信息
        this.initUserInfo()
      },

      methods: {

        initUserInfo() {
          userApi.getUserInfoById(this.$store.state.user.id)
          .then(result => {
            const data = result.OUT_DATA.data
            this.user = data
            this.avatar = this.BASE_API + '/avatar/' + data.T_PHOTO
            //填充密码
            this.T_AGAIN_PWD = this.user.T_PASSWORD
          })
        },

        beforeRemove(file, fileList){
          return this.$confirm(`确定移除 ${ file.name }？`,'提示',{
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            type: 'warning'
          });
        },

        uploadSuccess(data) {
          this.user.T_PHOTO = data.OUT_DATA.data
          //显示头像信息
          this.avatar = this.BASE_API + '/avatar/' + data.OUT_DATA.data
        },

        checkPwd() {
          if (this.T_AGAIN_PWD != this.user.T_PASSWORD) {
            this.iconAgainPwd = 'iconfont icon-false'
            this.tooltipPwd = 'tooltip-false-pwd'
            this.contentAgainPwd = '密码不一致'
          }else {
            this.iconAgainPwd = 'iconfont icon-true'
            this.tooltipPwd = 'tooltip-true-pwd'
            this.contentAgainPwd = '密码一致'
          }
        },

        updateUserInfo() {
          //密码校验
          if (this.T_AGAIN_PWD != this.user.T_PASSWORD) {
            this.$message({
              type: "error",
              message: "密码不一致,请确认"
            })
            return
          }
          userApi.updateUserInfo(this.user)
          .then(result => {
            this.$message({
              type: "success",
              message: "修改成功"
            })
          });
        },
      }
    }
</script>

<style scoped>
  .tooltip-false-pwd {
    color: red;
  }

  .tooltip-true-pwd {
    color: green;
  }
</style>
