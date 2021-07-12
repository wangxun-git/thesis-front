<template>
  <div class="app-container">

    <el-button type="primary" size="medium"  icon="el-icon-circle-plus" round @click="dialogFormVisible = true">添加FAQ</el-button>

    <el-table
      :data="list"
      border
      fit
      highlight-current-row
      style="width: 100%">

      <el-table-column label="问题标题" prop="T_FAQ_TITLE"/>

<!--      <el-table-column label="答案" prop="T_FAQ_ANSWER"/>-->

      <el-table-column label="创建时间" prop="T_CREATE"/>

      <el-table-column  label="操作" align="center" width="250px" fixed="right">
        <template slot-scope="scope">
          <el-button size="mini" type="primary"  icon="el-icon-view" circle @click="viewFAQInfo(scope.row.T_FAQ_ID)">查看</el-button>

          <el-button size="mini"  icon="el-icon-edit" circle @click="setFAQInfo(scope.row.T_FAQ_ID)">修改</el-button>

          <el-button type="danger" size="mini" icon="el-icon-delete" circle @click="removeFaqInfo(scope.row.T_FAQ_ID)">删除</el-button>
        </template>
      </el-table-column>

    </el-table>

    <!-- 公告添加 -->
    <el-dialog title="添加FAQ" :visible.sync="dialogFormVisible">
      <el-form :model="faq">

        <el-form-item label="问题标题">
          <el-input v-model="faq.T_FAQ_TITLE"></el-input>
        </el-form-item>

        <el-form-item label="答案"/>
        <el-form-item>
          <tinymce :height="200" v-model="faq.T_FAQ_ANSWER"></tinymce>
        </el-form-item>

      </el-form>

      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisible = false">取 消</el-button>
        <el-button type="primary" @click="dialogFormVisible = false, saveFAQInfo()">确 定</el-button>
      </div>

    </el-dialog>

    <!-- 公告修改 -->
    <el-dialog title="修改FAQ" :visible.sync="dialogFormVisibleUp">
      <el-form :model="faqUp">

        <el-form-item label="问题标题">
          <el-input v-model="faqUp.T_FAQ_TITLE" :disabled="canUp"/>
        </el-form-item>

        <el-form-item label="答案"/>
        <el-form-item>
          <tinymce v-if="dialogFormVisibleUp" :height="200" v-model="faqUp.T_FAQ_ANSWER" :disabled="canUp"></tinymce>
        </el-form-item>

      </el-form>

      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisibleUp = false" v-show="btnShow">取 消</el-button>
        <el-button type="primary" @click="dialogFormVisibleUp = false, updateFaqInfo()" v-show="btnShow">确 定</el-button>
      </div>

    </el-dialog>

  </div>
</template>

<script>

  import sysApi from '@/api/system/sys'
  import Tinymce from '@/components/Tinymce'

    export default {
      components: { Tinymce },
      data() {
        return {
          list: null,
          dialogFormVisible: false,
          dialogFormVisibleUp: false,
          faq: {},
          faqUp: {},
          canUp: false,
          btnShow: true
        }
      },

      created() {
        this.getFaqInfo()
      },

      methods : {

        //初始化faq信息
        getFaqInfo() {
          sysApi.getAllFaq()
          .then(result => {
            const data = result.OUT_DATA.data
            this.list = data
          })
        },

        setFAQInfo(faqId) {
          this.faqUp.T_FAQ_ID = faqId
          this.dialogFormVisibleUp = true
          this.btnShow = true
          this.canUp = false
          sysApi.getOneFaq(faqId)
          .then(result => {
            this.faqUp = result.OUT_DATA.data
          })
        },

        viewFAQInfo(faqId) {
          this.canUp = true
          this.dialogFormVisibleUp = true
          this.btnShow = false
          sysApi.getOneFaq(faqId)
            .then(result => {
              this.faqUp = result.OUT_DATA.data
            })
        },

        removeFaqInfo(faqId) {
          this.$confirm('此操作将永久删除该记录, 是否继续?', '提示',{
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            type: 'warning'
          }).then(() => {
            sysApi.removeFaq(faqId)
              .then(result => {
                this.$message({
                  type: "success",
                  message: "删除成功",
                  duration: 5 * 1000
                })
              })
            this.getFaqInfo()
          })
        },

        saveFAQInfo() {
          sysApi.saveFaq(this.faq)
          .then(result => {
            this.$message({
              type: "success",
              message: "添加成功",
              duration: 5 * 1000
            })

            this.dialogFormVisible = false
            this.getFaqInfo()
          })
        },

        updateFaqInfo() {
          sysApi.updateFaq(this.faqUp)
          .then(result => {
            this.$message({
              type: "success",
              message: "修改成功",
              duration: 5 * 1000
            })

            this.dialogFormVisibleUp = false
            this.getFaqInfo()
          })
        }

      }
    }
</script>

<style scoped>

</style>
