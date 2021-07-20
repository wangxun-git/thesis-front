<template>
  <div class="app-container">
    <div class="content">
      <div class="main clearfix">
        <div class="head">
          <div class="logo"></div>
          <ul>
            <li><a href="/">首页</a></li>
            <li><a @click="reloadXkdh()">学科导航</a></li>
            <li><a @click="openClcPage()">中图法导航</a></li>
            <li><a @click="openFaqPage()">FAQ</a></li>
          </ul>
        </div>
        <div class="clearBox">
          <div class="tzgg">
            <div class="BT"></div>
            <div class="search">
              <input class="search-input" id="search-name" type="text" placeholder="请输入关键词...">
              <input class="search-btn" @click="selectThesisInfo()" type="button">
            </div>
          </div>
        </div>

        <!-- 中图法左侧 -->

        <div class="list">
          <div class="xkleft">
            <div class="dy">
              <p class="mark1">学生类型</p>
              <ul class="hang">
                <el-checkbox-group v-model="stuTypeIdList" v-for="(key,value) in stuTypeList" :key="value">
                  <li>
                    <el-checkbox :label="key.T_STU_TYPE_ID">{{key.T_STU_TYPE_ZH_NAME}}</el-checkbox>
                  </li>
                </el-checkbox-group>
              </ul>
            </div>
            <div class="dy">
              <p class="mark2">论文年份
                <span class="all" @click="selectAllYear()">全部</span>
              </p>
              <ul class="hang">
                <el-checkbox-group v-model="yearIdList"  >
                  <li v-for="year in yearList" :key="year">
                    <!--                  <label>-->
                    <!--                    <input type="checkbox" name="num">-->
                    <!--                    <span class="checkbox">-->
                    <!--                      <i>&check;</i>-->
                    <!--                    </span>-->
                    <!--                    <span class="item">马克思主义学院</span>-->

                    <el-checkbox :label="year">{{year}}</el-checkbox>
                    <!--                  </label>-->
                  </li>
                </el-checkbox-group>
<!--                <li>-->

<!--                  <label>-->
<!--                    <input type="checkbox" name="num">-->
<!--                    <span class="checkbox">-->
<!--                      <i>&check;</i>-->
<!--                    </span>-->
<!--                    <span class="item">2021年</span>-->
<!--                  </label>-->

<!--                </li>-->
              </ul>
            </div>
            <div class="dy">
              <p class="mark3">学科门类<span class="all" @click="selectAllSubject()">全部</span></p>
              <ul class="hang">
                <el-checkbox-group v-model="subjectIdCheckList">
                  <li v-for="(key,value) in subjectList" :key="value">
                    <el-checkbox :label="key.T_SUBJECT_CODE">{{key.T_SUBJECT_NAME}}</el-checkbox>
                    <!--                  </label>-->
                  </li>
                </el-checkbox-group>
              </ul>
            </div>
            <div class="dy">
              <p class="mark4">院系分类<span class="all" @click="selectAllCollege()">全部</span></p>
              <ul>
                <el-checkbox-group v-model="collegeIdCheckList" >
                  <li v-for="(key,value) in collegeList" :key="value">
                    <el-checkbox :label="key.T_COLLEGE_ID">{{key.T_COLLEGE_NAME}}</el-checkbox>
                  </li>
                </el-checkbox-group>
              </ul>
            </div>

          </div>

          <!-- 学科列表 -->
          <div class="xk-list">
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

              <el-table-column label="答辩时间" prop="T_THESIS_DEFENCE_TIME" align="center" width="110" sortable/>

            </el-table>

            <div class="page">
              <div class="block">
                <!-- 分页 -->
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
    </div>

    <div class="footer">技术支持：同方知网（北京）技术有限公司山东分公司 </div>
    <div class="rdown"></div>
  </div>

</template>

