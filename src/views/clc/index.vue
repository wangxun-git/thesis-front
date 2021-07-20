<template>
  <div class="app-container">
    <div class="content">
      <div class="main clearfix">
        <div class="head">
          <div class="logo"></div>
          <ul>
            <li><a href="/">首页</a></li>
            <li><a @click="openXkdh()">学科导航</a></li>
            <li><a @click="reloadClc()">中图法导航</a></li>
            <li><a @click="reloadFaq()">FAQ</a></li>
          </ul>
        </div>
        <div class="clearBox">
          <div class="tzgg">
            <div class="BT"></div>
          </div>
        </div>

        <!-- 中图法左侧 -->

        <div class="search">
          <div class="pic"></div>

          <el-tree
            :data="data"
            :props="defaultProps"
            accordion
            @node-click="handleNodeClick"
            highlight-current
            icon-class="el-icon-circle-plus">
            <span class="span-ellipsis" slot-scope="{ node, data }">
            <span :title="node.label">{{ node.label }}</span>
            </span>
          </el-tree>
        </div>


        <!-- 中图法列表 -->
        <div class="clc-list">
          <el-table
            :data="list"
            border
            style="width: 100%"
            v-loading="loading"
            element-loading-text="数据装填中......"
            element-loading-spinner="el-icon-loading"
            element-loading-background="rgba(0, 0, 0, 0.5)">

            <el-table-column label="序号" width="50" type="index" align="center"/>
            <el-table-column label="学号" prop="T_STU_ID" align="center" width="120"/>
            <el-table-column label="作者" prop="T_STU_NAME" align="center" width="100"/>
            <el-table-column label="学生类型" prop="T_STU_TYPE_NAME" width="80" align="center"/>
            <el-table-column label="题名" prop="T_THESIS_ZH_TITLE" width="" align="center" :show-overflow-tooltip='true'/>
            <el-table-column label="答辩时间" prop="T_THESIS_DEFENCE_TIME" align="center" width="100"/>

          </el-table>

          <div class="page">
            <div class="block">
              <!-- <span class="demonstration">完整功能</span> -->
              <el-pagination
                :current-page="page"
                :page-size="limit"
                :total="total"
                style="padding: 30px 0; text-align: center;"
                layout="total, prev, pager, next, jumper"
                @current-change=""
              />
            </div>
          </div>
        </div>

      </div>
    </div>

    <div class="footer">技术支持：同方知网（北京）技术有限公司山东分公司 </div>
    <div class="rdown"></div>
  </div>

</template>

<script>

  import clcApi from '@/api/clc/clc'

  export default {
    data() {
      return {
        list: [],
        loading: true,
        data: [{
          id: '',
          label: '',
          children: [{
            id: '',
            label: '',
            children: [{
              id: '',
              label: ''
            }]
          }]
        }],
        defaultProps: {
          id: 'T_CLC_ID',
          children: 'children',
          label: 'T_CLC_NAME'
        },
        page: 1,
        limit: 5,
        total: 0,
        clc: {},
        clcIds: []
      };
    },

    mounted() {
      //初始化论文内容
      this.initThesis()
      this.getAllClcInfo()
    },

    methods: {

      initThesis(page = 1) {
        this.page = page
        clcApi.getThesisByClcId(this.page)
          .then(result => {
            const data1 = result.OUT_DATA.data
            this.list = data1.data
            this.total = data1.total
          })
        this.loading = false
      },

      getAllClcInfo() {
        clcApi.getAllClc()
        .then(result => {
          const data = result.OUT_DATA.data
          this.data = data
        })
      },

      reloadFaq() {
        let routeData = this.$router.resolve({ path: '/faq'});
        window.open(routeData.href, '_blank');
      },

      openXkdh() {
        let routeData = this.$router.resolve({ path: '/xkdh'});
        window.open(routeData.href, '_blank');
      },

      handleNodeClick(data) {
        const level = data.T_CLC_LEVEL
        const clcId = data.T_CLC_ID
        clcApi.getThesisByClcId(this.page, clcId)
          .then(result => {
            const data1 = result.OUT_DATA.data
            this.list = data1.data
            this.total = data1.total
            this.loading = false
          })
      },

      reloadClc() {
        this.$router.go(0)  //刷新页面
      }
    }
  };
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
    background:url("../../assets/faqImages/bg.png") no-repeat top;
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

  .tzgg{
    width: 928px;
    overflow: hidden;
    margin-top: 58px;
    float: right;
  }

  .clearBox {
    overflow: hidden;
  }

  .BT{
    width: 400px;
    height: 50px;
    background: url("../../assets/clcimages/ChineseGraphicNavigation.png") no-repeat 0;
    float: left;
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

  /* 中图法主体内容部分 */
  .search {
    width: 240px;
    margin-top: 66px;
    overflow: hidden;
    float: left;
  }

  .search .pic {
    background: url("../../assets/clcimages/search.png") no-repeat 0;
    height: 24px;
    width: 185px;
    margin-bottom: 20px;
  }

  /* 树形结构调整 */
  .search >>> .el-tree .el-icon-circle-plus:before {
    color: #5a6cef;
  }


  .span-ellipsis {
    width: 100%;
    overflow: hidden;
    white-space: nowrap;
    text-overflow: ellipsis;
  }

  /*学科导航*/

  .clc-list{
    width: 960px;
    margin-top: 66px;
    float: left;
    overflow: hidden;
  }


  .firstline th{
    font-weight: bold;
    border-top: 1px solid #e8e8e8;
    border-bottom: 1px solid #e8e8e8;
    color: #000720;
    height: 30px;
  }
  .clc-list table{
    width: 100%;
  }
  .clc-list table tr th{
    height: 40px;
    color: #000720;
  }
  .clc-list table tr td{
    text-align: center;
    height: 45px;
    color: #000720;
    margin-top: 5px;
    border-bottom: 1px solid #e8e8e8;
  }
  .clc-list table tr td a{
    color: #000720;
  }
  #tab tr:nth-of-type(even){ background:#f3f8fe;}
  #tab tr:nth-of-type(odd){ background:#fff;}

  .page {
    margin-top: 20px;
    float: right;
  }
</style>
