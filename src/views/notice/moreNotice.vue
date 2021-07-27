<template>
  <div class="app-container">
    <div class="content">
      <div class="main clearfix">
        <div class="head">
          <div class="logo"></div>
          <ul>
            <li><a href="/">首页</a></li>
            <li><a @click="openXkdh()">学科导航</a></li>
            <li><a @click="openClc()">中图法导航</a></li>
            <li><a @click="reloadFaq()">FAQ</a></li>
          </ul>
        </div>
        <div class="clearBox">
          <div class="tzgg">
            <div class="BT"></div>
          </div>
        </div>

        <!-- 通知列表制作 -->
        <div class="line">
        </div>

        <div class="notice">
          <a v-for="(key,value) in list" @click="changeShow(key.T_NOTICE_ID)">
            <i class="el-icon-caret-right"></i>
            <h3>&nbsp;&nbsp;{{key.T_NOTICE_TITLE}}
              <p class="date">{{key.T_OUT_TIME}}</p>
            </h3>
          </a>
        </div>

<!--        <el-drawer-->
<!--          :title="drawerTitle"-->
<!--          :visible.sync="showDrawer"-->
<!--          direction="rtl"-->
<!--          size="40%">-->
<!--          <p v-html="context"></p>-->
<!--          <a class="file" v-html="noticeFileName" @click="downloadNotice"></a>-->
<!--        </el-drawer>-->

        <!-- 分页组件 -->
        <div class="page">
          <!-- 分页 -->
          <el-pagination
            :current-page="page"
            :page-size="limit"
            :total="total"
            style="padding: 30px 0; text-align: center;"
            layout="total, prev, pager, next, jumper"
            @current-change="getNoticeInfoByPage"
          />
        </div>
      </div>
    </div>

    <div class="footer">技术支持：同方知网（北京）技术有限公司山东分公司 </div>
    <div class="rdown"></div>

  </div>
</template>

