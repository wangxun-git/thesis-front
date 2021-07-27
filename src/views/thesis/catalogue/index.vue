<template>
  <div class="app-container">
    <router-view/>
    <div class="content">
      <div class="main clearfix">
        <!-- 头部区域 -->
        <div class="head">
          <div class="logo"></div>
          <div href="javascript:;" class="userinfo">
            <img :src="this.BASE_API + /avatar/ + avatar"  class="layui-nav-img">
            <a @click="openPersonCenter()">你好&nbsp;<span>{{name}}</span></a>
            <a @click="loginOut" class="layout">退出</a>
          </div>
          <ul>
            <li><a @click="openSysHome()">系统首页</a></li>
            <li><a @click="openPersonalHome()" class="shouye">个人首页</a></li>
            <li><a @click="openSubmit()">论文提交</a></li>
          </ul>

        </div>
        <!-- 步骤条 -->
        <div class="steps">
          <el-steps :active="active" finish-status="success" align-center>
            <el-step title="论文提交" ></el-step>
            <el-step title="导师审核" ></el-step>
            <el-step title="研究生院审核" ></el-step>
            <el-step title="论文编目" ></el-step>
          </el-steps>
        </div>

        <el-form>
          <div class="left-box">
            <el-form
              label-width="80px"
              label-position="right">
              <el-row>
                <el-col :span="12">
                  <el-form-item label="学号">
                    <el-input v-model="thesis.T_STU_ID" class="input-width" :disabled="editThesis"/>
                  </el-form-item>
                </el-col>

                <el-col :span="12">
                  <el-form-item label="导师">
                    <el-input v-model="thesis.T_TUTOR_NAME" class="input-width" placeholder="请使用;号分隔" :disabled="editThesis"></el-input>
                  </el-form-item>
                </el-col>
              </el-row>

              <el-form-item label="论文题目">
                <el-input v-model="thesis.T_THESIS_ZH_TITLE" class="input-width" placeholder="上传论文后可自动回显" :disabled="editThesis"></el-input>
              </el-form-item>

              <el-form-item label="英文题目">
                <el-input v-model="thesis.T_THESIS_EN_TITLE" class="input-width" :disabled="editThesis"></el-input>
              </el-form-item>

              <el-row>
                <el-col :span="12">
                  <el-form-item label="学院名称">
                    <el-select v-model="thesis.T_COLLEGE_NAME" clearable placeholder="请选择学院信息" @change="handlerCollegeChange()" :disabled="editThesis" style="width: 265px">
<!--                      <el-option-->
<!--                        v-for="item in collegeList"-->
<!--                        :key="item.T_COLLEGE_ID"-->
<!--                        :label="item.T_COLLEGE_NAME"-->
<!--                        :value="item.T_COLLEGE_ID">-->
<!--                      </el-option>-->
                    </el-select>
                  </el-form-item>
                </el-col>

                <el-col :span="12">
                  <el-form-item label="专业名称">
                    <el-select v-model="thesis.T_MAJOR_NAME" clearable placeholder="请选择专业信息" :disabled="editThesis" style="width: 265px">
<!--                      <el-option-->
<!--                        v-for="item in majorList"-->
<!--                        :key="item.T_MAJOR_ID"-->
<!--                        :label="item.T_MAJOR_NAME"-->
<!--                        :value="item.T_MAJOR_ID">-->
<!--                      </el-option>-->
                    </el-select>
                  </el-form-item>
                </el-col>
              </el-row>

              <el-row>
                <el-col :span="12">
                  <el-form-item label="学科">
<!--                    <el-input v-model="thesis.T_SUBJECT_NAME" :disabled="editThesis"></el-input>-->
                    <el-select v-model="thesis.T_SUBJECT_NAME" clearable placeholder="请选择学科" :disabled="editThesis" style="width: 265px">
<!--                      <el-option>-->

