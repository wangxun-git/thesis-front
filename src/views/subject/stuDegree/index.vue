<template>
    <div class="app-container">

      <el-form :inline="true" class="demo-from-inline">
        <el-form-item>
          <el-input v-model="stuDegree.T_STU_DEGREE_ZH_NAME" placeholder="学位级别名称"></el-input>
        </el-form-item>

        <el-form-item>
          <el-select v-model="stuDegree.T_STU_TYPE_ID" placeholder="请选择学生类型" clearable>
            <el-option
              v-for="item in stuTypeList"
              :key="item.T_STU_TYPE_ID"
              :label="item.T_STU_TYPE_ZH_NAME"
              :value="item.T_STU_TYPE_ID">
            </el-option>
          </el-select>
        </el-form-item>

        <el-form-item>
          <el-button type="primary" icon="el-icon-search" @click="getStuDegreeInfoByCond()">查询</el-button>
        </el-form-item>

        <el-form-item>
          <el-button type="warning" @click="resetData()">清空</el-button>
        </el-form-item>

        <el-form-item>
          <el-button type="success" icon="el-icon-circle-plus-outline" @click="dialogFormVisibleSave = true">添加学位级别</el-button>
        </el-form-item>
      </el-form>

      <el-dialog title="学位级别信息添加" :visible.sync="dialogFormVisibleSave">
        <el-form :model="stuDegreeSave">
          <el-form-item label="学位编号">
            <el-input v-model="stuDegreeSave.T_STU_DEGREE_ID" clearable></el-input>
          </el-form-item>
          <el-form-item label="学位级别名称">
            <el-input v-model="stuDegreeSave.T_STU_DEGREE_ZH_NAME" clearable></el-input>
          </el-form-item>
          <el-form-item label="英文学位名称">
            <el-input v-model="stuDegreeSave.T_STU_DEGREE_EN_NAME" clearable></el-input>
          </el-form-item>
          <el-form-item label="学生类型">
            <el-select v-model="stuDegreeSave.T_STU_TYPE_ID" placeholder="请选择学生类型" clearable>
              <el-option
                v-for="item in stuTypeList"
                :key="item.T_STU_TYPE_ID"
                :label="item.T_STU_TYPE_ZH_NAME"
                :value="item.T_STU_TYPE_ID">
              </el-option>
            </el-select>
          </el-form-item>
        </el-form>
        <div slot="footer" class="dialog-footer">
          <el-button @click="dialogFormVisibleSave = false">取 消</el-button>
          <el-button type="primary" @click="dialogFormVisibleSave = false, saveDegreeInfo()">确 定</el-button>
        </div>
      </el-dialog>

      <el-table
        :data="list"
        border
        fit
        highlight-current-row>

        <el-table-column prop="T_STU_DEGREE_ID" label="学位编号"/>

        <el-table-column prop="T_STU_DEGREE_ZH_NAME" label="学位级别名称"/>

        <el-table-column prop="T_STU_DEGREE_EN_NAME" label="英文学位名称"/>

        <el-table-column prop="T_STU_TYPE_ZH_NAME" label="学位类型"/>

        <el-table-column label="操作" align="center">
          <template slot-scope="scope">

            <el-button type="infor" size="mini"  icon="el-icon-edit" circle @click="dialogFormVisible = true, setDegreeId(scope.row.T_STU_DEGREE_ID)">修改</el-button>

            <el-button type="danger" size="mini" icon="el-icon-delete" circle @click="removeDegreeInfo(scope.row.T_STU_DEGREE_ID)">删除</el-button>
          </template>
        </el-table-column>

      </el-table>

      <!-- 修改弹出框 -->
      <el-dialog title="学位级别信息修改" :visible.sync="dialogFormVisible">
        <el-form :model="stuDegreeUp">
          <el-form-item label="学位级别名称">
            <el-input v-model="stuDegreeUp.T_STU_DEGREE_ZH_NAME" clearable></el-input>
          </el-form-item>
          <el-form-item label="英文学位名称">
            <el-input v-model="stuDegreeUp.T_STU_DEGREE_EN_NAME" clearable></el-input>
          </el-form-item>
          <el-form-item label="学生类型">
            <el-select v-model="stuDegreeUp.T_STU_TYPE_ID" placeholder="请选择学生类型" clearable>
              <el-option
                v-for="item in stuTypeList"
                :key="item.T_STU_TYPE_ID"
                :label="item.T_STU_TYPE_ZH_NAME"
                :value="item.T_STU_TYPE_ID">
              </el-option>
            </el-select>
          </el-form-item>
        </el-form>
        <div slot="footer" class="dialog-footer">
          <el-button @click="dialogFormVisible = false">取 消</el-button>
          <el-button type="primary" @click="dialogFormVisible = false, updateDegreeInfo()">确 定</el-button>
        </div>
      </el-dialog>

      <!-- 分页 -->
      <el-pagination
        :current-page="page"
        :page-size="limit"
        :total="total"
        style="padding: 30px 0; text-align: center;"
        layout="total, prev, pager, next, jumper"
        @current-change="getStuDegreeInfo()"
      />

    </div>
