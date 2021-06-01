<template>
  <div class="app-container">

    <el-form :inline="true" class="demo-from-inline">
      <el-form-item>
        <el-input v-model="apply.T_STU_ID" placeholder="申请人"></el-input>
      </el-form-item>

      <el-form-item>
        <el-button type="primary" icon="el-icon-search" @click="getDegreeApplyInfo()">查询</el-button>
      </el-form-item>

      <el-form-item>
        <el-button type="warning" @click="resetData()">清空</el-button>
      </el-form-item>

    </el-form>

    <el-table
      :data="list"
      border
      fit
      highlight-current-row>

      <el-table-column prop="T_STU_ID" label="申请人"></el-table-column>

      <el-table-column prop="T_APPLY_REASON" label="申请原因"></el-table-column>

      <el-table-column prop="T_CREATE" label="申请时间"></el-table-column>

      <el-table-column label="操作">
        <template slot-scope="scope">
          <el-button type="infor" size="mini"  icon="el-icon-edit" @click="dialogFormVisible = true,setApplyId(scope.row.T_APPLY_ID)" circle>审批</el-button>
        </template>
      </el-table-column>

    </el-table>

    <!-- 审核弹出框 -->
    <el-dialog title="审核" :visible.sync="dialogFormVisible">
      <el-form :model="approved">
        <el-form-item label="审核状态">
          <el-radio-group v-model="approved.T_APPROVED_STATUS" placeholder="请选择">
            <el-radio :label="0">驳回</el-radio>
            <el-radio :label="1">通过</el-radio>
          </el-radio-group>
        </el-form-item>

        <el-form-item label="审核意见">
          <el-input v-model="approved.T_APPROVED_DESC" autocomplete="off" type="textarea" :row="3"></el-input>
        </el-form-item>

      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisible = false">取 消</el-button>
        <el-button type="primary" @click="dialogFormVisible = false,approvedDoubleDegree()">确 定</el-button>
      </div>
    </el-dialog>

    <!-- 分页 -->
    <el-pagination
      :current-page="page"
      :page-size="limit"
      :total="total"
      style="padding: 30px 0; text-align: center;"
      layout="total, prev, pager, next, jumper"
      @current-change="getDegreeApplyInfo()"
    />
  </div>
</template>

<script>
  import applyApi from '@/api/apply/apply.js'

    export default {
      name: "index",
      data() {
          return {
            list: null,
            apply: {},
            page: 1,
            limit: 20,
            total: 0,
            dialogFormVisible: false,
            formLabelWidth: '120px',
            approved: {}
          }
      },

      created() {
        //获取待审核中的数据信息
        this.apply.T_APPLY_STATUS = 1
        this.getDegreeApplyInfo()
      },

      methods: {
        getDegreeApplyInfo(page = 1) {
          this.page = page
          applyApi.getDegreeApplyInfos(page, this.apply)
          .then(result => {
            const data = result.OUT_DATA.data
            if (!data) {
              this.list = null
              return
            }
            this.list = result.OUT_DATA.data.data
          })
        },

        //清空
        resetData() {
          this.apply = {}
          this.getDegreeApplyInfo();
        },

        setApplyId(applyId) {
          this.approved.T_APPLY_ID = applyId
        },

        approvedDoubleDegree() {
          applyApi.approvedDoubleDegreeInfo(this.approved)
          .then(result => {
            this.$message({
              type: 'success',
              "message": '审核成功'
            })
            this.apply = {}
            this.apply.T_APPLY_STATUS = 1  //查询审核状态下的数据
            this.getDegreeApplyInfo()
          })
        }

      }
    }
</script>

<style scoped>

</style>
