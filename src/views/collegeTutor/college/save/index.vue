<template>
  <div class="app-container">
    <router-view/>

    <el-form label-width="100px">
      <el-form-item label="学院编号">
        <el-input v-model="college.T_COLLEGE_ID" clearable class="input-width"></el-input>
      </el-form-item>

      <el-form-item label="学院名称">
        <el-input v-model="college.T_COLLEGE_NAME" clearable class="input-width"></el-input>
      </el-form-item>

      <el-form-item label="学院英文名称">
        <el-input v-model="college.T_COLLEGE_EN_NAME" clearable class="input-width"></el-input>
      </el-form-item>

      <el-form-item>
        <el-button type="success" @click="saveCollege">保存</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>

<script>
  import collegeApi from '@/api/collegeTutor/college.js'
    export default {
        name: "index",

      data() {
          return {
            college: {}
          }
      },

      methods: {
        saveCollege() {
          collegeApi.saveCollegeInfo(this.college)
          .then(result => {
            this.$message({
              type: "success",
              message: "保存成功"
            })
            this.college = {}
          })
        }
      }
    }
</script>

<style scoped>
  .input-width {
    width: 70%;
  }
</style>
