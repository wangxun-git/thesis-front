<template>
    <div class="app-container">
<!--      <router-view/>-->
      <el-table
        :data="list"
        style="width: 100%"
        row-key="T_PER_ID"
        border
        default-expand-all
        :tree-props="{children: 'children', hasChildren: 'hasChildren'}">

        <el-table-column label="名称" prop="T_PER_NAME" sortable/>
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
            list: [],
            defaultProps: {
              children: 'children',
              label: 'T_PER_NAME'
            },
            dialogFormVisible: false,
            rolePer: {},
            perId: '',
            roleList: {}
          }
      },

      mounted() {
        //获取权限列表信息
        this.getPermissionInfo()
        //获取角色列表
        this.getRoleInfo()
      },

      methods: {
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
        }
      }
    }
</script>

<style scoped>

</style>
