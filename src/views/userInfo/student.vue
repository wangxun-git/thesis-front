<template>
  <div class="app-container">
    <el-form>
      <el-form-item label="学生学号">
        <el-input v-model="student.T_STU_ID" clearable></el-input>
      </el-form-item>

      <el-form-item label="学生姓名">
        <el-input v-model="student.T_STU_NAME" clearable class="input-width"></el-input>
      </el-form-item>

      <el-form-item label="手机号码">
        <el-input v-model="student.T_STU_MOBILE" clearable class="input-width"></el-input>
      </el-form-item>

      <el-form-item label="学生邮件">
        <el-input v-model="student.T_STU_EAMIL" clearable class="input-width"></el-input>
      </el-form-item>

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

      <el-form-item label="入学年份">
        <el-date-picker v-model="student.T_EN_YEAR" type="year" placeholder="入学年份" value-format="yyyy">
        </el-date-picker>
      </el-form-item>

      <el-form-item label="毕业年份">
        <el-date-picker v-model="student.T_GRA_YEAR" type="year" placeholder="毕业年份" value-format="yyyy">
        </el-date-picker>
      </el-form-item>

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

      <!--用户头像-->
      <el-form-item label="用户头像">
        <!-- 头像缩略图 -->
        <pan-thumb :image="avatar"/>
        <el-upload
          :headers="headers"
          :action="BASE_API+'/sys/uploadAvatar'"
          :before-remove="beforeRemove"
          :limit="1"
          :on-success="uploadSuccess">
          <el-button type="primary" icon="el-icon-upload" >更换头像</el-button>
        </el-upload>
      </el-form-item>

      <el-form-item label="用户密码">
        <el-input :type="pwdType" v-model="student.T_STU_PSWD" clearable :change="checkPwd()" :suffix-icon="iconAgainPwd"></el-input>
      </el-form-item>

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

      <el-form-item>
        <el-button type="success" @click="updateStudentInfo">保存</el-button>
      </el-form-item>

    </el-form>
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

  export default {
    components: { ImageCropper, PanThumb },
    data() {
      return {
        student: {},
        pwdType: 'password',
        T_AGAIN_PWD: '',
        levellist: {},
        BASE_API: process.env.BASE_API, // 接口API地址
        headers: {token: getToken()},
        avatar: '',
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
          this.avatar = this.BASE_API + '/avatar/' + data.T_AVATAR
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
        });
      },

      uploadSuccess(data) {
        this.student.T_AVATAR = data.OUT_DATA.data
        //显示头像信息
        this.avatar = this.BASE_API + '/avatar/' + data.OUT_DATA.data
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
      }
    }
  }
</script>

<style scoped>

</style>
