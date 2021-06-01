<template>
    <div class="app-container">
      <router-view/>

      <el-form :inline="true" class="demo-from-inline">

        <el-form-item label="导师编号">
          <el-input v-model="tutor.T_TUTOR_ID" clearable></el-input>
        </el-form-item>

        <el-form-item label="导师名称">
          <el-input v-model="tutor.T_TUTOR_NAME" clearable></el-input>
        </el-form-item>

        <el-form-item label="导师职称">
          <el-select v-model="tutor.T_TUTOR_LEVEL" clearable placeholder="请选择">
            <el-option
              v-for="item in stutypeList"
              :key="item.T_STU_TYPE_ID"
              :label="item.T_STU_TYPE_ZH_NAME"
              :value="item.T_STU_TYPE_ID">
            </el-option>
          </el-select>
        </el-form-item>

        <el-form-item>
          <el-button type="primary" icon="el-icon-search" @click="getTutorInfoByCond()">查询</el-button>
        </el-form-item>

        <el-form-item>
          <el-button type="warning" @click="resetData()">清空</el-button>
        </el-form-item>

        <el-form-item>
          <el-button @click="exportTutorInfo()"><svg-icon icon-class="export"/>导出</el-button>
        </el-form-item>

        <el-form-item>
          <el-upload
            :headers="headers"
            :before-remove="beforeRemove"
            :limit="1"
            :on-success="uploadSuccess"
            :action="BASE_API+'/tutor/import_tutor'">
            <el-button icon="el-icon-upload">导入</el-button>
          </el-upload>
        </el-form-item>
      </el-form>

      <el-table
        :data="list"
        border
        fit
        highlight-current-row
        @selection-change="handlerTableSelect">

        <el-table-column type="selection" width="55"></el-table-column>

        <el-table-column prop="T_TUTOR_ID" label="导师编号"></el-table-column>

        <el-table-column prop="T_TUTOR_NAME" label="导师名称"></el-table-column>

        <el-table-column prop="T_TUTOR_EMAIL" label="导师邮箱"></el-table-column>

        <el-table-column prop="T_TUTOR_MOBILE" label="导师手机"></el-table-column>

        <el-table-column prop="T_TUTOR_INTRO" label="导师简介" :show-overflow-tooltip='true'></el-table-column>

        <el-table-column prop="T_STU_TYPE_ZH_NAME" label="导师职称" width="80px"></el-table-column>

        <el-table-column label="操作" align="center">
          <template slot-scope="scope">

            <el-button type="infor" size="mini"  icon="el-icon-edit" circle @click="editTutorInfo(scope.row.T_TUTOR_ID)">修改</el-button>

            <el-button type="danger" size="mini" icon="el-icon-delete" circle @click="removeTutorInfo(scope.row.T_TUTOR_ID)">删除</el-button>
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
        @current-change="getTuTorInfo()"
      />

    </div>
</template>

<script>
  import tutorApi from '@/api/collegeTutor/tutor.js'
  import stuTypeApi from '@/api/stutype/stutype.js'
  import { getToken } from '@/utils/auth'

    export default {
        name: "index",
      data(){
          return {
            tutor: {},
            stutype: {},
            stutypeList: null,
            list: null,
            selectTutorList: {},
            tutorIdList: [],
            page: 0,
            limit: 20,
            total: 0,
            headers: {token: getToken()},
            BASE_API: process.env.BASE_API
          }
      },

      created() {
          //获取导师职称
        this.getStuTypeInfo()
        this.getTuTorInfo()
      },

      methods: {

        getTuTorInfo(page = 1) {
          this.page = page
          tutorApi.getTutor(this.page)
          .then(result => {
            this.list = result.OUT_DATA.data.data
            this.total = result.OUT_DATA.data.total
          })
        },

        getStuTypeInfo() {
          this.stutype.T_IS_TUTOR_LEVEL = 1
          stuTypeApi.getStuType(this.stutype)
          .then(result => {
            this.stutypeList = result.OUT_DATA.data
          })
        },

        //清空
        resetData() {
          this.tutor = {}
          this.getTuTorInfo();
        },

        getTutorInfoByCond(page = 1) {
          this.page = page
          tutorApi.getTutorByCond(this.page, this.tutor)
          .then(result => {
            this.list = result.OUT_DATA.data.data
            this.total = result.OUT_DATA.data.total
          })
        },

        removeTutorInfo(tutorId) {
          tutorApi.removeTutor(tutorId)
          .then(result => {
            this.$message({
              type: "success",
              message: "删除成功"
            })
            this.getTuTorInfo()
          })
        },

        handlerTableSelect(value) {
          this.selectTutorList = value
        },

        exportTutorInfo() {
          this.tutorIdList = []

          if (this.selectTutorList.length == null ) {
            this.$message({
              type: 'error',
              "message": '请选择导师信息'
            })
            return
          }

          for (let i = 0; i < this.selectTutorList.length; i++) {
            let tutorId = this.selectTutorList[i].T_TUTOR_ID
            this.tutorIdList.push(tutorId)
          }

          tutorApi.exportTutor(this.tutorIdList)
            .then(result => {
              if (!result) {
                return
              }
              const link = document.createElement('a')
              let blob = new Blob([result], {type: 'application/vnd.ms-excel'})
              link.style.display = 'none';
              link.href = URL.createObjectURL(blob);

              link.setAttribute('download', '导师信息' + '.xlsx')
              document.body.appendChild(link)
              link.click()
              document.body.removeChild(link)
            })
        },

        beforeRemove(file, fileList){
          return this.$confirm(`确定移除 ${ file.name }？`,'提示',{
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            type: 'warning'
          });
        },

        uploadSuccess(response) {
          const code = response.RETURN_CODE
          if (code !== 10000) {
            this.$message({
              type: "error",
              message: response.RETURN_MSG,
              duration: 5 * 1000
            })
          }else {
            this.$message({
              type: "success",
              message: "添加成功"
            })
            this.getTuTorInfo()
          }
        },

        editTutorInfo(tutorId) {
          this.$router.push({path: '/collegeTutor/tutor/edit/' + tutorId})
        }

      }
    }
</script>

<style scoped>

</style>