</template>

<script>
  import stuDegreeApi from '@/api/stuDegree/stuDegree.js'
  import stuTypeApi from '@/api/stutype/stutype.js'

    export default {
        name: "index",
      data() {
          return {
            stuDegree: {},
            stuDegreeUp: {},
            list: null,
            stuTypeList: {},
            page: 1,
            limit: 20,
            total: 0,
            dialogFormVisible: false,
            dialogFormVisibleSave: false,
            stuDegreeSave: {}
          }
      },

      created() {
        //获取学生类型信息
        this.getStuTypeInfo()
        this.getStuDegreeInfo()
      },

      methods: {

        getStuTypeInfo() {
          stuTypeApi.getStudentStuType()
          .then(result => {
            this.stuTypeList = result.OUT_DATA.data
          })
        },

        getStuDegreeInfo(page = 1) {
          this.page = page
          stuDegreeApi.getStuDegree(this.page)
          .then(result => {
            const data = result.OUT_DATA.data
            if (data == null) {
              this.list = null
              return
            }
            this.list = data.data
            this.total = data.total
          })
        },

        setDegreeId(degreeId, page = 1) {
          this.stuDegreeUp = {}
          this.stuDegreeUp.T_STU_DEGREE_ID = degreeId
          //弹出框回显
          this.page = page
          stuDegreeApi.getStuDegreeByCond(this.page, this.stuDegreeUp)
          .then(result => {
            this.stuDegreeUp = result.OUT_DATA.data.data[0]
          })
        },

        removeDegreeInfo(degreeId) {
          this.$confirm('此操作将永久删除该记录, 是否继续?', '提示',{
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            type: 'warning'
          }).then(() => {
            stuDegreeApi.removeStuDegree(degreeId)
              .then(result => {
                this.$message({
                  type: 'success',
                  "message": '删除成功'
                })
                this.getStuDegreeInfo();
              })
          })
        },

        getStuDegreeInfoByCond(page = 1) {
          this.page = page
          stuDegreeApi.getStuDegreeByCond(this.page, this.stuDegree)
          .then(result => {
            const data = result.OUT_DATA.data
            if (data == null) {
              this.list = null
              return
            }
            this.list = data.data
            this.total = data.total
          })
        },

        //清空
        resetData() {
          this.stuDegree = {}
          this.getStuDegreeInfo();
        },

        updateDegreeInfo() {
          stuDegreeApi.updateDegree(this.stuDegreeUp)
          .then(result => {
            this.$message({
              type: 'success',
              "message": '修改成功'
            })
            this.getStuDegreeInfo();
          })
        },

        //添加学位级别信息
        saveDegreeInfo() {
          stuDegreeApi.saveStuDegree(this.stuDegreeSave)
          .then(result => {
            this.$message({
              type: 'success',
              "message": '添加成功'
            })
            this.stuDegreeSave = {}
            this.getStuDegreeInfo();
          })
        }

      }
    }
</script>

<style scoped>

</style>
