<template>
    <div class="app-container">
      <router-view/>

      <el-form :inline="true" class="demo-from-inline">
        <el-form-item label="专业名称">
          <el-input v-model="major.T_MAJOR_NAME" clearable></el-input>
        </el-form-item>

        <el-form-item label="院系名称">
          <el-select v-model="collegeId" clearable placeholder="请选择学院" @change="handlerSelectCollege">
            <el-option
              v-for="item in collegeList"
              :key="item.T_COLLEGE_ID"
              :label="item.T_COLLEGE_NAME"
              :value="item.T_COLLEGE_ID">
            </el-option>
          </el-select>
        </el-form-item>

        <el-form-item>
          <el-button type="primary" icon="el-icon-search" @click="getMajorInfosByCond()">查询</el-button>
        </el-form-item>

        <el-form-item>
          <el-button type="warning" @click="resetData()">清空</el-button>
        </el-form-item>

        <el-form-item>
          <el-button @click="exportMajorInfo()"><svg-icon icon-class="export"/>导出</el-button>
        </el-form-item>

        <el-form-item>
          <el-upload
            :headers="headers"
            :before-remove="beforeRemove"
            :limit="1"
            :on-success="uploadSuccess"
            :action="BASE_API+'/major/import_major'">
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

        <el-table-column prop="T_MAJOR_ID" label="专业编号"></el-table-column>

        <el-table-column prop="T_MAJOR_NAME" label="专业名称"></el-table-column>

        <el-table-column prop="T_MAJOR_EN_NAME" label="英文名称" :show-overflow-tooltip='true'></el-table-column>

        <el-table-column prop="T_COLLEGE_NAME" label="归属学院"></el-table-column>

        <el-table-column label="操作" align="center">
        <template slot-scope="scope">

          <el-button type="infor" size="mini"  icon="el-icon-edit" circle @click="dialogFormVisible = true, setMajorInfo(scope.row.T_MAJOR_ID)" >修改</el-button>

          <el-button type="danger" size="mini" icon="el-icon-delete" circle @click="removeMajorInfo(scope.row.T_MAJOR_ID)">删除</el-button>
        </template>
        </el-table-column>

      </el-table>

      <!-- 审核弹出框 -->
      <el-dialog title="专业信息修改" :visible.sync="dialogFormVisible">
        <el-form :model="majorUp">

          <el-form-item label="中文名称">
            <el-input v-model="majorUp.T_MAJOR_NAME" autocomplete="off" class="input-width"></el-input>
          </el-form-item>

          <el-form-item label="英文名称">
            <el-input v-model="majorUp.T_MAJOR_EN_NAME" autocomplete="off" class="input-width"></el-input>
          </el-form-item>

          <el-form-item label="归属学院">
            <el-select v-model="majorUp.T_COLLEGE_ID" clearable placeholder="请选择学院">
              <el-option
                v-for="item in collegeList"
                :key="item.T_COLLEGE_ID"
                :label="item.T_COLLEGE_NAME"
                :value="item.T_COLLEGE_ID">
              </el-option>
            </el-select>
          </el-form-item>

        </el-form>
        <div slot="footer" class="dialog-footer">
          <el-button @click="dialogFormVisible = false">取 消</el-button>
          <el-button type="primary" @click="dialogFormVisible = false, updateMajorInfo()">确 定</el-button>
        </div>
      </el-dialog>

      <!-- 分页 -->
      <el-pagination
        :current-page="page"
        :page-size="limit"
        :total="total"
        style="padding: 30px 0; text-align: center;"
        layout="total, prev, pager, next, jumper"
        @current-change="getMajorInfoList()"
      />

    </div>
</template>

<script>
  import majorApi from '@/api/collegeTutor/major.js'
  import collegeApi from '@/api/collegeTutor/college.js'
  import { getToken } from '@/utils/auth'

    export default {
      data() {
          return {
            major: {},
            list: null,
            page: 0,
            limit: 20,
            total: 0,
            collegeId: '',
            collegeList: null,
            majorUp: {},
            dialogFormVisible: false,
            collegeUpId: '',
            collegeUpList: null,
            selectMajorList: {},
            majorIdList: [],
            headers: {token: getToken()},
            BASE_API: process.env.BASE_API
          }
      },

      created() {
        this.getMajorInfoList()
        this.getCollegeInfoList()
      },

      methods: {

        getMajorInfoList(page = 1){
          this.page = page
          majorApi.getMajorInfo(this.page)
          .then(result => {
            this.list = result.OUT_DATA.data.data
            this.total = result.OUT_DATA.data.total
          })
        },

        //获取学院信息
        getCollegeInfoList() {
          collegeApi.getAllCollegeInfo()
          .then(result => {
            this.collegeList = result.OUT_DATA.data
          })
        },

        handlerSelectCollege() {
          this.major.T_COLLEGE_ID = this.collegeId
        },

        handlerTableSelect(value) {
          this.selectMajorList = value
        },

        getMajorInfosByCond(page = 1) {
          this.page = page
          majorApi.getMajorInfoListByCond(page, this.major)
          .then(result => {
            const data = result.OUT_DATA.data
            if (data == null) {
              this.list = null
              this.total = 0
            }else {
              this.list = result.OUT_DATA.data.data
              this.total = result.OUT_DATA.data.total
            }
          })
        },

        //清空
        resetData() {
          this.major = {}
          this.collegeId = ''
          this.getMajorInfoList();
        },

        setMajorInfo(majorId, page = 1) {
          //设置学院信息
          this.collegeUpList = null
          collegeApi.getAllCollegeInfo()
          .then(result => {
            this.collegeUpList = result.OUT_DATA.data
          })

          this.majorUp.T_MAJOR_ID = majorId
          this.page = page
          majorApi.getMajorInfoListByCond(this.page, this.majorUp)
          .then(result => {
            const data = result.OUT_DATA.data.data
            this.majorUp = data[0]
          })
        },

        removeMajorInfo(majorId) {
          majorApi.removeMajor(majorId)
          .then(result => {
            this.$message({
              type: "success",
              message: "删除成功"
            })
            this.getMajorInfoList()
          })
        },

        updateMajorInfo() {
          majorApi.updateMajor(this.majorUp)
          .then(result => {
            this.$message({
              type: "success",
              message: "修改成功"
            })
            this.getMajorInfoList()
          })
        },

        exportMajorInfo() {
          this.majorIdList = []

          if (this.selectMajorList.length == null ) {
            this.$message({
              type: 'error',
              "message": '请选择专业信息'
            })
            return
          }

          for (let i = 0; i < this.selectMajorList.length; i++) {
            let majorId = this.selectMajorList[i].T_MAJOR_ID
            this.majorIdList.push(majorId)
          }

          majorApi.exportMajor(this.majorIdList)
          .then(result => {
            if (!result) {
              return
            }
            const link = document.createElement('a')
            let blob = new Blob([result], {type: 'application/vnd.ms-excel'})
            link.style.display = 'none';
            link.href = URL.createObjectURL(blob);

            link.setAttribute('download', '专业信息' + '.xlsx')
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
            this.getMajorInfoList()
          }
        },

      }
    }
</script>

<style scoped>
  .input-width {
    width: 70%
  }
</style>
