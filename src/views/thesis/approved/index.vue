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

              <el-form-item v-show="!editThesis">
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
                    <el-select v-model="thesis.T_COLLEGE_ID" clearable placeholder="请选择学院信息" @change="handlerCollegeChange()" :disabled="editThesis" style="width: 265px">
                      <el-option
                        v-for="item in collegeList"
                        :key="item.T_COLLEGE_ID"
                        :label="item.T_COLLEGE_NAME"
                        :value="item.T_COLLEGE_ID">
                      </el-option>
                    </el-select>
                  </el-form-item>
                </el-col>

                <el-col :span="12">
                  <el-form-item label="专业名称">
                    <el-select v-model="thesis.T_MAJOR_ID" clearable placeholder="请选择专业信息" :disabled="editThesis" style="width: 265px">
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
                <el-col :span="12">
                  <el-form-item label="学科">
                    <el-select v-model="thesis.T_SUBJECT_NAME" clearable placeholder="请选择学科" :disabled="editThesis" style="width: 265px">
                      <el-option
                        v-for="item in subjectList"
                        :key="item.T_SUBJECT_CODE"
                        :label="item.T_SUBJECT_NAME"
                        :value="item.T_SUBJECT_CODE">
                      </el-option>
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

          <!-- 导师消息反馈 -->
          <div class="right-box">
            <div class="firstLine">
              <img src="../../../assets/img/实心正方形.png" alt="">
              <h3 v-html="statusMsg">&nbsp;论文修改意见</h3>
            </div>
<!--            <ul>-->
<!--              <li>1.论文题目去掉不确定内容;</li>-->
<!--              <li>2.关键词英文有待商榷;</li>-->
<!--              <li>3.专业名称提交错误;</li>-->
<!--            </ul>-->
            <p v-html="msg"></p>
          </div>

          <el-form-item label="摘要" v-show="editThesis">
            <br>
            <p class="p-ab" v-html="thesis.T_THESIS_ZH_ABSTRACT"/>
          </el-form-item>

          <el-form-item label="英文摘要" v-show="editThesis">
            <br>
            <p class="p-ab" v-html="thesis.T_THESIS_EN_ABSTRACT"/>
          </el-form-item>

          <el-form-item label="摘要" v-show="!editThesis"/>
          <el-form-item label="摘要" v-show="!editThesis">
            <tinymce :height="200" v-model="thesis.T_THESIS_ZH_ABSTRACT"/>
          </el-form-item>

          <el-form-item label="英文摘要" v-show="!editThesis"/>
          <el-form-item label="英文摘要" v-show="!editThesis">
            <tinymce :height="200" v-model="thesis.T_THESIS_EN_ABSTRACT"/>
          </el-form-item>

          <el-form-item label="论文总页数">
            <el-input v-model="thesis.T_THESIS_PAGE_NUMBER" :disabled="editThesis"></el-input>
          </el-form-item>

          <el-form-item>
            <el-button type="success" @click="updateThesisInfo()" round class="success" v-show="!editThesis">提交</el-button>
          </el-form-item>

        </el-form>

      </div>
      <div class="footer">技术支持：同方知网（北京）技术有限公司山东分公司 </div>
      <div class="rdown"></div>
    </div>

  </div>

</template>

