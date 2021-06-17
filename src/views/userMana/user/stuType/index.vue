<template>
  <div class="app-container">
    <router-view/>

    <el-form :inline="true" class="demo-from-inline">
      <el-form-item>
        <el-input v-model="stutype.T_STU_TYPE_ZH_NAME" placeholder="类型职称名称"></el-input>
      </el-form-item>

      <el-form-item>
        <el-select v-model="stutype.T_IS_TUTOR_LEVEL" placeholder="请选择职称所属" clearable>
          <el-option
            v-for="item in levelList"
            :key="item.key"
            :label="item.value"
            :value="item.key">
          </el-option>
        </el-select>
      </el-form-item>

      <el-form-item>
        <el-button type="primary" icon="el-icon-search" @click="getStuTypeInfoByCond()">查询</el-button>
      </el-form-item>

      <el-form-item>
        <el-button type="warning" @click="resetData()">清空</el-button>
      </el-form-item>

      <el-form-item>
        <el-button type="success" icon="el-icon-circle-plus-outline" @click="dialogFormVisibleSave = true">添加类型职称</el-button>
      </el-form-item>
    </el-form>

    <el-dialog title="类型职称信息添加" :visible.sync="dialogFormVisibleSave">
      <el-form :model="stuTypeSave">
        <el-form-item label="类型职称编号">
          <el-input v-model="stuTypeSave.T_STU_TYPE_ID" clearable></el-input>
        </el-form-item>
        <el-form-item label="类型职称名称">
          <el-input v-model="stuTypeSave.T_STU_TYPE_ZH_NAME" clearable></el-input>
        </el-form-item>
        <el-form-item label="英文类型职称名称">
          <el-input v-model="stuTypeSave.T_STU_TYPE_EN_NAME" clearable></el-input>
        </el-form-item>
        <el-form-item label="职称所属">
          <el-select v-model="stuTypeSave.T_IS_TUTOR_LEVEL" placeholder="请选择职称所属" clearable>
            <el-option
              v-for="item in levelList"
              :key="item.key"
              :label="item.value"
              :value="item.key">
            </el-option>
          </el-select>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisibleSave = false">取 消</el-button>
        <el-button type="primary" @click="dialogFormVisibleSave = false, saveStuTypeInfo()">确 定</el-button>
      </div>
    </el-dialog>

    <el-table
      :data="list"
      border
      fit
      highlight-current-row>

      <el-table-column prop="T_STU_TYPE_ID" label="类型职称编号"/>

      <el-table-column prop="T_STU_TYPE_ZH_NAME" label="类型职称名称"/>

      <el-table-column prop="T_STU_TYPE_EN_NAME" label="英文类型职称名称"/>

      <el-table-column prop="T_IS_TUTOR_LEVEL" label="职称所属">
        <template slot-scope="scope">
          {{scope.row.T_IS_TUTOR_LEVEL == 1 ? '导师' : '学生'}}
        </template>
      </el-table-column>

      <el-table-column label="操作" align="center">
        <template slot-scope="scope">

          <el-button type="infor" size="mini"  icon="el-icon-edit" circle @click="dialogFormVisible = true, setStuTypeId(scope.row.T_STU_TYPE_ID)">修改</el-button>

          <el-button type="danger" size="mini" icon="el-icon-delete" circle @click="removeStuTypeInfo(scope.row.T_STU_TYPE_ID)">删除</el-button>
        </template>
      </el-table-column>
    </el-table>

    <!-- 修改弹出框 -->
    <el-dialog title="类型职称信息修改" :visible.sync="dialogFormVisible">
      <el-form :model="stuTypeUp">
        <el-form-item label="类型职称名称">
          <el-input v-model="stuTypeUp.T_STU_TYPE_ZH_NAME" clearable></el-input>
        </el-form-item>
        <el-form-item label="英文类型职称名称">
          <el-input v-model="stuTypeUp.T_STU_TYPE_EN_NAME" clearable></el-input>
        </el-form-item>
        <el-form-item label="学生类型">
          <el-select v-model="stuTypeUp.T_IS_TUTOR_LEVEL" placeholder="请选择职称所属" clearable>
            <el-option
              v-for="item in levelList"
              :key="item.key"
              :label="item.value"
              :value="item.key">
            </el-option>
          </el-select>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisible = false">取 消</el-button>
        <el-button type="primary" @click="dialogFormVisible = false, updateStuTypeInfo()">确 定</el-button>
      </div>
    </el-dialog>

    <!-- 分页 -->
    <el-pagination
      :current-page="page"
      :page-size="limit"
      :total="total"
      style="padding: 30px 0; text-align: center;"
      layout="total, prev, pager, next, jumper"
      @current-change="getAllTypeInfo()"
    />

  </div>
</template>

<script>

  import stutypeApi from '@/api/stutype/stutype.js'

    export default {
      name: "index",
      data() {
        return {
          list: null,
          stutype: {},
          stuTypeUp: {},
          stuTypeSave: {},
          page: 1,
          limit: 20,
          total: 0,
          levelList: [
            {
              key: 0,
              value: '学生'
            },
            {
              key: 1,
              value: '导师'
            }
          ],
          dialogFormVisible: false,
          dialogFormVisibleSave: false
        }
      },

      created() {
        this.getAllTypeInfo()
      },

      methods: {

        getAllTypeInfo(page = 1) {
          this.page = page
          stutypeApi.getAllType(this.page)
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

        setStuTypeId(stuTypeId, page = 1) {
          this.stuTypeUp = {}
          this.stuTypeUp.T_STU_TYPE_ID = stuTypeId
          //弹出框回显
          this.page = page
          stutypeApi.getStuType(this.page, this.stuTypeUp)
          .then(result => {
            const data = result.OUT_DATA.data
            this.stuTypeUp = data.data[0]
          })
        },

        updateStuTypeInfo() {
          stutypeApi.updateStuType(this.stuTypeUp)
          .then(result => {
            this.$message({
              type: 'success',
              "message": '修改成功'
            })
            this.getAllTypeInfo();
          })
        },

        removeStuTypeInfo(stutypeId) {
          this.$confirm('此操作将永久删除该记录, 是否继续?', '提示',{
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            type: 'warning'
          }).then(() => {
            stutypeApi.removeStuType(stutypeId)
              .then(result => {
                this.$message({
                  type: 'success',
                  "message": '删除成功'
                })
                this.getAllTypeInfo();
              })
          })
        },

        getStuTypeInfoByCond(page = 1) {
          this.page = page
          stutypeApi.getStuType(this.page, this.stutype)
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
          this.stutype = {}
          this.getAllTypeInfo();
        },

        saveStuTypeInfo() {
          stutypeApi.saveStuType(this.stuTypeSave)
          .then(result => {
            this.$message({
              type: 'success',
              "message": '添加成功'
            })
            this.getAllTypeInfo();
          })
        }
      }
    }
</script>

<style scoped>

</style>
