<template>
  <div class="app-container">
    <router-view/>

    <el-form ref="tutor" label-width="100px">

      <el-form-item label="导师编号">
        <el-input :disabled="editTutorId" v-model="tutor.T_TUTOR_ID"></el-input>
      </el-form-item>

      <el-form-item label="导师名称">
        <el-input v-model="tutor.T_TUTOR_NAME"></el-input>
      </el-form-item>

      <el-form-item label="导师邮箱">
        <el-input v-model="tutor.T_TUTOR_EMAIL"></el-input>
      </el-form-item>

      <el-form-item label="导师手机">
        <el-input v-model="tutor.T_TUTOR_MOBILE"></el-input>
      </el-form-item>

      <el-form-item label="导师简介">
        <el-input v-model="tutor.T_TUTOR_INTRO" type="textarea" :rows="3"></el-input>
      </el-form-item>

      <el-form-item label="导师职称">
        <el-select v-model="tutor.T_TUTOR_LEVEL" clearable placeholder="请选择职称信息">
          <el-option
            v-for="item in stutypeList"
            :key="item.T_STU_TYPE_ID"
            :label="item.T_STU_TYPE_ZH_NAME"
            :value="item.T_STU_TYPE_ID">
          </el-option>
        </el-select>
      </el-form-item>

      <el-form-item label="导师职称">
        <el-select v-model="tutor.T_COLLEGE_ID" clearable placeholder="请选择院系信息">
          <el-option
            v-for="item in collegeList"
            :key="item.T_COLLEGE_ID"
            :label="item.T_COLLEGE_NAME"
            :value="item.T_COLLEGE_ID">
          </el-option>
        </el-select>
      </el-form-item>

      <el-button type="success" :disabled="saveBtnDisabled" @click="saveOrUpdateTutor">保存</el-button>
    </el-form>
  </div>
</template>

<script>

  import tutorApi from '@/api/collegeTutor/tutor.js'
  import stuTypeApi from '@/api/stutype/stutype.js'
  import collegeApi from '@/api/collegeTutor/college.js'
  import tutor from "../../../../api/collegeTutor/tutor";

    export default {
        name: "index",
      data() {
          return {
            tutor: {},
            tutorId: '',
            stutypeList: null,
            stutype: {},
            collegeList: null,
            saveBtnDisabled: false,
            editTutorId: false
          }
      },

      created() {
        //获取参数
        this.init()
        //获取导师职称信息
        this.getStuTypeInfo()
        //获取学院信息
        this.getCollegeInfo()
      },

      methods: {
        init() {
          if (this.$route.params && this.$route.params.id) {
            const id = this.$route.params.id
            this.tutor.T_TUTOR_ID = id
            this.tutorId = id
            this.editTutorId = true
            this.getTutorInfo()
          }else {
            this.tutor = {}
          }
        },

        //回显导师信息
        getTutorInfo(page = 1) {
          this.page = page
          tutorApi.getTutorByCond(page, this.tutor)
          .then(result => {
            this.tutor = result.OUT_DATA.data.data[0]
          })
        },

        getStuTypeInfo() {
          this.stutype.T_IS_TUTOR_LEVEL = 1
          stuTypeApi.getStuType(this.stutype)
            .then(result => {
              this.stutypeList = result.OUT_DATA.data
            })
        },

        getCollegeInfo() {
          collegeApi.getAllCollegeInfo()
            .then(result => {
              this.collegeList = result.OUT_DATA.data
            })
        },

        //保存信息
        saveOrUpdateTutor() {
          if (!this.tutorId) {
            this.saveTutorInfo()
          }else {
            this.updateTutorInfo()
          }
          this.saveBtnDisabled = true
        },

        updateTutorInfo() {
          tutorApi.updateTutor(this.tutor)
          .then(result => {
            this.$message({
              type : "success",
              message : "修改成功"
            })

            this.$router.push({path: '/collegeTutor/tutor/info'})
          })
        },

        saveTutorInfo() {
          tutorApi.saveTutor(this.tutor)
          .then(result => {
            this.$message({
              type : "success",
              message : "添加成功"
            })

            this.tutor = {}
          })
        }

      }
    }
</script>

<style scoped>

</style>
