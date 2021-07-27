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

          <el-form-item>
            <el-upload
              :headers="headers"
              :before-remove="beforeRemove"
              ref="thesis-upload"
              :on-remove="onRemove"
              :limit="1"
              :on-success="uploadSuccess"
              :action="BASE_API+'/thesis/uploadThesis'">
              <div class="submit">
                <el-button icon="el-icon-upload" type="success" round>论文上传</el-button>
                <div class="el-upload__tip">论文格式为[学号+姓名+学院名称+论文名称],且格式为PDF格式</div>
              </div>
            </el-upload>
          </el-form-item>

          <el-row>
            <el-col :span="10">
              <el-form-item label="学号" :label-width="formWidth">
                <el-input v-model="thesis.T_STU_ID" clearable class="input-width" placeholder="上传论文后可自动回显" @input="change($event)"/>
              </el-form-item>
            </el-col>

            <el-col :span="10">
              <el-form-item label="导师" :label-width="formWidth">
                <el-input v-model="thesis.T_TUTOR_NAME" class="input-width" placeholder="请使用;号分隔" @input="change($event)"/>
              </el-form-item>
            </el-col>
          </el-row>

          <el-row>
            <el-col :span="10">
              <el-form-item label="学院名称" :label-width="formWidth">
                <el-select v-model="thesis.T_COLLEGE_ID" clearable placeholder="请选择学院信息" @change="handlerCollegeChange()" style="width: 287px">
                  <el-option
                    v-for="item in collegeList"
                    :key="item.T_COLLEGE_ID"
                    :label="item.T_COLLEGE_NAME"
                    :value="item.T_COLLEGE_ID">
                  </el-option>
                </el-select>
              </el-form-item>
            </el-col>

            <el-col :span="10">

              <el-form-item label="专业名称" :label-width="formWidth">
                <el-select v-model="thesis.T_MAJOR_ID" clearable placeholder="请选择专业信息" @change="handleMajorChange" style="width: 287px">
                  <el-option
                    v-for="item in majorList"
                    :key="item.T_MAJOR_ID"
                    :label="item.T_MAJOR_NAME"
                    :value="item.T_MAJOR_ID">
                  </el-option>
                </el-select>
              </el-form-item>
            </el-col>
          </el-row>

          <el-row>
            <el-col :span="10">
              <el-form-item label="答辩日期" :label-width="formWidth">
                <el-col :span="11">
                  <el-date-picker type="date" placeholder="选择日期" v-model="thesis.T_THESIS_DEFENCE_TIME" @input="change($event)" style="width: 287px"/>
                </el-col>
              </el-form-item>
            </el-col>

            <el-col :span="10">

              <el-form-item label="学位年度" :label-width="formWidth">
                <el-date-picker
                  v-model="thesis.T_THESIS_FIN_TIME"
                  type="year"
                  value-format="yyyy"
                  placeholder="选择年"
                  @input="change($event)"
                  style="width: 287px">
                </el-date-picker>
              </el-form-item>
            </el-col>
          </el-row>

          <el-row>
            <el-col :span="10">
              <el-form-item label="分类号" :label-width="formWidth">
                <el-input v-model="thesis.T_CH_LIB_CLASS" class="input-width" placeholder="上传论文后可自动回显" @input="change($event)" style="width: 287px"/>
              </el-form-item>
            </el-col>

            <el-col :span="4">
              <el-form-item label="论文页数" :label-width="formWidth">
                <el-input v-model="thesis.T_THESIS_PAGE_NUMBER" @input="change($event)" placeholder="上传论文后可自动回显" style="width: 287px"/>
              </el-form-item>
            </el-col>
          </el-row>

          <el-row>
            <el-col :span="10">
              <el-form-item label="学科" :label-width="formWidth">
                <el-select v-model="thesis.T_SUBJECT_CODE" clearable placeholder="请选择学科信息" @input="change($event)" style="width: 287px">
                  <el-option
                    v-for="item in subjectList"
                    :key="item.T_SUBJECT_CODE"
                    :label="item.T_SUBJECT_NAME"
                    :value="item.T_SUBJECT_CODE">
                  </el-option>
                </el-select>
              </el-form-item>
            </el-col>

            <el-col :span="10">
              <el-form-item label="保密程度" :label-width="formWidth">
                <el-select v-model="thesis.T_SECRECY_LEVEL" clearable placeholder="请选择保密程度" @input="change($event)" style="width: 287px">
                  <el-option
                    v-for="item in secrecyLevel"
                    :key="item.id"
                    :label="item.value"
                    :value="item.id"
                  >
                  </el-option>
                </el-select>
              </el-form-item>
            </el-col>
          </el-row>

          <el-form-item label="研究方向" :label-width="formWidth">
            <el-input v-model="thesis.T_RESEARCH_DIRE" class="input-width" placeholder="上传论文后可自动回显" @input="change($event)"/>
          </el-form-item>

          <el-form-item label="论文题目" :label-width="formWidth">
            <el-input v-model="thesis.T_THESIS_ZH_TITLE" class="input-width" placeholder="上传论文后可自动回显" @input="change($event)"/>
          </el-form-item>

          <el-form-item label="英文题目" :label-width="formWidth">
            <el-input v-model="thesis.T_THESIS_EN_TITLE" class="input-width" placeholder="上传论文后可自动回显" @input="change($event)"/>
          </el-form-item>

          <el-form-item label="关键词" :label-width="formWidth">
            <el-input v-model="thesis.T_THESIS_ZH_KEY" class="input-width" placeholder="上传论文后可自动回显" @input="change($event)"/>
          </el-form-item>

          <el-form-item label="英文关键词" :label-width="formWidth">
            <el-input v-model="thesis.T_THESIS_EN_KEY" class="input-width" placeholder="上传论文后可自动回显" @input="change($event)"/>
          </el-form-item>

          <el-form-item label="摘要(上传论文后可自动回显)"/>
          <el-form-item label="摘要">
            <tinymce :height="200" v-model="thesis.T_THESIS_ZH_ABSTRACT"/>
          </el-form-item>

          <el-form-item label="英文摘要(上传论文后可自动回显)"/>
          <el-form-item label="英文摘要">
            <tinymce :height="200" v-model="thesis.T_THESIS_EN_ABSTRACT"/>
          </el-form-item>

          <el-form-item>
            <el-button type="success" @click="submitThesisInfo()" round class="success">提交</el-button>
          </el-form-item>
        </el-form>
      </div>
      <div class="footer">技术支持：同方知网（北京）技术有限公司山东分公司 </div>
      <div class="rdown"></div>
    </div>
  </div>
