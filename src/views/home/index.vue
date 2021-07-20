<template>
  <div class="body">
    <!-- 头部区域设置 -->
    <header class="header">
      <div class="w">
        <div class="logo">
          <h1><a href="" title="鲁东大学TPMP">鲁东大学</a></h1>
          <!-- <img src="./images/logo.png" alt=""> -->
        </div>
        <div class="fr">
          <nav class="item-bar">
            <a href="/">首 页</a>
            <a @click="openxkdh()">学科导航</a>
            <a @click="openClcPage">中图法导航</a>
            <a @click="openFaqPage">FAQ</a>
            <el-button class="btn" id="btnAddCate" @click="dialogFormVisible = true">登 录</el-button>
          </nav>
        </div>
      </div>
    </header>

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

    <section>
      <div class="w">
        <div class="position">
          <div class="left-sidebar">
            <div class="img">
              <img src="@/assets/images/notice.png" alt="">
            </div>
            <div class="notice">
              <ul v-for="(key,value) in notices.slice(0, 5)">
                <li >
                  <a href="#" @click="openNotice(key.T_NOTICE_ID)"><p><i class="el-icon-caret-right"></i> {{key.T_NOTICE_TITLE}}</p><span>{{key.T_OUT_TIME}}</span></a>
                </li>
              </ul>
              <div class="more"><a href="#" v-if="notices.length > 5" @click="openMoreNotice">MORE...</a></div>
            </div>
          </div>

          <div class="right-sidebar">
            <img src="@/assets/images/computer.png" alt="">
            <div class="navigate">
              <ul>
                <li v-for="(key,value) in subjects">
                  <a href="#" @click="openSubject(key.T_SUBJECT_CODE)">
                    <p>{{key.T_SUBJECT_NAME}}</p>
                  </a>
                </li>
              </ul>
              <div class="search">
                <input type="search" name="" id="input-thesis" placeholder="请在此搜索论文..." @keyup.enter="openThesis()">
                <button @click="openThesis()">开始搜索</button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>

    <el-dialog title="找回密码" :visible.sync="dialogForgetVisible" center width="30%"
               customClass="dialog-title">
      <el-form
        ref="user"
        :model="userForget"
        class="loginForm sign-in-form">
        <el-form-item prop="text">
          <el-input
            v-model="userForget.T_USER_ID"
            placeholder="请输入账号"
            prefix-icon="iconfont icon-user"
          ></el-input>
        </el-form-item>

        <el-form-item prop="text">
          <el-input
            v-model="userForget.T_EMAIL"
            placeholder="请输入邮箱"
            prefix-icon="iconfont icon-email">
            <el-button type="primary" size="mini" slot="append" @click="getCaptchaInfo" :disabled="btnCap">获取验证码</el-button>
          </el-input>
        </el-form-item>

        <el-form-item prop="text" v-if="showPwd">
          <el-input
            v-model="userForget.T_CAPTCHA"
            placeholder="请输入验证码"
            prefix-icon="iconfont icon-captcha"></el-input>
        </el-form-item>


        <el-form-item prop="password" v-if="showPwd">
          <el-input
            v-model="userForget.T_PASSWORD"
            placeholder="请输入密码"
            type="password"
            prefix-icon="iconfont icon-pswd"></el-input>
        </el-form-item>

        <el-form-item prop="password" v-if="showPwd">
          <el-tooltip class="item" effect="light" :content="contentAgainPwd" placement="right" :popper-class="tooltipPwd">
            <el-input
              v-model="userForget.T_PSWD_AGAIN"
              placeholder="请再次输入密码"
              content="right bottom 密码不一致"
              type="password"
              prefix-icon="iconfont icon-pswd"
              :suffix-icon="iconAgainPwd"
              @input="againPwdChange()">
            </el-input>
          </el-tooltip>

        </el-form-item>

        <!-- 找回密码 -->
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button type="info" @click="back" class="forget-btn">返 回</el-button>
        <el-button type="primary" @click="handleForget" class="forget-btn" v-if="showPwd">确 认</el-button>
      </div>
    </el-dialog>

    <!-- footer区域制作 -->
    <footer class="w">
      <div class="pic">
        <img src="@/assets/images/people.png" alt="">
      </div>
      <p>技术支持:同方知网(北京)技术有限公司山东分公司</p>
    </footer>
  </div>
