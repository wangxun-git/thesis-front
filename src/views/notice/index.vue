<template>
  <div class="content">
    <div class="main">
      <div class="head">
        <div class="logo"></div>
        <ul>
          <li><a href="">首页</a></li>
          <li><a>学科导航</a></li>
          <li><a>中图法导航</a></li>
          <li><a>FAQ</a></li>
        </ul>
      </div>
      <div class="timu">
        <p class="title" v-html="title"></p>
        <p class="author" v-html="author">发表时间：<span>2020-01-21</span>&nbsp;&nbsp;&nbsp;|&nbsp;&nbsp;&nbsp;阅读量：<span>21</span>&nbsp;&nbsp;&nbsp;|&nbsp;&nbsp;&nbsp;作者：<span>路人甲</span></p>
        <a class="locat" @click="back">返回&#62;&#62;</a>
      </div>
      <div class="detail" v-html="pDiv">

      </div>
      <div class="newbtn">
        <a @click="reloadPreviosPage()">
          <span class="se">上</span>
          <span class="red">一篇&nbsp;&#58;&nbsp;</span><span v-html="previous"></span>
        </a>
        <a @click="reloadNextPage()">
          <span class="se">下</span>
          <span class="red">一篇&nbsp;&#58;&nbsp;</span><span v-html="next"></span>
        </a>
      </div>
    </div>

    <div class="footer">技术支持：同方知网（北京）技术有限公司山东分公司 </div>
    <div class="rdown"></div>


  </div>
</template>

<script>

  import { isvalidUsername } from "@/utils/loginValidator";
  import noticeApi from '@/api/system/home.js'
  import noticePageApi from '@/api/home/notice'

  export default {

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
        title: '',
        pDiv: '',
        author: '',
        previous: '',
        previousId: '',
        next: '',
        nextId: '',
        notices: [],
        dialogFormVisible: false,
        noticeId: '',
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
        noticeList: null
      }
    },

    watch: {
      $route(){
        this.init()
        this.getNoticeInfoById()
      },
    },

    created() {
      //获取请求参数
      this.init()
    },

    mounted() {
      //获取系统更新日志
      this.getSysUpdLog()
      //根据id获取通知信息
      this.getNoticeInfoById()
    },

    methods: {

      init() {
        if (this.$route.query && this.$route.query.id) {
          const id = this.$route.query.id
          this.noticeId = id
        }
      },

      //刷新本页面，访问其他通知
      reloadPreviosPage() {
        this.$router.push({ path: '/notice', query: {id: this.previousId} });
        // this.init()
        // this.getNoticeInfoById()
      },

      reloadNextPage() {
        this.$router.push({ path: '/notice', query: {id: this.nextId} });
      },

      back() {
        this.$router.go(-1)
      },

      getSysUpdLog() {
        noticeApi.getAllNotice()
          .then(result => {
            const data = result.OUT_DATA.data
            this.notices = data
          })
      },

      getNoticeInfoById() {
        noticePageApi.getNoticeById(this.noticeId)
        .then(result => {
          this.noticeList = result.OUT_DATA.data
          const data = this.noticeList.data
          this.pDiv = data.T_NOTICE_CONTEXT
          this.title = data.T_NOTICE_TITLE
          this.author = '发表时间：<span>' + data.T_CREATE + '</span>&nbsp;&nbsp;&nbsp;|&nbsp;&nbsp;&nbsp;阅读量：<span>' + data.T_COUNT + '</span>'
          this.previous = this.noticeList.previous.T_NOTICE_TITLE
          this.previousId = this.noticeList.previous.T_NOTICE_ID
          this.next = this.noticeList.next.T_NOTICE_TITLE
          this.nextId = this.noticeList.next.T_NOTICE_ID
        })
      },

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
      }
    }

  }
</script>

<style scoped>

  * {margin: 0;padding: 0;}
  .clearfix {clear: both;}

  a{text-decoration: none;color: #000;}
  a:hover{ cursor:pointer;}

  body{
    font-family:"微软雅黑";
    font-size:14px;
  }

  .content{
    width: 100%;
    overflow: hidden;
    margin: 0 auto;
    background:url("../../assets/noticeImg/bg.png") no-repeat top;
  }
  .main{
    width: 1200px;
    margin: 0 auto;
    overflow: hidden;
  }
  .head{
    width: 100%;
    overflow: hidden;
    margin-top: 60px;
  }
  .head ul{
    float: right;
    list-style: none;
  }
  .head ul li{
    float: left;
    margin: 0 18px;
  }
  .head ul li a{
    color: #5c63f0;
    font-size: 24px;
    font-family: 'Nunito', sans-serif;
  }
  .logo{
    background: url("../../assets/noticeImg/TPMP.png") no-repeat 0;
    width: 250px;
    height: 40px;
    float: left;
  }

  .timu{
    width: 100%;
    overflow: hidden;
    border-bottom: 1px solid #c5c5c5;
    position: relative;
    margin-top: 88px;
  }
  .locat{
    display: block;
    padding-left: 24px;
    position: absolute;
    right: 30px;
    bottom: 24px;
    color: #605bf2;
    font-size: 20px;
    background: url("../../assets/noticeImg/locat.png") no-repeat 0;

  }
  .title{
    font-size: 20px;
    color: #000;
    font-weight: bold;
    margin-left: 130px;
  }
  .author{
    color: #6d6d6d;
    margin: 24px 0 24px 130px;
  }
  .detail{
    width: 1080px;
    margin: 0 auto;
    margin-top: 60px;
    min-height: 330px;
  }
  .detail p{
    color: #3f3f3f;
    font-size: 16px;
    line-height: 34px;
    text-indent: 2em;
  }

  .newbtn{
    width:1080px;
    overflow: hidden;
    margin-left: 60px;
    margin-top: 30px;
  }
  .newbtn a{
    display: block;
    width: 100%;
    margin-top: 20px;
    color: #3f3f3f;
  }
  .se{
    color: #fff;
    background-color: #ca3143;
    padding: 0 3px;
  }
  .red{
    color: #ca3143;
  }

  .rdown{
    position:fixed;
    right: 0;
    bottom: 0;
    background: url(../../assets/noticeImg/rdown.png) no-repeat 0;
    width: 79px;
    height: 79px;
  }

  .footer{
    width: 1200px;
    overflow: hidden;
    margin: 0 auto;
    text-align: center;
    line-height: 92px;
    color: #aaa;
    background: url("../../assets/noticeImg/ldown.png") no-repeat 0;
    margin-top: 80px;
  }

</style>
