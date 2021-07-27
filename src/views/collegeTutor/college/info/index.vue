<template>
    <div class="app-container">
      <router-view/>

      <el-form :inline="true" class="demo-from-inline">

        <el-form-item label="学院名称">
          <el-input v-model="college.T_COLLEGE_NAME" clearable></el-input>
        </el-form-item>

        <el-form-item>
          <el-button type="primary" icon="el-icon-search" @click="getCollegeInfoListByCond()">查询</el-button>
        </el-form-item>

        <el-form-item>
          <el-button type="warning" @click="resetData()">清空</el-button>
        </el-form-item>

        <el-form-item>
          <el-button @click="exportCollege()"><svg-icon icon-class="export"/>导出</el-button>
        </el-form-item>

        <el-form-item>
          <el-upload
            :headers="headers"
            :before-remove="beforeRemove"
            :limit="1"
            :on-success="uploadSuccess"
            :action="BASE_API+'/college/importCol'">
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

        <el-table-column type="selection" width="55"/>

        <el-table-column prop="T_COLLEGE_ID" label="院系编号"></el-table-column>

        <el-table-column prop="T_COLLEGE_NAME" label="院系名称"></el-table-column>

        <el-table-column prop="T_COLLEGE_EN_NAME" label="院系英文名称"></el-table-column>

        <el-table-column label="操作" align="center">
          <template slot-scope="scope">

            <el-button type="infor" size="mini"  icon="el-icon-edit" circle @click="dialogFormVisible = true, setCollege(scope.row.T_COLLEGE_ID)">修改</el-button>

            <el-button type="danger" size="mini" icon="el-icon-delete" circle @click="removeCollegeInfo(scope.row.T_COLLEGE_ID)">删除</el-button>
          </template>
        </el-table-column>

      </el-table>

      <!-- 审核弹出框 -->
      <el-dialog title="院系信息修改" :visible.sync="dialogFormVisible">
        <el-form :model="collegeUp">

          <el-form-item label="中文名称">
            <el-input v-model="collegeUp.T_COLLEGE_NAME" autocomplete="off"></el-input>
          </el-form-item>

          <el-form-item label="英文名称">
            <el-input v-model="collegeUp.T_COLLEGE_EN_NAME" autocomplete="off"></el-input>
          </el-form-item>

        </el-form>
        <div slot="footer" class="dialog-footer">
          <el-button @click="dialogFormVisible = false">取 消</el-button>
          <el-button type="primary" @click="dialogFormVisible = false, updateCollegeInfo()">确 定</el-button>
        </div>
      </el-dialog>

      <!-- 分页 -->
      <el-pagination
        :current-page="page"
        :page-size="limit"
        :total="total"
        style="padding: 30px 0; text-align: center;"
        layout="total, prev, pager, next, jumper"
        @current-change="getCollegeInfoList()"
      />

    </div>
</template>

<script>
  import collegeApi from '@/api/collegeTutor/college.js'
  import { getToken } from '@/utils/auth'

    export default {
      name: "index",
      data() {
          return {
            list: null,
            college: {},
            page: 0,
            limit: 20,
            total: 0,
            dialogFormVisible: false,
            collegeUp: {},
            selectCollegeList: {},
            collegeIdList: [],
            headers: {token: getToken()},
            BASE_API: process.env.BASE_API
          }
      },

      created() {
        this.getCollegeInfoList()
      },

      methods: {

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
          }
        },

        getCollegeInfoList(page = 1) {
          this.page = page
          collegeApi.getCollegeInfo(this.page)
          .then(result => {
            this.list = result.OUT_DATA.data.data
            this.total = result.OUT_DATA.data.total
          })
        },

        getCollegeInfoListByCond(page = 1) {
          this.page = page
          collegeApi.getCollegeInfoByCond(this.page, this.college)
          .then(result => {
            this.list = result.OUT_DATA.data.data
            this.total = result.OUT_DATA.data.total
          })
        },

        //清空
        resetData() {
          this.college = {}
          this.getCollegeInfoList();
        },

        //删除学院信息
        removeCollegeInfo(collegeId) {
          this.$confirm('此操作将永久删除该记录, 是否继续?', '提示',{
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            type: 'warning'
          }).then(() => {
            collegeApi.removeCollegeInfoById(collegeId)
              .then(result => {
                this.$message({
                  type: 'success',
                  "message": '删除成功'
                })
                this.getCollegeInfoList();
              })
          })
        },

        setCollege(collegeId, page = 1) {
          this.collegeUp = {}
          this.collegeUp.T_COLLEGE_ID = collegeId
          collegeApi.getCollegeInfoByCond(page, this.collegeUp)
          .then(result => {
            const data = result.OUT_DATA.data.data
            this.collegeUp = data[0]
          })
        },

        //修改学院信息
        updateCollegeInfo() {
          collegeApi.updateCollegeInfoById(this.collegeUp)
          .then(result => {
            this.$message({
              type: 'success',
              "message": '修改成功'
            })
            this.getCollegeInfoList()
          })
        },

        //选中选中框
        handlerTableSelect(value) {
          this.selectCollegeList = value
        },

        //导出院系信息
        exportCollege() {
          this.collegeIdList = []

          if (this.selectCollegeList.length == null) {
            this.$message({
              type: 'error',
              "message": '请选择学院信息'
            })
            return
          }

          for (let i = 0; i < this.selectCollegeList.length; i++) {
            let collegeId = this.selectCollegeList[i].T_COLLEGE_ID
            this.collegeIdList.push(collegeId)
          }

          collegeApi.exportCollegeInfos(this.collegeIdList)
          .then(result => {
            if (!result) {
              return
            }
            const link = document.createElement('a')
            let blob = new Blob([result], {type: 'application/vnd.ms-excel'})
            link.style.display = 'none';
            link.href = URL.createObjectURL(blob);

            link.setAttribute('download', '学院信息' + '.xlsx')
            document.body.appendChild(link)
            link.click()
            document.body.removeChild(link)
          })
        }

      }
    }
</script>

<style scoped>

</style>