</template>

<script>

  import { isvalidUsername } from "@/utils/loginValidator";
  import noticeApi from '@/api/system/home.js'
  import subjectApi from '@/api/subject/subject'
  import homeApi from '@/api/system/home'
  import login from '../common/login'

  export default {

    components: {
      login
    },
    data() {

      const validateUsername = (rule, value, callback) => {
        if (!isvalidUsername(value)) {
          callback(new Error("请输入正确的用户名"));
        } else {
          callback();
        }
      };
      const validatePass = (rule, value, callback) => {
        if (value.length < 6) {
          callback(new Error("密码不能小于6位"));
        } else {
          callback();
        }
      };

      return {
        notices: [],
        subjects: {},
        subjectLevel: 0,
        dialogFormVisible: false,
        dialogForgetVisible: false,
        btnCap: false,
        showPwd: false,
        contentAgainPwd: '密码不一致',
        tooltipPwd: 'tooltip-false-pwd',
        iconAgainPwd: 'iconfont icon-false',
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
        userForget: {  //密码找回

        }
      }
    },

    mounted() {
      //获取学科信息
      this.getSubject()
      //获取系统更新日志
      this.getSysUpdLog()
    },

    methods: {

      //打开学科导航页面
      openxkdh() {
        let routeData = this.$router.resolve({ path: '/xkdh'});
        window.open(routeData.href, '_blank');
      },

      //打开系统通知页面
      openNotice(noticeId) {
        let routeData = this.$router.resolve({ path: '/notice', query: {id: noticeId} });
        window.open(routeData.href, '_blank');
      },

      //打开通知公告页面
      openMoreNotice() {
        let routeData = this.$router.resolve({ path: '/moreNotice' });
        window.open(routeData.href, '_blank');
      },

      //打开faq页面
      openFaqPage() {
        let routeData = this.$router.resolve({ path: '/faq'});
        window.open(routeData.href, '_blank');
      },

      //打开中图法导航页面
      openClcPage() {
        let routeData = this.$router.resolve({ path: '/clc'});
        window.open(routeData.href, '_blank');
      },

      //打开论文搜索页面
      openThesis() {
        const data = document.getElementById("input-thesis")
        if (data.value == null || data.value == '') {
          this.$message({
            type: "warning",
            message: "您的检索条件为空,请确认"
          })
          return
        }
        let routeData = this.$router.resolve({ path: '/xkdh', query: {name: data.value}});
        window.open(routeData.href, '_blank');
      },

      //打开学科检索页面
      openSubject(subjectCode) {
        let routeData = this.$router.resolve({ path: '/xkdh', query: {id: subjectCode}});
        window.open(routeData.href, '_blank');
      },

      getSubject() {
        subjectApi.getSubjectByLevel(this.subjectLevel)
          .then(result => {
            this.subjects = result.OUT_DATA.data
          })
      },

      getSysUpdLog() {
        noticeApi.getAllNotice()
          .then(result => {
            const data = result.OUT_DATA.data
            this.notices = data
          })
      },

      forgetPwd() {
        this.dialogFormVisible = false
        this.dialogForgetVisible = true
      },

      //校验密码一致性
      againPwdChange() {
        //校验两次密码是否一致
        if (this.userForget.T_PASSWORD != this.userForget.T_PSWD_AGAIN) {
          //修改css样式
          this.tooltipPwd = 'tooltip-false-pwd'
          this.contentAgainPwd = '密码不一致'
          this.iconAgainPwd = 'iconfont icon-false'
        }else {
          this.tooltipPwd = 'tooltip-true-pwd'
          this.contentAgainPwd = '密码一致'
          this.iconAgainPwd = 'iconfont icon-true'
        }
      },

      checkParam() {
        if (this.userForget.T_USER_ID == null || this.userForget.T_USER_ID == '') {
          this.$message({
            type: "error",
            message: "账号不得为空,请确认"
          })
          return
        }
        if (this.userForget.T_EMAIL == null || this.userForget.T_EMAIL == '') {
          this.$message({
            type: "error",
            message: "邮箱不得为空,请确认"
          })
          return
        }
      },

      //处理忘记密码
      handleForget() {
        //校验输入框内容
        this.checkParam()
        if (this.userForget.T_CAPTCHA == null || this.userForget.T_CAPTCHA == '') {
          this.$message({
            type: "error",
            message: "验证码不得为空,请确认"
          })
          return
        }
        if (this.userForget.T_PASSWORD != this.userForget.T_PSWD_AGAIN) {
          this.$message({
            type: "error",
            message: "密码不一致,请确认"
          })
          return
        }
        homeApi.updatePwd(this.userForget)
          .then(result => {
            const code = result.RETURN_CODE
            if (code !== 10000) {
              return
            }else {
              this.$message({
                type: "success",
                message: "修改成功"
              })
              this.dialogFormVisible = true
              this.dialogForgetVisible = false
            }
          })
      },

      back() {
        this.dialogFormVisible = true
        this.dialogForgetVisible = false
      },

      //获取验证码
      getCaptchaInfo() {
        homeApi.getCaptcha(this.userForget.T_USER_ID, this.userForget.T_EMAIL)
          .then(result => {
            this.$message({
              type: "success",
              message: "发送成功,请注意查收"
            })
            this.btnCap = true
            this.showPwd = true
            setTimeout(this.changeBtnCap, 60000)
          })
      },

      changeBtnCap() {
        this.btnCap = false
      },

      handleLogin() {
        const loading = this.$loading({
          lock: true,
          text: '页面装填中......',
          spinner: 'el-icon-loading',
          background: 'rgba(0, 0, 0, 0.7)'
        });
        this.$refs.user.validate((valid) => {
          if (valid) {
            this.loading = true;
            this.$store
              .dispatch("Login", this.user)
              .then(() => {
                loading.close();
                this.dialogFormVisible = false
                this.$router.push({path: this.redirect || "/"});
              })
              .catch(() => {
                loading.close();
                this.loading = false;
              });
          } else {
            this.$message({
              type: "error",
              message: "登录失败"
            })
            loading.close();
            return false;
          }
        });
      }
    }
  }
