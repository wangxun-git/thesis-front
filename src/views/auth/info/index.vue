<template>
    <div class="app-container">
<!--      <router-view/>-->

      <el-form :inline="true" class="demo-from-inline">
        <el-form-item label="权限角色">
          <el-select v-model="user.T_ROLE_ID" clearable placeholder="请选择权限角色">
            <el-option
              v-for="item in roles"
              :key="item.T_ROLE_ID"
              :label="item.T_ROLE_NAME"
              :value="item.T_ROLE_ID">
            </el-option>
          </el-select>
        </el-form-item>

<!--        <el-form-item label="用户账号">-->
<!--          <el-input v-model="user.T_USER_ID" clearable placeholder="请选择用户账号"/>-->
<!--        </el-form-item>-->

        <el-form-item>
          <el-button type="primary" icon="el-icon-search" @click="getPerInfosByCond()">查询</el-button>
        </el-form-item>

        <el-form-item>
          <el-button type="warning" @click="resetData()">清空</el-button>
        </el-form-item>

      </el-form>

      <el-table
        :data="list"
        style="width: 100%"
        row-key="T_PER_ID"
        border
        default-expand-all
        :row-class-name="tableRowClassName"
        :tree-props="{children: 'children', hasChildren: 'hasChildren'}">

        <el-table-column fixed label="名称" prop="T_PER_NAME" sortable/>
        <el-table-column label="访问路径" prop="T_PATH" sortable/>
        <el-table-column label="组件路径" prop="T_COMPONENT" sortable/>

        <el-table-column label="操作" align="center" fixed="right" width="100px">
          <template slot-scope="scope">
            <el-button type="primary" round size="mini" v-if="scope.row.T_PER_ID != 1" @click="setPerId(scope.row.T_PER_ID), dialogFormVisible = true">分配</el-button>
          </template>
        </el-table-column>

      </el-table>

      <el-dialog title="权限分配" :visible.sync="dialogFormVisible" width="500px">

        <el-form>
          <el-form-item label="权限角色">
            <el-select v-model="rolePer.T_ROLE_ID" placeholder="请选择角色" clearable>
              <el-option
                v-for="item in roleList"
                :key="item.T_ROLE_ID"
                :label="item.T_ROLE_NAME"
                :value="item.T_ROLE_ID">
              </el-option>
            </el-select>
          </el-form-item>
        </el-form>

        <div slot="footer" class="dialog-footer">
          <el-button @click="dialogFormVisible = false">取 消</el-button>
          <el-button type="primary" @click="dialogFormVisible = false, handlerDistribu()">确 定</el-button>
        </div>
      </el-dialog>

    </div>
</template>

<script>

  import permissionApi from '@/api/role/permission'
  import roleApi from '@/api/role/role'

    export default {
        name: "index",
      data() {
          return {
            user: {},
            list: [],
            defaultProps: {
              children: 'children',
              label: 'T_PER_NAME'
            },
            dialogFormVisible: false,
            rolePer: {},
            perId: '',
            roleList: {},
            roles: {},
          }
      },

      mounted() {
        //获取权限列表信息
        this.getPermissionInfo()
        //获取角色列表
        this.getRoleInfo()
      },

      methods: {
        //设置行颜色
        tableRowClassName({row, rowIndex}) {
          if (row.LEVEL == 1) {
            return 'success-row-1'
          }
          if (row.LEVEL == 2) {
            return 'success-row'
          }
          return ''
        },

        getPermissionInfo() {
          permissionApi.getPermissions()
          .then(result => {
            const data = result.OUT_DATA.data
            this.list = data
          })
        },

        getRoleInfo() {
          roleApi.getRoles()
          .then(result => {
            this.roleList = result.OUT_DATA.data
            this.roles = result.OUT_DATA.data
          })
        },

        //分配权限菜单
        setPerId(perId) {
          this.perId = perId
        },

        handlerDistribu() {
          this.rolePer.T_PER_ID = this.perId
          permissionApi.addPerByRole(this.rolePer)
          .then(result => {
            const code = result.RETURN_CODE
            if (code == 10000) {
              this.$message({
                type: "success",
                message: "分配成功"
              })
            }
          })
        },

        getPerInfosByCond() {
          roleApi.getRolesByUser(this.user)
          .then(result => {
            const data = result.OUT_DATA.data
            this.list = data
          })
        },

        resetData() {
          this.user = {}
          this.getPermissionInfo()
        }
      }
    }
</script>

<style>
  .el-table .success-row-1 {
    background: #579cf6;
  }

  .el-table .success-row {
    background: #f0f9eb;
  }
</style>
