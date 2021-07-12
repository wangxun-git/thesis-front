<template>
    <div class="app-container">
      <el-dialog title="系统登录" :visible.sync="dialogFormVisible" center width="30%"
                 customClass="dialog-title">
        <el-form
          ref="user"
          :rules="loginRules"
          :model="user"
          class="loginForm sign-in-form">
          <el-form-item prop="text">
            <el-input
              v-model="user.T_USER_ID"
              placeholder="请输入账号"
              prefix-icon="iconfont icon-user"
            ></el-input>
          </el-form-item>
          <el-form-item prop="password">
            <el-input
              v-model="user.T_PASSWORD"
              placeholder="请输入密码"
              type="password"
              prefix-icon="iconfont icon-pswd"
              @keyup.enter.native="handleLogin('formValidator')"
            ></el-input>
          </el-form-item>
          <!-- 找回密码 -->
          <div class="tipareas">
            <p><a href="#" @click="forgetPwd()">忘记密码? </a></p>
          </div>
        </el-form>
        <div slot="footer" class="dialog-footer">
          <el-button type="primary" @click="handleLogin()" class="login-btn">登 录</el-button>
        </div>
      </el-dialog>
    </div>
</template>

<script>
    export default {
        name: "login",
      data() {
          return {
            dialogFormVisible: true,
            dialogForgetVisible: true,
            user: {
              T_USER_ID: "",
              T_PASSWORD: ""
            },
            loginRules: {
              T_USER_ID: [
                { required: true, trigger: "blur", validator: validateUsername },
              ],
              T_PASSWORD: [
                { required: true, trigger: "blur", validator: validatePass },
              ],
            },
        }
      },

      methods: {
        handleLogin() {
          this.$refs.user.validate((valid) => {
            if (valid) {
              this.loading = true;
              this.$store
                .dispatch("Login", this.user)
                .then(() => {
                  this.loading = false;
                  this.dialogFormVisible = false
                  this.$router.push({path: this.redirect || "/"});
                })
                .catch(() => {
                  this.loading = false;
                });
            } else {
              alert("登录失败");
              return false;
            }
          });
        },

        forgetPwd() {
          this.dialogFormVisible = false
          this.dialogForgetVisible = true
        },

      }
    }
</script>

<style scoped>

</style>