<script>

  import homeApi from '@/api/system/home'

  export default {
    data() {
      return {
        list: [],
        page: 1,
        limit: 5,
        total: 0,
        // showDrawer: false,
        drawerTitle: '',
        context: '',
        noticeFileName: '',
        noticeId: '',
      }
    },

    created() {
      this.getNoticeInfoByPage()
    },

    methods: {

      openXkdh() {
        let routeData = this.$router.resolve({ path: '/xkdh'});
        window.open(routeData.href, '_blank');
      },

      getNoticeInfoByPage(page = 1) {
        this.page = page
        homeApi.getNoticeByPage(this.page)
        .then(result => {
          const data = result.OUT_DATA.data
          this.list = data.data
          this.total = data.total;
        })
      },

      openClc() {
        let routeData = this.$router.resolve({ path: '/clc'});
        window.open(routeData.href, '_blank');
      },

      reloadFaq() {
        let routeData = this.$router.resolve({ path: '/faq'});
        window.open(routeData.href, '_blank');
      },

      changeShow(noticeId) {
        let routeData = this.$router.resolve({ path: '/notice', query: {id: noticeId} });
        window.location.href = routeData.href
        // window.open(routeData.href, '_blank');
        // this.showDrawer = !this.showDrawer
        //遍历数据集合
        // for (let i = 0; i < this.list.length; i++) {
        //   if (noticeId == this.list[i].T_NOTICE_ID) {
        //     this.drawerTitle = this.list[i].T_NOTICE_TITLE
        //     this.context = this.list[i].T_NOTICE_CONTEXT
        //     if (this.list[i].T_NOTICE_FILE != '' && this.list[i].T_NOTICE_FILE != null) {
        //       this.noticeFileName = '<br/><br/>' + '通知文件: ' + this.list[i].T_NOTICE_FILE
        //     }else {
        //       this.noticeFileName = ''
        //     }
        //     if (this.list[i].T_NOTICE_ID != null && this.list[i].T_NOTICE_ID != '') {
        //       this.noticeId = this.list[i].T_NOTICE_ID
        //     }else {
        //       this.noticeId = ''
        //     }
        //   }
        // }
        // this.showDrawer = true
      },

      //下载通知文件
      downloadNotice() {
        homeApi.downloadFile(this.noticeId)  //文件导出
          .then(result => {
            if (!result) {
              return
            }
            const link = document.createElement('a')
            // let blob = new Blob([result], {type: 'application/vnd.ms-excel'})
            let blob = new Blob([result])
            link.style.display = 'none';
            link.href = URL.createObjectURL(blob);
            link.setAttribute('download', this.noticeFileName)
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

<style scoped>

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
    background:url("../../assets/faqImages/bg.png") no-repeat top;
  }

  .file {
    color: #04befe;
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
  /*消息列表*/

  .tzgg{
    width: 928px;
    overflow: hidden;
    margin-top: 58px;
    float: right;
  }

  .search{
    width: 348px;
    overflow: hidden;
    float: right;
    margin-right: 25px;
  }
  .search input{
    height: 34px;
    border-radius: 17px;
    vertical-align: middle;
    outline: none;
  }
  .search-input{
    border: 1px #5873ee solid;
    width: 290px;
    padding-left: 10px;
    line-height: 34px;
    font-size: 14px;
    color: #909090;
  }
  .search-btn{
    width: 34px;
    background:url("../../assets/faqImages/js.png") no-repeat 7px 6px;
    background-color: #5873ee;
    margin-left: 5px;
    cursor: pointer;
  }
  .search-btn:hover{
    background-color: #ef685a;
    transition: all 1s linear 0s;
  }
  input::-webkit-input-placeholder{
    color:#bdbdbd;
  }
  input::-moz-placeholder{   /* Mozilla Firefox 19+ */
    color:#bdbdbd;
  }
  input:-moz-placeholder{    /* Mozilla Firefox 4 to 18 */
    color:#bdbdbd;
  }
  input:-ms-input-placeholder{  /* Internet Explorer 10-11 */
    color:#bdbdbd;
  }

  .rdown{
    position:fixed;
    right: 0;
    bottom: 0;
    background: url("../../assets/noticeImg/rdown.png") no-repeat 0;
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
    margin-top: 50px;
  }

  .BT{
    width: 394px;
    height: 44px;
    background: url("../../assets/noticeImg/new.png") no-repeat 0;
    float: left;
  }

  .clearBox {
    overflow: hidden;
  }

  .line {
    /* width: 928px; */
    height: 8px;
    margin-top: 32px;
    /* font-size: 22px; */
    border-top: 3px solid #717df2;
    border-bottom: 2px solid #cacffa;
  }

  .notice i {
    font-size: 15px;
    line-height: 22px;
    color: #ff7800;
    float: left;
  }

  .notice {
    height: 480px;
    /* border-bottom: 1px red solid; */
  }


  .notice a {
    display: block;
    padding: 50px 10px 0 10px;
  }

  .notice a .title {
    display: inline;
    float: left;
  }

  .notice a .date {
    float: right;
    padding-right: 30px;
  }

  .notice a .text {
    padding: 10px 20px 0 10px;
    overflow: hidden;
    text-overflow: ellipsis;
    display: -webkit-box;
    -webkit-line-clamp: 1;
    -webkit-box-orient: vertical;
    font-size: 16px;
    color: #c1c1c1;
  }

  .page {
    float: right;
  }

  ul.pagination {

    display: inline-block;

    padding: 0;

    margin: 0;

  }

  ul.pagination li {display: inline;}

  ul.pagination li a {

    color: black;

    float: left;

    padding: 8px 16px;

    text-decoration: none;

  }

  ul.pagination li a.active {

    background-color: #5b69f0;

    color: white;

  }

  ul.pagination li a:hover:not(.active) {background-color: #ddd;}

  ul.pagination li input {
    width: 25px;
    border-radius: 0;
    border: 1px solid #c1c1c1;
  }

</style>
