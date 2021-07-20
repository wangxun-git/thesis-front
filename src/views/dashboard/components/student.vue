<template>
  <div class="app-container">
    <div class="content">
      <div class="main clearfix">
        <!-- 头部区域 -->
        <div class="head">
          <div class="logo"></div>
        </div>
        <!-- 页面主体区域 -->
        <div class="stepBox">
          <div class="state"><h1>论文状态</h1><span>({{thesisStatusName}})</span></div>
          <div class="steps">
            <el-steps :active="active" finish-status="success" >
              <el-step title="论文提交" ></el-step>
              <el-step title="导师审核" ></el-step>
              <el-step title="研究生院审核" ></el-step>
              <el-step title="论文编目" ></el-step>
            </el-steps>
          </div>
        </div>
        <div class="submit">
          <div class="text">
            <h3>请先仔细阅读下面的说明,然后点击"论文提交"进入学位论文远程提交系统</h3>
            <p>1. 论文提交必须在校网内进行,注册用户名请使用学号。</p>
            <p>2. 如果您的论文属于涉密性质请由各个分院决定是否上传。</p>
            <p>3. 按提交步骤填写论文基本信息,文摘信息以及用以反馈审核一件的个人联系信息等。请注意必填项需填写完整，所提交内容如论文题目，文摘等应与印刷本论文保持一致，否则会导致审核不合格。</p>
            <p>4. 上传论文：您所提交的数字论文全文应为一个PDF文档，并以“学号——姓名——题目”为文件名。系统只支持提交一个论文正文（包括中英文摘要，正文，参考文献）。如果上载速度较慢，请将代理服务器设置关闭。</p>
            <p>5. 在线提交完毕后，为了您的信息安全，请关闭浏览器。</p>
            <p>6. 点击“论文提交”，输入学号和密码后，选择“查看状态”。如果审核不合格，可以继续修改论文信息，一旦审核合格后便不可再修改任何论文信息。</p>
            <p>7. 论文的完整性及准确性由学生本人负完全责任，图书馆不负责对论文的任何有效性进行检查。</p>
            <br>
            <h3>提交完成后可以通过两种途径了解论文审核状态：</h3>
            <p>1. 论文经过审核后系统将会自动将审核意见按所填写的邮件地址发送邮件，请及时查收邮件。</p>
            <p>2. 点击“论文提交”，输入学号和密码后，选择“查看状态”。如果审核不合格，可以继续修改论文信息，一旦审核合格后便不可再修改任何论文信息。</p>
          </div>
          <div class="download">
            <el-card class="box-card">
              <a href="#" class="img" @click="downloadThesisTempInfo()">
                <img src="../../../assets/images/submit.png" alt="">
              </a>
              <el-button type="warning" class="btn" @click="openSubmit()">论文提交</el-button>

            </el-card>
          </div>

        </div>
      </div>
    </div>
    <div class="footer">技术支持：同方知网（北京）技术有限公司山东分公司 </div>
    <div class="rdown"></div>
  </div>
</template>

<script>

  import homeApi from '@/api/system/home.js'

  export default {


    data() {
      return {
        active: 2,
        thesisStatusName: '已提交',
      }
    },

    mounted() {
      //获取登录用户的论文状态
      this.getThesisStatusInfoByToken()
    },

    methods: {

      getThesisStatusInfoByToken() {
        homeApi.getThesisStatusByToken()
        .then(result => {
          const data = result.OUT_DATA.data
          this.active = data.active
          this.thesisStatusName = data.statusName
        })
      },

      openSubmit() {
        this.$router.push({path : '/thesis/submit'})
      },

      //下载论文模板
      downloadThesisTempInfo() {
        homeApi.downloadThesisTemp()
          .then(result => {
            if (!result) {
              return
            }
            const link = document.createElement('a')
            let blob = new Blob([result], { type: 'application/zip' })
            link.style.display = 'none';
            link.href = URL.createObjectURL(blob);

            link.setAttribute('download', '论文模板')
            document.body.appendChild(link)
            link.click()
            document.body.removeChild(link)
          }).catch(error => {
          console.error(error)
        })
      }
    }
  }
</script>

<style lang="less" scoped>
  // 整体ui
  * {margin: 0;padding: 0;}
  .clearfix {clear: both;}

  a{text-decoration: none;color: #000;}
  a:hover{ cursor:pointer;}

  body{
    font-family:"微软雅黑";
    font-size:14px;
    height: 100%;
  }

  .content{
    width: 100%;
    overflow: hidden;
    margin: 0 auto;
    background:url("../../../assets/faqImages/bg.png") no-repeat top;
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
    background: url("../../../assets/noticeImg/TPMP.png") no-repeat 0;
    width: 250px;
    height: 40px;
    float: left;
  }

  .rdown{
    position:fixed;
    right: 0;
    bottom: 0;
    background: url("../../../assets/noticeImg/rdown.png") no-repeat 0;
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
    background: url("../../../assets/noticeImg/ldown.png") no-repeat 0;
    margin-top: 55px;
  }

  // 主体部分css
  .stepBox {
    margin-top: 150px;
    height: 80px;
    border-top: 2px solid #b8b8b8;
    border-bottom: 2px solid #b8b8b8;
    position: relative;
  }

  .state {
    line-height: 80px;
    padding-left: 50px;
  }
  .state h1 {
    display: inline-block;
  }
  .state span {
    font-size: 20px;
    color: #ffa4a4;
  }

  .steps {
    // display: inline-block;
    position: absolute;
    top: 15px;
    left: 400px;
    width: 770px;
    // font-size: 30px;
  }

  .submit {
    height: 500px;
    position: relative;

  }

  .text {
    padding-top: 50px;
    padding-left: 50px;
    width: 550px;
    font-size: 12px;
    line-height: 24px;
    // float: left;
  }

  .text h3 {
    color: #ca3143;
  }

  .download {
    position: absolute;
    top: 50px;
    right: 75px;
  }

  .box-card {
    width: 380px;
    height: 450px;

  }

  .img {
    position: absolute;
    top: 90px;
    left: 90px;
  }

  .btn {
    width: 200px;
    height: 50px;
    position: absolute;
    top: 350px;
    left: 90px;
  }

</style>