<script>

  import collegeApi from '@/api/collegeTutor/college'
  import subjectApi from '@/api/subject/subject'
  import stuTypeApi from '@/api/stutype/stutype.js'

  export default {
    data() {
      return {
        list: [],
        loading: true,
        collegeList: [],
        collegeIdCheckList: [],
        subjectList: [],
        subjectIdCheckList: [],
        stuTypeList: [],
        stuTypeIdList: [],
        yearList: [],
        yearIdList: [],
        page: 1,
        limit: 20,
        total: 0,
        map: '', //请求参数
        temp: [],
        xkdhCondi: {}
      }
    },

    created() {
      //填充年时间
      this.setYearList()
    },

    mounted() {
      //初始化论文信息
      this.init()
      //
      this.getStuTypeInfo()
      //获取学院信息
      this.getCollegeInfo()
      //获取学科门类
      this.getSubjectInfo()
    },

    methods: {

      init() {
        if (this.$route.query && this.$route.query.id) {
          const id = this.$route.query.id
          this.subjectIdCheckList.push(id)
          this.xkdhCondi.subjectIds = this.subjectIdCheckList
        }
        if (this.$route.query && this.$route.query.name) {
          const name = this.$route.query.name
          this.xkdhCondi.thesisName = name
        }
        this.initThesisInfo()
      },

      initThesisInfo(page = 1) {
        subjectApi.selectThesis(this.page, this.xkdhCondi)
          .then(result => {
            const data = result.OUT_DATA.data
            this.total = data.total
            this.list = data.data
            this.loading = false
          });
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

      reloadXkdh() {
        this.$router.go(0)  //刷新页面
      },

      getCollegeInfo() {
        collegeApi.getAllCollegeInfo()
          .then(result => {
            this.collegeList = result.OUT_DATA.data
          })
      },

      getSubjectInfo(level = 0) {
        subjectApi.getSubjectByLevel(level)
        .then(result => {
          const data = result.OUT_DATA.data
          this.subjectList = data
        })
      },

      getStuTypeInfo() {
        stuTypeApi.getStudentStuType()
          .then(result => {
            this.stuTypeList = result.OUT_DATA.data
          })
      },

      setYearList() {
        let nowDate = new Date();
        let year = nowDate.getFullYear()
        for (let i = 0; i < 10; i++) {
          this.yearList.push('' + year - i  + '' )
        }
      },

      selectAllYear(val) {
        this.yearIdList = this.yearList
      },

      selectAllSubject(val) {
        this.subjectIdCheckList = []
        for (let i = 0; i < this.subjectList.length; i++) {
          this.subjectIdCheckList.push(this.subjectList[i].T_SUBJECT_CODE)
        }
      },

      selectAllCollege() {
        for (let i = 0; i < this.collegeList.length; i++) {
          this.collegeIdCheckList.push(this.collegeList[i].T_COLLEGE_ID)
        }
      },

      selectThesisInfo(page = 1) {
        //删除地址栏参数
        this.$router.push({query: {}})
        this.page = page
        const name = document.getElementById("search-name")
        this.xkdhCondi.thesisName = name.value
        if (this.subjectIdCheckList != null && this.subjectIdCheckList != '') {
          this.xkdhCondi.subjectIds = this.subjectIdCheckList
        }else {
          this.xkdhCondi.subjectIds= []
        }
        if (this.collegeIdCheckList != null && this.collegeIdCheckList != '') {
          this.xkdhCondi.collegeIds = this.collegeIdCheckList
        }else {
          this.xkdhCondi.collegeIds = []
        }
        if (this.stuTypeIdList != null && this.stuTypeIdList != '') {
          this.xkdhCondi.stuTypeIds = this.stuTypeIdList
        }else {
          this.xkdhCondi.stuTypeIds = []
        }
        if (this.yearIdList != null && this.yearIdList != '') {
          this.xkdhCondi.yearIds = this.yearIdList
        }else {
          this.xkdhCondi.yearIds = []
        }
        subjectApi.selectThesis(this.page, this.xkdhCondi)
        .then(result => {
          const data = result.OUT_DATA.data
          console.log(data.data)
          this.total = data.total
          this.list = data.data
          this.loading = false
        });
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
    background: url("../../assets/xkdhimages/SubjectNavigation.png") no-repeat 0;
    float: left;
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



  /*学科导航*/

  .list {
    padding-top: 30px;
  }

  .xkleft{
    width: 240px;
    overflow: hidden;
    float: left;
  }

  .hang li{
    float: left;
  }
  .dy{
    overflow: hidden;
    padding-bottom: 5px;
    margin-bottom: 15px;
  }
  .dy p{
    color: #5a6cef;
    font-size: 20px;
    font-weight: bold;
    border-left: 4px solid #5a6cef;
    padding-left: 35px;
  }
  .all{
    height: 20px;
    line-height: 20px;
    color: #fff;
    background-color: #5a6cef;
    font-size: 14px;
    font-weight: 100;
    border-radius: 15px;
    padding: 0 8px;
    float: right;
    margin-right: 20px;
    margin-top: 5px;
    cursor: pointer;
  }
  .dy ul{
    list-style: none;
    overflow: hidden;
  }
  .dy ul li{
    overflow: hidden;
    margin-top: 12px;
  }
  .mark1{
    background: url("../../assets/xkdhimages/student.png") no-repeat 10px;
  }
  .mark2{
    background: url("../../assets/xkdhimages/year.png") no-repeat 10px;
  }
  .mark3{
    background: url("../../assets/xkdhimages/class.png") no-repeat 10px;
  }
  .mark4{
    background: url("../../assets/xkdhimages/sys.png") no-repeat 10px;
  }
  label {
    font-size: 14px;
    margin: 0 10px;
    cursor: pointer;
  }

  /* 把多选框隐藏 */
  label input[type="checkbox"] {
    display: none;
  }

  /* 自定义多选框初始样式 */
  label .checkbox {
    display: inline-block;
    margin-right: 2px;
    position: relative;
    width: 18px;
    height: 18px;
    border: 1px solid #aaa;
    border-radius: 4px;
    vertical-align: -4px;
    background-color: #fff;
  }

  /* 自定义多选框选中样式 初始隐藏*/
  label .checkbox::after {
    content: "";
    width: 100%;
    height: 100%;
    position: absolute;
    left: 0;
    right: 0;
    top: 0;
    bottom: 0;
    margin: auto;
    z-index: -1;
    background-color: #5873ee;
    display: none;
  }
  label .checkbox i {
    font-weight: bolder;
    position: absolute;
    left: 1px;
    right: 0;
    top: 0;
    bottom: 0;
    margin: auto;
    color: #fff;
    font-size: 14px;
  }
  /* 显示自定义多选框 */
  label input[type="checkbox"]:checked+.checkbox::after {
    display: block;
  }

  /* 切换自定义多选框border颜色 */
  label input[type="checkbox"]:checked+.checkbox {
    border-color: #ef765a;
    background-color: #ef765a;
  }

  /* 选中时，文本加颜色 */
  label input[type="checkbox"]:checked~.item {
    color: #ef765a;
  }



  .xk-list{
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
  .xk-list table{
    width: 100%;
  }
  .xk-list table tr th{
    height: 40px;
    color: #000720;
  }
  .xk-list table tr td{
    text-align: center;
    height: 45px;
    color: #000720;
    margin-top: 5px;
    border-bottom: 1px solid #e8e8e8;
  }
  .xk-list table tr td a{
    color: #000720;
  }
  #tab tr:nth-of-type(even){ background:#f3f8fe;}
  #tab tr:nth-of-type(odd){ background:#fff;}

  .page {
    margin-top: 20px;
    float: right;
  }
</style>
