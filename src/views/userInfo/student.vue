<template>
  <!-- 头部区域 -->
  <div class="app-container">
    <div class="content">
      <div class="main clearfix">
        <!-- 头部区域 -->
        <div class="head">
          <div class="logo"></div>
          <div href="javascript:;" class="userinfo">
            <img :src="this.BASE_API + /avatar/ + avatar"  class="layui-nav-img">
            <a @click="reload">你好&nbsp;<span>{{name}}</span></a>
            <a @click="loginOut" class="layout">退出</a>
          </div>
          <ul>
            <li><a @click="openSysHome()">系统首页</a></li>
            <li><a @click="openPersonalHome()" class="shouye">个人首页</a></li>
            <li><a @click="openSubmit()">论文提交</a></li>
          </ul>

        </div>
        <div class="BT"></div>
        <div class="left-box">
          <el-form
            label-width="80px"
            label-position="right"
          >
            <el-row>
              <el-col :span="12">
                <el-form-item label="学号">
                  <el-input v-model="student.T_STU_ID" clearable disabled></el-input>
                </el-form-item>
              </el-col>

              <el-col :span="12">
                <el-form-item label="姓名">
                  <el-input v-model="student.T_STU_NAME" clearable disabled></el-input>
                </el-form-item>
              </el-col>
            </el-row>

            <el-row>
              <el-col :span="12">
                <el-form-item label="密码">
                  <el-input :type="pwdType" v-model="student.T_STU_PSWD" clearable :change="checkPwd()" :suffix-icon="iconAgainPwd"></el-input>
                </el-form-item>
              </el-col>

              <el-col :span="12">
                <el-form-item label="确认密码">
                  <el-tooltip class="item" effect="light" :content="contentAgainPwd" placement="top" :popper-class="tooltipPwd">
                    <el-input
                      :type="pwdType"
                      v-model="T_AGAIN_PWD"
                      clearable
                      :change="checkPwd()"
                      :suffix-icon="iconAgainPwd">
                    </el-input>
                  </el-tooltip>
                </el-form-item>
              </el-col>
            </el-row>

            <el-form-item label="手机号码">
              <el-input v-model="student.T_STU_MOBILE" clearable class="input-width"></el-input>
            </el-form-item>

            <el-form-item label="邮箱">
              <el-input v-model="student.T_STU_EAMIL" clearable class="input-width"></el-input>
            </el-form-item>

            <el-row>
              <el-col :span="12">
                <el-form-item label="归属学院">
                  <el-select v-model="student.T_COLLEGE_ID" clearable placeholder="请选择学院名称" @change="handlerCollegeChange()">
                    <el-option
                      v-for="item in collegelist"
                      :key="item.T_COLLEGE_ID"
                      :label="item.T_COLLEGE_NAME"
                      :value="item.T_COLLEGE_ID">
                    </el-option>
                  </el-select>
                </el-form-item>
              </el-col>

              <el-col :span="12">
                <el-form-item label="归属专业">
                  <el-select v-model="student.T_MAJOR_ID" clearable placeholder="请选择专业名称">
                    <el-option
                      v-for="item in majorlist"
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
                <el-form-item label="入学年份">
                  <el-date-picker v-model="student.T_EN_YEAR" type="year" placeholder="入学年份" value-format="yyyy">
                  </el-date-picker>
                </el-form-item>
              </el-col>

              <el-col :span="12">
                <el-form-item label="毕业年份">
                  <el-date-picker v-model="student.T_GRA_YEAR" type="year" placeholder="毕业年份" value-format="yyyy">
                  </el-date-picker>
                </el-form-item>
              </el-col>
            </el-row>

            <el-form-item label="培养层级">
              <el-radio-group v-model="student.T_STU_TYPE_ID">
                <el-radio :label="item.T_STU_TYPE_ID" :key="item.T_STU_TYPE_ID" v-for="item in levellist" @change="handlerStuTypeId">
                  {{item.T_STU_TYPE_ZH_NAME}}
                </el-radio>
              </el-radio-group>
            </el-form-item>

            <el-form-item label="学位类别">
              <el-select v-model="student.T_STU_DEGREE_ID" clearable placeholder="请选择学位类别">
                <el-option
                  v-for="item in degreeList"
                  :key="item.T_STU_DEGREE_ID"
                  :label="item.T_STU_DEGREE_ZH_NAME"
                  :value="item.T_STU_DEGREE_ID">
                </el-option>
              </el-select>
            </el-form-item>



          </el-form>

        </div>
        <div class="right-box">
          <el-form>
            <!--用户头像-->
            <el-form-item label="用户头像">
              <!-- 头像缩略图 -->
              <pan-thumb :image="avatarT"/>
              <el-upload
                :headers="headers"
                :action="BASE_API+'/sys/uploadAvatar'"
                :before-remove="beforeRemove"
                :limit="1"
                :on-success="uploadSuccess"
              >
                <el-button type="warning" icon="el-icon-plus" class="upload">&nbsp;上传头像</el-button>
              </el-upload>
            </el-form-item>

            <el-col :span="24">
              <el-form-item>
                <el-button type="primary" @click="updateStudentInfo" icon="el-icon-position" class="submit">&nbsp;提交信息</el-button>
              </el-form-item>
            </el-col>
          </el-form>
        </div>
      </div>
    </div>
    <div class="footer">技术支持：同方知网（北京）技术有限公司山东分公司 </div>
    <div class="rdown"></div>
  </div>
</template>