<script>
  //引入富文本编译器
  import Tinymce from '@/components/Tinymce'
  import { mapGetters } from 'vuex'
  import thesisApi from '@/api/thesis/thesis.js'
  import collegeApi from '@/api/collegeTutor/college.js'
  import majorApi from '@/api/collmajor/major.js'
  import { getToken } from '@/utils/auth'
  import subjectApi from '@/api/subject/subject'

    export default {
      components: { Tinymce },
      name: "approved",
      computed: {
        ...mapGetters([
          'avatar',
          'name',
        ])
      },
      inject: ['reload'],
      data() {
          return {
            active: 2,
            thesis: {
              T_THESIS_ID: '',
              T_STU_ID: '',
              T_COLLEGE_ID: '',
              T_TUTOR_NAME: '',
              T_MAJOR_ID: '',
              T_SUBJECT_CODE: '',
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
            iconButton: 'el-icon-caret-bottom',
            page: 1,
            major: {},
            collegeList: {},
            majorList: {},
            subjectList: {},
            editThesis: true,
            zhTiny: 1,
            enTiny: 1,
            headers: {token: getToken()},
            BASE_API: process.env.BASE_API,
            updateThesis: {
              T_STU_ID: ''
            },
            level: 1,  //学科等级
            subject: {},
            statusMsg: '',
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
        this.getCollegeInfo()

      },

      mounted() {
        //初始化获取学科信息
        this.getSubjectInfo()
        //获取登录用户的论文信息
        this.getThesisInfoByStuId()
        //判断登录用户是否提交论文，论文所处状态
        this.getThesisStatusInfo()
      },

      methods: {

        getSubjectInfo() {
          subjectApi.getSubjectByLevel(this.level)
            .then(result => {
              const data = result.OUT_DATA.data
              this.subjectList = data
            })
        },

        newPay() {  //刷新局部组件
          this.reload()
        },

        //删除上传的论文
        beforeRemove(file, fileList){
          return this.$confirm(`确定移除 ${ file.name }？`,'提示',{
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            type: 'warning'
          });
        },

        clearFiles() {
          this.$refs['thesis-upload'].clearFiles();
        },

        //删除上传的论文
        onRemove(file, fileList){
          thesisApi.removeThesisFile(this.thesis.T_THESIS_URL)
            .then(response => {
              this.zhTiny++
              this.enTiny++
            })
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
            // this.thesis = {}
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

        getThesisStatusInfo() {
          thesisApi.getThesisStatus()
            .then(result => {
              const data = result.OUT_DATA.data
              if (2 === data || 7 == data) {  //审核不通过，给予修改权限
                //跳转页面
                this.editThesis = false
                if (7 == data) {
                  this.active = 3
                }
              }else if (0 == data || 1 == data){
                this.active = 2
              }else if (3 == data || 4 == data) {
                this.$router.push({path: '/thesis/catalogue'})
              }else {
                this.active = 3
              }
            })
        },

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
            this.handlerCollegeChange()
            this.thesis.T_MAJOR_ID = data[0].T_MAJOR_ID
            //查询审核原因
            if (2 == this.thesis.T_THESIS_STATUS || 7 == this.thesis.T_THESIS_STATUS) {
              thesisApi.getNotPassThesisAppr(this.thesis.T_THESIS_ID)
                .then(result1 => {
                  const data = result1.OUT_DATA.data
                  //弹出通知框
                  this.$notify({
                    title: '审核通知',
                    message: '您的论文未通过审核；原因：' + data.T_THESIS_APPR_REASON ,
                    type: 'warning'
                  });
                  this.statusMsg = '论文审核未通过'
                  this.msg = data.T_THESIS_APPR_REASON
                })
            }else if (0 == this.thesis.T_THESIS_STATUS || 5 == this.thesis.T_THESIS_STATUS) {
              this.$notify({
                title: '审核通知',
                message: '您的论文正在审核中......',
                type: 'info'
              });
              this.statusMsg = '您的论文正在审核中......'
              this.msg = ''
            } else {
              this.$notify({
                title: '审核通知',
                message: '恭喜您的论文通过审核' ,
                type: 'success'
              });
              this.statusMsg = '论文审核通过'
              this.msg = ''
            }
          })
        },

        updateThesisInfo() {
          thesisApi.updateThesis(this.thesis)
          .then(result => {
            this.$message({
              type: "success",
              message: "修改成功"
            })
            this.newPay()
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

  .left-box {
    width: 690px;
    margin-left: 60px;
    margin-top: 30px;
    display: inline-block;
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