<!--                      </el-option>-->
                    </el-select>
                  </el-form-item>
                </el-col>

                <el-col :span="12">
                  <el-form-item label="保密程度">
                    <el-select v-model="thesis.T_SECRECY_LEVEL" clearable placeholder="请选择保密程度" :disabled="editThesis" style="width: 265px">
                      <el-option
                        v-for="item in secrecyLevel"
                        :key="item.id"
                        :label="item.value"
                        :value="item.id">
                      </el-option>
                    </el-select>
                  </el-form-item>
                </el-col>
              </el-row>

              <el-row>
                <el-col :span="12">
                  <el-form-item label="答辩日期">
                    <el-col :span="11">
                      <el-date-picker type="date" placeholder="选择日期" v-model="thesis.T_THESIS_DEFENCE_TIME" :disabled="editThesis" style="width: 265px"/>
                    </el-col>
                  </el-form-item>
                </el-col>

                <el-col :span="12">
                  <el-form-item label="学位年度">
                    <el-date-picker
                      v-model="thesis.T_THESIS_FIN_TIME"
                      type="year"
                      value-format="yyyy"
                      placeholder="选择年"
                      :disabled="editThesis"
                      style="width: 265px">
                    </el-date-picker>
                  </el-form-item>
                </el-col>
              </el-row>

              <el-form-item label="研究方向">
                <el-input v-model="thesis.T_RESEARCH_DIRE" class="input-width" placeholder="上传论文后可自动回显" :disabled="editThesis"></el-input>
              </el-form-item>

              <el-form-item label="关键词">
                <el-input v-model="thesis.T_THESIS_ZH_KEY" class="input-width" placeholder="上传论文后可自动回显" :disabled="editThesis"/>
              </el-form-item>

              <el-form-item label="英文关键词" style="white-space:nowrap">
                <el-input v-model="thesis.T_THESIS_EN_KEY" class="input-width" placeholder="上传论文后可自动回显" :disabled="editThesis"/>
              </el-form-item>
            </el-form>
          </div>

<!--           消息提示 -->
          <div class="right-box">
            <div class="firstLine">
              <img src="../../../assets/img/实心正方形.png" alt="">
              <h3 v-html="msg">&nbsp;论文修改意见</h3>
            </div>
<!--            <ul>-->
<!--              <li>1.论文题目去掉不确定内容;</li>-->
<!--              <li>2.关键词英文有待商榷;</li>-->
<!--              <li>3.专业名称提交错误;</li>-->
<!--            </ul>-->
          </div>

          <el-form-item label="摘要">
            <br>
            <p class="p-ab" v-html="thesis.T_THESIS_ZH_ABSTRACT"/>
          </el-form-item>

          <el-form-item label="英文摘要">
            <br>
            <p class="p-ab" v-html="thesis.T_THESIS_EN_ABSTRACT"/>
          </el-form-item>

          <el-form-item label="论文总页数">
            <el-input v-model="thesis.T_THESIS_PAGE_NUMBER" :disabled="editThesis"></el-input>
          </el-form-item>

        </el-form>
<!--        <div class="btn">-->
<!--          <el-button type="warning" icon="el-icon-upload" class="upload">论文上传</el-button>-->
<!--          <el-button type="primary" icon="el-icon-position"  class="submit">提交信息</el-button>-->
<!--        </div>-->
      </div>
      <div class="footer">技术支持：同方知网（北京）技术有限公司山东分公司 </div>
      <div class="rdown"></div>
    </div>
  </div>
</template>