</template>

<script>

  import thesisApi from '@/api/thesis/thesis.js'
  import collegeApi from '@/api/collegeTutor/college.js'
  import majorApi from '@/api/collmajor/major.js'
  import studentApi from '@/api/custome/student.js'
  import { getToken } from '@/utils/auth'
  import subjectApi from '@/api/subject/subject'
  //引入富文本编译器
  import Tinymce from '@/components/Tinymce'
  import { mapGetters } from 'vuex'

  export default {
    components: {Tinymce},
    inject: ['reload'],
    computed: {
      ...mapGetters([
        'avatar',
        'name',
      ])
    },
    data() {
      return {
        thesis: {
          T_STU_ID: '',
          T_COLLEGE_ID: '',
          T_TUTOR_NAME: '',
          T_MAJOR_ID: '',
          T_CH_LIB_CLASS: '',
          T_RESEARCH_DIRE: '',
          T_SUBJECT_CODE: '',
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
          T_THESIS_FIN_TIME: '',
          T_SECRECY_LEVEL: ''
        },
        active: 1,
        major: {},
        collegeList: {},
        majorList: {},
        subjectList: {},
        headers: {token: getToken()},
        BASE_API: process.env.BASE_API,
        formWidth: '90px',
        level: 0,  //学科等级
        options: [],  //学科信息
        subject: {},
        subjectCode: '',
        subjectValue: '请选择学科',
        secercyValue: '',
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
    created() {},

    mounted() {
      //初始化获取学科信息
      this.getSubjectInfo()
      //获取学院信息
      this.getCollegeInfo()
      // this.getStuTypeInfo()
      //判断登录用户是否提交论文，论文所处状态
      this.getThesisStatusInfo()
    },

    methods: {

      change() {
        this.$forceUpdate()
      },

      handleMajorChange() {
        this.$forceUpdate()
      },

      newPay() {  //刷新局部组件
        this.reload()
      },

      getCollegeInfo() {
        collegeApi.getAllCollegeInfo()
          .then(result => {
            this.collegeList = result.OUT_DATA.data
          })
      },

      getSubjectInfo() {
        subjectApi.getSubjectByLevel(this.level)
          .then(result => {
            const data = result.OUT_DATA.data
            this.subjectList = data
          })
      },

      getThesisStatusInfo() {
        thesisApi.getThesisStatus()
          .then(result => {
            const data = result.OUT_DATA.data
            if (3 == data || 4 == data) {
              this.$router.push({path: '/thesis/catalogue'})
            }else if (data == null){
              return
            }else {
              this.$router.push({path: '/thesis/approved'})
            }
          })
      },

      //选择学院之后初始化专业信息
      handlerCollegeChange() {
        this.majorList = {}
        this.major.T_COLLEGE_ID = this.thesis.T_COLLEGE_ID
        majorApi.getMajorInfoByCond(this.major)
          .then(result => {
            this.thesis.T_MAJOR_ID = ''
            this.majorList = result.OUT_DATA.data
          })
      },

      beforeRemove(file, fileList) {
        return this.$confirm(`确定移除 ${ file.name }？`);
      },

      //删除上传的论文
      onRemove(file, fileList){
        thesisApi.removeThesisFile(this.thesis.T_THESIS_URL)
          .then(response => {
            this.newPay()
          })
      },

      clearFiles() {
        this.$refs['thesis-upload'].clearFiles();
      },

      uploadSuccess(response) {
        const code = response.RETURN_CODE
        if (code !== 10000) {
          this.$message({
            type: "error",
            message: response.RETURN_MSG,
            duration: 5 * 1000
          })
          //清空文件
          this.clearFiles()
          //删除服务器文件
          this.thesis.T_THESIS_URL = response.OUT_DATA.data.thesisUrl
          this.onRemove()
        }else {
          const loading = this.$loading({
            lock: true,
            text: 'Loading',
            spinner: 'el-icon-loading',
            background: 'rgba(0, 0, 0, 0.7)'
          });

          this.$message({
            type: "success",
            message: "添加成功"
          })
          //回显文件中的关键词、摘要等信息
          this.thesis = {}
          const data = response.OUT_DATA.data
          this.thesis.T_STU_ID = data.stuId
          this.thesis.T_COLLEGE_ID = data.collegeId
          if (this.thesis.T_COLLEGE_ID != null || this.thesis.T_COLLEGE_ID == '') {
            this.handlerCollegeChange()
          }
          this.thesis.T_RESEARCH_DIRE = data.researchDir;
          this.thesis.T_THESIS_EN_KEY = data.enKeyWords;
          this.thesis.T_THESIS_ZH_KEY = data.zhKeyWords
          this.thesis.T_THESIS_ZH_ABSTRACT = data.zhAbstract
          this.thesis.T_THESIS_EN_ABSTRACT = data.enAbstract
          this.thesis.T_THESIS_ZH_TITLE = data.zhTitle
          this.thesis.T_THESIS_EN_TITLE = data.enTitle
          this.thesis.T_TUTOR_NAME = data.tutorName
          this.thesis.T_THESIS_FIN_TIME = data.thesisYear
          this.thesis.T_THESIS_DEFENCE_TIME = data.thesisDate
          this.thesis.T_CH_LIB_CLASS = data.chLib
          this.secercyValue = data.secrecy
          if ('公开' == data.secrecy) {
            this.thesis.T_SECRECY_LEVEL = 0
          }else if ('内部' == data.secrecy) {
            this.thesis.T_SECRECY_LEVEL = 1
          }else if ('秘密' == data.secrecy) {
            this.thesis.T_SECRECY_LEVEL = 2
          }
          this.subjectValue = data.subjectName
          if (data.subjectCode != null && data.subjectCode != '') {
            this.thesis.T_SUBJECT_CODE = data.subjectCode
          }
          this.thesis.T_THESIS_PAGE_NUMBER = data.page
          this.thesis.T_THESIS_FILE = data.filename;
          this.thesis.T_THESIS_URL = data.thesisUrl
          loading.close();
        }
      },

      submitThesisInfo() {
        console.log(this.thesis)
        thesisApi.submitThesis(this.thesis)
          .then(result => {
            this.$message({
              type: "success",
              message: "提交成功"
            })
            //跳转页面
            this.$router.push({path: '/thesis/approved'})
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
  .tinymce-container {
    line-height: 29px;
  }
  .input-width {
    width: 70%;
  }
  .tinymce-container {
    line-height: 29px;
  }

  .submit {
    margin-top: 50px;
    margin-left: 50px;
  }
  .el-upload__tip {
    float: right;
    margin-left: 30px;
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

  /* 主体区域 */
  .steps {
    padding-top: 80px;
  }

  .el-form-item{
    margin-bottom: 30px;
  }

  .submit{
    margin-left: 100px;
  }

  .success {
    float: right;
    margin-right: 50px;
  }
</style>