<script>

  import studentApi from '@/api/custome/student.js'
  import collegeApi from '@/api/collegeTutor/college.js'
  import majorApi from '@/api/collmajor/major.js'
  import stuDegreeApi from '@/api/stuDegree/stuDegree'
  import { getToken } from '@/utils/auth'
  import ImageCropper from '@/components/ImageCropper'
  import PanThumb from '@/components/PanThumb'
  import { mapGetters } from 'vuex'

  export default {
    components: { ImageCropper, PanThumb },
    computed: {
      ...mapGetters([
        'avatar',
        'name',
      ])
    },
    data() {
      return {
        student: {},
        pwdType: 'password',
        T_AGAIN_PWD: '',
        levellist: {},
        BASE_API: process.env.BASE_API,
        headers: {token: getToken()},
        avatarT: '',
        degreeList: {},
        stuDegree: {},
        majorlist: {},
        major: {},
        collegelist: {},
        page: 1,
        contentAgainPwd: '密码不一致',
        tooltipPwd: 'tooltip-false-pwd',
        iconAgainPwd: 'iconfont icon-true',

      }
    },

    mounted() {
      this.initStudentInfo()
      //初始化学院信息
      this.getCollegeInfo()
      //初始化培养层级信息
      this.getStuTypeInfo()
    },

    methods: {
      initStudentInfo() {
        studentApi.getStudentById(this.$store.state.user.id)
          .then(result => {
            const data = result.OUT_DATA.data
            this.student = data
            this.T_AGAIN_PWD = this.student.T_STU_PSWD
            this.avatarT = this.BASE_API + '/avatar/' + data.T_AVATAR
            this.handlerCollegeChange()
            this.handlerStuTypeId()
          })
      },

      //初始化学院信息
      getCollegeInfo() {
        collegeApi.getAllCollegeInfo()
          .then(result => {
            this.collegelist = result.OUT_DATA.data
          })
      },

      //初始化培养层级信息
      getStuTypeInfo() {
        studentApi.getStuTypeInfo()
          .then(result => {
            this.levellist = result.OUT_DATA.data
          })
      },

      //填充学位级别信息
      handlerStuTypeId() {
        this.page = 1
        this.stuDegree.T_STU_TYPE_ID = this.student.T_STU_TYPE_ID
        stuDegreeApi.getStuDegreeByCond(this.page, this.stuDegree)
          .then(result => {
            const data = result.OUT_DATA.data
            if (data == null) {
              this.degreeList = null
              this.student.T_STU_DEGREE_ID = ''
              return
            }
            this.degreeList = data.data
            this.student.T_STU_DEGREE_ID = this.degreeList[0].T_STU_DEGREE_ID
          })
      },

      //选择学院之后，专业选择框发生改变
      handlerCollegeChange() {
        this.major.T_COLLEGE_ID = this.student.T_COLLEGE_ID
        majorApi.getMajorInfoByCond(this.major)
          .then(result => {
            this.majorlist = result.OUT_DATA.data
          })
      },

      beforeRemove(file, fileList){
        return this.$confirm(`确定移除 ${ file.name }？`,'提示',{
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          sys.deletefile(this.student.T_AVATAR)  //删除文件
          .then(result => {
            //删除用户头像存储信息
            this.student.T_AVATAR = ''
            //返回用户头像
            this.avatarT = ''
          })
        });
      },

      uploadSuccess(data) {
        this.student.T_AVATAR = data.OUT_DATA.data
        //显示头像信息
        this.avatarT = this.BASE_API + '/avatar/' + data.OUT_DATA.data
      },

      checkPwd() {
        if (this.T_AGAIN_PWD != this.student.T_STU_PSWD) {
          this.iconAgainPwd = 'iconfont icon-false'
          this.tooltipPwd = 'tooltip-false-pwd'
          this.contentAgainPwd = '密码不一致'
        }else {
          this.iconAgainPwd = 'iconfont icon-true'
          this.tooltipPwd = 'tooltip-true-pwd'
          this.contentAgainPwd = '密码一致'
        }
      },

      updateStudentInfo() {
        //密码校验
        if (this.T_AGAIN_PWD != this.student.T_STU_PSWD) {
          this.$message({
            type: "error",
            message: "密码不一致,请确认"
          })
          return
        }
        studentApi.updatePerson(this.student)
          .then(result => {
            this.$message({
              type: "success",
              message: "修改成功"
            })
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

      reload() {
        location.reload()
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

  .main{
    width: 1200px;
    margin: 0 auto;
    /* overflow: hidden; */
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
  .BT{
    width: 400px;
    height: 50px;
    margin-left: 250px;
    margin-top: 50px;
    background: url("../../assets/img/PersonalCenter.png") no-repeat 0;
  }

  .shouye {
    border-bottom: 2px solid #5c63f0;
  }
  .userinfo {
    margin-right: 10px;
    float: right;
    width: 200px;
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
    margin-top: 55px;
  }

  /* 主体部分 */
  .left-box {
    width: 690px;
    margin-left: 60px;
    margin-top: 110px;
    display: inline-block;
  }
  .right-box {
    width: 260px;
    margin-top: 110px;
    margin-right: 50px;
    float: right;

  }

  .el-form-item{
    margin-bottom: 30px;
  }

  .pan-item {
    margin-top: 100px;
  }

  .el-button {
    width: 170px;
    margin-left: 60px;
  }

  .upload {
    height: 45px;
    margin-top: 30px;
    font-size: 20px;
  }

  .submit {
    height: 78px;
    margin-top: 80px;
    font-size: 20px;
  }

</style>