<script>
  //引入富文本编译器
  import Tinymce from '@/components/Tinymce/readOnly'
  import { mapGetters } from 'vuex'
  import thesisApi from '@/api/thesis/thesis.js'
  import collegeApi from '@/api/collegeTutor/college.js'
  import majorApi from '@/api/collmajor/major.js'

  export default {
    components: { Tinymce },
    name: "index",
    computed: {
      ...mapGetters([
        'avatar',
        'name',
      ])
    },
    data() {
      return {
        active: 4,
        BASE_API: process.env.BASE_API,
        thesis: {
          T_THESIS_ID: '',
          T_STU_ID: '',
          T_COLLEGE_ID: '',
          T_TUTOR_NAME: '',
          T_MAJOR_ID: '',
          T_RESEARCH_DIRE: '',
          T_THESIS_ZH_TITLE: '',
          T_THESIS_EN_TITLE: '',
          T_THESIS_ZH_KEY: '',
          T_THESIS_EN_KEY: '',
          T_THESIS_ZH_ABSTRACT: '',
          T_THESIS_EN_ABSTRACT: '',
          T_THESIS_FILE: '',
          T_THESIS_URL: '',
          T_THESIS_DEFENCE_TIME: '',  //论文答辩日期
          T_THESIS_PAGE_NUMBER: '',
          T_THESIS_FIN_TIME: ''
        },
        page: 1,
        major: {},
        collegeList: {},
        majorList: {},
        editThesis: true,
        msg: '',
        secrecyLevel: [
          {
            id: 0,
            value: '公开'
          },
          {
            id: 1,
            value: '内部'
          },
          {
            id: 2,
            value: '秘密'
          }
        ]
      }
    },

    created() {
      //获取学院信息
      // this.getCollegeInfo()
      //获取登录用户的论文信息
      this.getThesisInfoByStuId()
    },

    methods: {


      getCollegeInfo() {
        collegeApi.getAllCollegeInfo()
          .then(result => {
            this.collegeList = result.OUT_DATA.data
          })
      },

      //选择学院之后初始化专业信息
      handlerCollegeChange() {
        this.majorList = {}
        this.major.T_COLLEGE_ID = this.thesis.T_COLLEGE_ID
        majorApi.getMajorInfoByCond(this.major)
          .then(result => {
            this.majorList = result.OUT_DATA.data
          })
      },

      getThesisInfoByStuId(page = 1) {
        this.thesis.T_STU_ID = this.$store.state.user.id
        this.page = page
        thesisApi.getThesisListByCond(this.page, this.thesis)
          .then(result => {
            const data = result.OUT_DATA.data.data
            this.thesis = data[0]
            // this.handlerCollegeChange()
            // this.thesis.T_MAJOR_ID = data[0].T_MAJOR_ID
            //编目完成
            if (4 == this.thesis.T_THESIS_STATUS) {
              this.$notify({
                title: '归档通知',
                message: '您的论文已完成编目',
                type: 'success'
              });
              this.msg = '您的论文已完成编目'
            }else {
              this.$notify({
                title: '归档通知',
                message: '您的论文正在编目中......',
                type: 'info'
              });
              this.msg = '您的论文正在编目中......'
            }
          })
      },

      openSubmit() {
        this.$router.push({path : '/thesis/submit'})
      },

      openSysHome() {
        let routeData = this.$router.resolve({ path: '/home'});
        window.open(routeData.href, '_blank');
      },

      openPersonalHome() {
        this.$router.push({path: '/'})
      },

      openPersonCenter() {
        this.$router.push({path: '/userInfo/student'})
      },

      loginOut() {
        const loading = this.$loading({
          lock: true,
          text: '用户退出中......',
          spinner: 'el-icon-loading',
          background: 'rgba(0, 0, 0, 0.7)'
        });
        this.$store.dispatch('LogOut').then(() => {
          loading.close();
          location.reload() // 为了重新实例化vue-router对象 避免bug
        })
      },

    }
  }
</script>

<style scoped>
  .p-ab {
    text-indent: 2em
  }

  /* 整体样式 */
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

  .head ul{
    float: right;
    list-style: none;
    margin-right: 100px;
    line-height: 60px;
  }
  .head ul li{
    float: left;
    margin: 0 18px;
  }
  .head ul li a{
    color: #5c63f0;
    font-size: 22px;
    font-family: 'Nunito', sans-serif;
  }
  .shouye {
    border-bottom: 2px solid #5c63f0;
  }
  .userinfo {
    margin-right: 10px;
    float: right;
    width: 220px;
    height: 60px;
    line-height: 60px;
    text-align: center;
    font-size: 18px;
  }
  .userinfo a {
    color:#5c63f0;;
  }
  .layout {
    margin-left: 20px;
  }

  .layui-nav-img {
    width: 40px;
    height: 40px;
    border-radius: 50%;
    margin-right: 10px;
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

  /* 主题区域 */
  .steps {
    padding-top: 80px;
  }

  .left-box {
    width: 690px;
    margin-left: 60px;
    margin-top: 30px;
    display: inline-block;
  }


  .el-form-item{
    margin-bottom: 30px;
  }

  .el-button {
    width: 170px;
    margin-left: 60px;
  }

  .btn {
    margin-top: 30px;
    height: 50px;
    position: relative;
  }

  .upload {
    height: 40px;
    text-align: center;
    font-size: 18px;
    margin-left: 500px;
  }

  .submit {
    height: 50px;
    font-size: 20px;
    position: absolute;
    right: 0;
  }

  .right-box {
    width: 300px;
    height: 500px;
    margin-top: 110px;
    margin-right: 50px;
    float: right;
  }

  .right-box .firstLine {
    height: 50px;
    line-height: 50px;
    border-bottom: 1px solid #848484;
  }

  .right-box img {
    /* padding-top: 30px; */
    margin-left: 10px;
  }

  .right-box h3 {
    color: #848484;
    display: inline-block;
  }

  .right-box ul {
    padding-top: 30px;
    padding-left: 10px;
  }
  .right-box ul li {
    padding-bottom: 15px;
    color:#a8a8a8;
  }
</style>
