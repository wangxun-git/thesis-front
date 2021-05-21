<template>
  <div class="app-container">
    <router-view></router-view>

    <el-form :inline="true" class="demo-from-inline">

      <el-form-item>
        <el-input v-model="student.T_STU_ID" placeholder="学生学号"></el-input>
      </el-form-item>

      <el-form-item>
        <el-input v-model="student.T_STU_NAME" placeholder="学生姓名"></el-input>
      </el-form-item>

      <el-form-item>
        <el-select v-model="collegeId" clearable placeholder="请选择学院名称" @change="handlerCollegeChange()">
          <el-option
            v-for="item in collegelist"
            :key="item.T_COLLEGE_ID"
            :label="item.T_COLLEGE_NAME"
            :value="item.T_COLLEGE_ID">
          </el-option>
        </el-select>
      </el-form-item>

      <el-form-item>
        <el-select v-model="majorId" clearable placeholder="请选择专业名称">
          <el-option
            v-for="item in majorlist"
            :key="item.T_MAJOR_ID"
            :label="item.T_MAJOR_NAME"
            :value="item.T_MAJOR_ID">
          </el-option>
        </el-select>
      </el-form-item>

      <el-button type="primary" icon="el-icon-search" @click="getStudentListByCond()">查询</el-button>
      <el-button type="warning" @click="resetData()">清空</el-button>
      <el-button @click="exportStudent()"><svg-icon icon-class="export"/>导出</el-button>

    </el-form>

    <el-table
      :data="list"
      border
      fit
      highlight-current-row
      @selection-change="handlerTableSelect">

      <el-table-column type="selection" width="55"/>

      <el-table-column prop="T_STU_ID" label="学生学号"></el-table-column>

      <el-table-column prop="T_STU_NAME" label="学生姓名"></el-table-column>

      <el-table-column prop="T_STU_MOBILE" label="手机号码"></el-table-column>

      <el-table-column prop="T_STU_EAMIL" label="学生邮件"></el-table-column>

      <el-table-column prop="T_COLLEGE_NAME" label="归属学院"></el-table-column>

      <el-table-column prop="T_MAJOR_NAME" label="归属专业"></el-table-column>

      <el-table-column prop="T_STU_TYPE_ZH_NAME" label="培养层级"></el-table-column>

      <el-table-column label="操作" align="center">
        <template slot-scope="scope">

          <el-button type="infor" size="mini"  icon="el-icon-edit" circle>修改</el-button>

          <el-button type="danger" size="mini" icon="el-icon-delete" circle @click="removeStudentInfo(scope.row.T_STU_ID)">删除</el-button>
        </template>
      </el-table-column>

    </el-table>

    <!-- 分页 -->
    <el-pagination
      :current-page="page"
      :page-size="limit"
      :total="total"
      style="padding: 30px 0; text-align: center;"
      layout="total, prev, pager, next, jumper"
      @current-change="getStudentInfo()"
    />

  </div>
</template>

<script>
  import studentApi from '@/api/custome/student.js'
  import collegeApi from '@/api/collmajor/college.js'
  import majorApi from '@/api/collmajor/major.js'

  export default {
    name: "index",
    data() {
        return {
          list: null,
          student: {},
          page: 1,
          limit: 20,
          total: 0,
          collegelist: {},
          collegeId: '',
          majorlist: {},
          majorId: '',
          major: {},
          selectStudentList: {},
          stuIdList: []
        }
    },

    created() {
      this.getStudentInfo()
      this.getCollegeInfo()
    },

    methods: {
      //初始化学生信息
      getStudentInfo(page = 1){
        this.page = page
        studentApi.getStudentInfos(this.page)
        .then(result => {
          this.list = result.OUT_DATA.data.data
          this.total = result.OUT_DATA.data.total
        })
      },

      //删除学生信息
      removeStudentInfo(stuId) {
        this.$confirm('此操作将永久删除该记录, 是否继续?', '提示',{
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          console.log(stuId)
          studentApi.removeStudentInfoById(stuId)
          .then(result => {
            this.$message({
              type: 'success',
              "message": '删除成功'
            })
            this.getStudentInfo();
          })
        })
      },

      //初始化学院信息
      getCollegeInfo(){
        collegeApi.getCollegeInfo()
        .then(result => {
          this.collegelist = result.OUT_DATA.data
        })
      },

      //选择学院之后，专业选择框发生改变
      handlerCollegeChange() {
        this.major.T_COLLEGE_ID = this.collegeId
        majorApi.getMajorInfoByCond(this.major)
          .then(result => {
            this.majorId = ''
            this.majorlist = result.OUT_DATA.data
          })
      },

      //条件查询学生信息
      getStudentListByCond(page = 1) {
        this.page = page
        this.student.T_COLLEGE_ID = this.collegeId
        this.student.T_MAJOR_ID = this.majorId
        studentApi.getStudentInfoByCond(this.page, this.student)
        .then(result => {
          const data = result.OUT_DATA.data
          this.list = data.data
          this.total = data.total
        })
      },

      //清空
      resetData() {
        this.student = {}
        this.getStudentInfo();
      },

      //处理选中框
      handlerTableSelect(value) {
        this.selectStudentList = value
      },

      //导出学生信息
      exportStudent() {
        for (let i = 0; i < this.selectStudentList.length; i++) {
          let stuId = this.selectStudentList[i].T_STU_ID
          this.stuIdList.push(stuId)
        }
        console.log(this.stuIdList)

        studentApi.exportStudentBySelect(this.stuIdList)
        .then(result => {
          this.$message({
            type: 'success',
            "message": '导出成功'
          })
        })
      }

    }

  }
</script>

<style scoped>

</style>