</script>

<style>

  .dialog-title {
    background: rgba(255, 255, 255, 0.7);
    border-radius: 25px;
  }

  .tooltip-false-pwd {
    color: red;
  }

  .tooltip-true-pwd {
    color: green;
  }

  .el-dialog__title{
    font-family: langqian;
  }

  .dialog-sys-title {
    text-align: center;
    margin-top: 10px;
    font-family: langqian;
  }

  .login-btn {
    width: 100%;
  }

  .tipareas {
    text-align: right;
    font-size: 12px;
    color: #ffffff;
  }

  *{
    font-family: 'Nunito', sans-serif;
    margin:0; padding:0;
    box-sizing: border-box;
    outline: none; border:none;
    text-decoration: none;
    /* 首字母显示为大写 */
    transition:all .2s linear;
  }

  *::selection{
    background: #ff3838;
    color: #fff;
  }

  .forget-btn {
    width: 40%;
  }

  /* body,html{
   height: 100%;
   width:100%;
   margin:0 0 0 0;
   overflow:hidden hidden;
  } */

  html {
    font-size: 62.5%;
    overflow-x: hidden;
    scroll-padding-top: 6rem;
  }


  * {margin: 0;padding: 0;}
  .clearfix {clear: both;}

  .body {
    background-image:url(../../assets/images/bg.png);
    height: 100%;
    /* background-position: center center; */
    background-repeat: no-repeat;
    /* 当内容高度大于图片高度时，背景图像的位置相对于viewport固定 */
    background-attachment: fixed;
    /* 让背景图基于容器大小伸缩 */
    /* background-size: cover; */
    /* 设置背景颜色，背景图加载过程中会显示背景色 */
    background-color: #CCC;
  }

  .w {
    width: 120rem;
    height: 50rem;
    /*width: 1200px;*/
    /*height: 500px;*/
    margin: 0 auto;
    /*margin-left: 0px;*/
    /*margin-right: 0px;*/
    /*margin-top: 1px;*/
    /*margin-bottom: 0px;*/
    /* background-color: #ff6969; */
  }

  .header {
    position: relative;
    height: 115px;
  }
  .logo {
    padding-top: 58px;
    width: 243px;
    height: 37px;
  }
  .logo a {
    display: block;
    width: 243px;
    height: 37px;
    background: url(../../assets/images/logo.png) no-repeat;
    text-indent: -9999px;
    overflow: hidden;
  }

  header .item-bar {
    width: 550px;
    height: 22px;
    position: absolute;
    top: 70px;
    right: 35rem;
    float: right;
  }

  header .item-bar a{
    font-size: 2rem;
    margin-left: 2rem;
    color: #fff;
  }

  header .item-bar a:hover {
    color: #ff3838;
  }

  header .btn {
    position: absolute;
    right: -16rem;
    top: -15px;
  }

  .btn {
    padding: .8rem 3rem;
    border: .2rem solid #604ff4;
    color: #2756ad;
    cursor: pointer;
    font-size: 1.7rem;
    border-radius: 8rem;
    position: relative;
    overflow: hidden;
    z-index: 0;
    margin-top: 1rem;
  }

  .btn::before{
    content: '';
    position: absolute;
    top: 0; right: 0;
    width: 0%;
    height: 100%;
    background: #5778ed;
    transition: .3s linear;
    z-index: -1;
  }

  .btn:hover::before{
    width: 100%;
    left: 0;
  }

  .btn:hover{
    color: #fff;
  }

  section .left-sidebar {
    padding-top: 105px;
    width: 390px;
    /* margin-left:360px; */
    /* display: inline-block; */
    position: relative;
    float: left;
  }

  section .left-sidebar .notice ul li {
    padding-top: 3rem;
    list-style: none;
  }
  section .left-sidebar .notice ul li a{
    color: #fff;
    font-size: 1.6rem;
    display: flex;
    justify-content: space-between;
  }
  section .left-sidebar .notice ul li a:hover {
    color: #ffff00;
  }

  section .left-sidebar .notice{
    position: relative;
    padding-top: 50px;
  }
  section .left-sidebar .notice .more a{
    position: absolute;
    right: -1px;
    bottom: -5rem;
    color: #918cf8;
    font-size: 1.8rem;
  }
  section .left-sidebar .notice .more a:hover {
    color: #ff3838;
  }

  .right-sidebar {
    /*position: absolute;*/
    /*right: 0.01rem;*/
    /*top: 10rem;*/
    float: left;
    max-width: 800px;
    padding-top: 10rem;
    padding-left: 5rem;
    position: relative;
  }

  .right-sidebar .navigate {
    position: absolute;
    /*top: 350px;*/
    top: 30rem;
    left: 20rem;
    height: 100px;
    width: 500px;
    /* top: 17rem;
    left: 14rem; */
  }

  .right-sidebar .navigate ul li {
    float: left;
    list-style: none;
    padding-right: 2rem;
    padding-top: 2rem;
  }

  .right-sidebar .navigate ul li a{
    color: #787878;
    font-size: 1.8rem;

  }
  .right-sidebar .navigate ul li a:hover {
    color: #ff3838;
  }

  .search{
    position: absolute;
    left: -1rem;
    top: 10rem;
    width: 538px;
    height: 36px;
    border: 2px solid #596dee;
    border-radius: 8px;
    overflow: hidden;
    margin-bottom: 5px;
    margin-top: 5px;
  }
  .search input{
    float: left;
    width: 434px;
    height: 32px;
    /* overflow: hidden; */
    padding-left: 10px;
  }
  .search button{
    float: right;
    width: 100px;
    height: 33px;
    cursor: pointer;
    background-color: #596dee;
    font-size: 16px;
    /* overflow: hidden; */
    color: #fff;
  }

  footer {
    /* padding-top: 10rem; */
    /* position: relative; */
  }
  footer .pic {
    float: left;
    margin-top: -160px;
    margin-left: -180px;
  }

  footer p {
    margin-top: -15rem;
    margin-left: 55rem;
    color: #d7d7d7;
    font-size: 1.4rem;
  }

</style>

<style scoped>
  html{
    height: 100%;
    width:100%;
    margin:0 auto;
    overflow:hidden hidden;
  }
  .body {
    overflow:visible;
    overflow-y:hidden;
  }
</style>

