<template>
  <div class="app-container">
    <router-view/>

    <el-form  label-width="80px">
      <el-form-item label="学生学号">
        <el-input v-model="student.T_STU_ID" clearable class="input-width"></el-input>
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
        <el-select v-model="student.T_COLLEGE_ID" clearable>
          <el-option
            v-for="item in collegelist"
            :key="item.T_COLLEGE_ID"
            :label="item.T_COLLEGE_NAME"
            :value="item.T_COLLEGE_ID">
          </el-option>
        </el-select>
      </el-form-item>

      <el-form-item label="归属专业">
        <el-select v-model="student.T_MAJOR_ID" clearable @change="handlerMajorChange()">
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
          <el-radio :label="item.T_STU_TYPE_ID" :key="value" v-for="(item, value) in levellist" @change="changeStuDegree">
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

    export default {
      name: "index",
      data() {
        return {
          student: {},
          collegelist: {},
          majorlist: {},
          major: {},
          levellist: {},
          degreeList: {},
          stuDegree: {}
        }
      },

      created() {
        //初始化学院信息
        this.getCollegeInfo()
        //初始化培养层级信息
        this.getStuTypeInfo()
        //获取参数信息
        this.init()
        //获取学生信息
        this.getStudentInfo()
      },

      methods: {
        init(){
          if (this.$route.params && this.$route.params.id) {
            const id = this.$route.params.id
            this.student.T_STU_ID = id
          }
        },

        //初始化学生信息
        getStudentInfo(page = 1) {
          this.page = page
          studentApi.getStudentInfoByCond(this.page, this.student)
          .then(result => {
            this.student = result.OUT_DATA.data.data[0]
            this.handlerStuTypeId()
            this.handlerCollegeChange()
            this.initStuDegree()
          })
        },

        initStuDegree() {
          this.stuDegree.T_STU_TYPE_ID = this.student.T_STU_TYPE_ID
          stuDegreeApi.getStuDegreeByCond(this.page, this.stuDegree)
            .then(result => {
              const data = result.OUT_DATA.data
              if (data == null) {
                this.degreeList = {}
                return
              }
              this.degreeList = data.data;
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
          this.stuDegree.T_STU_TYPE_ID = this.student.T_STU_TYPE_ID
          stuDegreeApi.getStuDegreeByCond(this.page, this.stuDegree)
            .then(result => {
              const data = result.OUT_DATA.data
              this.degreeList = data.data
            })
        },

        changeStuDegree() {
          this.stuDegree.T_STU_TYPE_ID = this.student.T_STU_TYPE_ID
          stuDegreeApi.getStuDegreeByCond(this.page, this.stuDegree)
            .then(result => {
              this.student.T_STU_DEGREE_ID = ''
              const data = result.OUT_DATA.data
              if (data == null) {
                this.degreeList = {}
                return
              }
              this.degreeList = data.data;
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

        //保存修改信息
        updateStudentInfo() {
          studentApi.updateStudentInfo(this.student)
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
