<template>
  <div class="app-container">
    <el-form>

      <el-form-item label="邮箱地址">
        <el-input v-model="emailSys.T_EMAIL_URL" clearable disabled></el-input>
      </el-form-item>

      <el-form-item label="邮箱密码">
        <el-input v-model="emailSys.T_EMAIL_PSWD" type="password" clearable disabled></el-input>
      </el-form-item>

      <el-form-item label="邮件端口">
        <el-input v-model="emailSys.T_EMAIL_PORT" clearable disabled></el-input>
      </el-form-item>

      <el-form-item label="邮箱SMTP服务器">
        <el-input v-model="emailSys.T_EMAIL_SMTP" clearable disabled></el-input>
      </el-form-item>

      <el-form-item label="邮箱主题">
        <el-input v-model="emailSys.T_EMAIL_SUBJECT" clearable></el-input>
      </el-form-item>

      <el-form-item label="是否开启邮箱通知">
        <el-tooltip :content="emailSys.T_IS_OPEN == 0 ? '否' : '是'" placement="top">
          <el-switch
            v-model="emailSys.T_IS_OPEN"
            active-color="#13ce66"
            inactive-color="#ff4949"
            active-value="1"
            inactive-value="0">
          </el-switch>
        </el-tooltip>
      </el-form-item>

      <el-button type="success" @click="saveorUpdateEmailSysInfo()">保存</el-button>

    </el-form>
  </div>
</template>

<script>

  import sysApi from '@/api/system/sys'

    export default {

      data() {
        return {
          emailSys: {
            T_EMAIL_ID: '',
            T_EMAIL_URL: '',
            T_EMAIL_PSWD: '',
            T_EMAIL_PORT: '',
            T_EMAIL_SMTP: '',
            T_EMAIL_SUBJECT: '',
            T_IS_OPEN: '0'
          },
        }
      },

      created() {
        this.getEmailSysInfo()
      },

      methods: {
        getEmailSysInfo() {
          sysApi.getEmailSys()
          .then(result => {
            const data = result.OUT_DATA.data
            if (data == null) {
              this.emailSys = {}
              return
            }
            this.emailSys = data
          })
        },

        saveorUpdateEmailSysInfo(){
          //判断主键是否为空
          if (this.emailSys.T_EMAIL_ID == null) {
            sysApi.saveEmailSys(this.emailSys)
              .then(result => {
                this.$message({
                  type: "success",
                  message: "保存成功"
                })
              })
          }else {
            sysApi.updateEmailSys(this.emailSys)
              .then(result => {
                this.$message({
                  type: "success",
                  message: "修改成功"
                })
              })
          }
        }

      }

    }
</script>

<style scoped>

</style>
