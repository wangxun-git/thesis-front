<template>
  <div class="app-container">
    <router-view/>

    <el-form label-width="100px">
      <el-form-item label="专业编号">
        <el-input v-model="major.T_MAJOR_ID" clearable class="input-width"></el-input>
      </el-form-item>

      <el-form-item label="中文名称">
        <el-input v-model="major.T_MAJOR_NAME" clearable class="input-width"></el-input>
      </el-form-item>

      <el-form-item label="英文名称">
        <el-input v-model="major.T_MAJOR_EN_NAME" clearable class="input-width"></el-input>
      </el-form-item>

      <el-form-item label="学院名称">
        <el-select v-model="major.T_COLLEGE_ID" clearable placeholder="请选择">
          <el-option
            v-for="item in collegeList"
            :key="item.T_COLLEGE_ID"
            :label="item.T_COLLEGE_NAME"
            :value="item.T_COLLEGE_ID">
          </el-option>
        </el-select>
      </el-form-item>

      <el-form-item>
        <el-button type="success" @click="saveMajorInfo">保存</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>

<script>

  import majorApi from '@/api/collegeTutor/major.js'
  import collegeApi from '@/api/collegeTutor/college.js'

    export default {
        name: "index",
      data() {
          return {
            major: {},
            collegeId: '',
            collegeList: null
          }
      },

      created() {
        this.getCollegeInfoList()
      },

      methods: {
        //获取学院信息
        getCollegeInfoList() {
          collegeApi.getAllCollegeInfo()
            .then(result => {
              this.collegeList = result.OUT_DATA.data
            })
        },


        saveMajorInfo() {
          majorApi.saveMajor(this.major)
          .then(result => {
            this.$message({
              type: "success",
              message: "添加成功"
            })
            this.major = {}
          })
        }
      }
    }
</script>

<style scoped>

</style>
