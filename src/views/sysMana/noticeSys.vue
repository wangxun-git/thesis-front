<template>
  <div class="app-container">

    <el-button type="primary" size="medium"  icon="el-icon-circle-plus" round @click="dialogFormVisible = true">添加公告</el-button>

    <el-table
      :data="list"
      border
      fit
      highlight-current-row
      style="width: 100%">

      <el-table-column label="通知公告" prop="T_NOTICE_TITLE"/>

      <el-table-column label="通告文件" prop="T_NOTICE_FILE"/>

      <el-table-column label="创建时间" prop="T_CREATE"/>

      <el-table-column  label="操作" align="center" width="250px" fixed="right">
        <template slot-scope="scope">
          <el-button size="mini"  icon="el-icon-edit" circle @click="setNoticeInfo(scope.row.T_NOTICE_ID)">修改</el-button>

          <el-button type="danger" size="mini" icon="el-icon-delete" circle @click="removeNoticeInfo(scope.row.T_NOTICE_ID)">删除</el-button>
        </template>
      </el-table-column>

    </el-table>

    <!-- 公告添加 -->
    <el-dialog title="添加公告" :visible.sync="dialogFormVisible">
      <el-form :model="notice">

        <el-form-item label="通知公告">
          <el-input v-model="notice.T_NOTICE_TITLE"></el-input>
        </el-form-item>

        <el-form-item label="通知公告内容"/>
        <el-form-item>
          <tinymce :height="200" v-model="notice.T_NOTICE_CONTEXT"></tinymce>
        </el-form-item>

        <el-upload
          ref="upload"
          class="upload-demo"
          :action="BASE_API+'/sys/uploadNoticeFile'"
          :headers="headers"
          :limit="1"
          :auto-upload="false"
          :on-success="uploadSuccess">
          <el-button slot="trigger" size="small" type="primary">选择附件</el-button>
          <el-button style="margin-left: 10px;" size="small" type="success" @click="submitUpload">上传到服务器</el-button>
<!--          <div slot="tip" class="el-upload__tip">只能上传jpg/png文件，且不超过500kb</div>-->
        </el-upload>

      </el-form>

      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisible = false">取 消</el-button>
        <el-button type="primary" @click="dialogFormVisible = false, saveNoticeInfo()">确 定</el-button>
      </div>

    </el-dialog>

    <!-- 公告修改 -->
    <el-dialog title="添加公告" :visible.sync="dialogFormVisibleUp">
      <el-form :model="noticeUp">

        <el-form-item label="通知公告">
          <el-input v-model="noticeUp.T_NOTICE_TITLE"></el-input>
        </el-form-item>

        <el-form-item label="通知公告内容"/>
        <el-form-item>
          <tinymce v-if="dialogFormVisibleUp" :height="200" v-model="noticeUp.T_NOTICE_CONTEXT"></tinymce>
        </el-form-item>

        <el-upload
          ref="upload"
          class="upload-demo"
          :action="BASE_API+'/sys/uploadNoticeFile'"
          :headers="headers"
          :limit="1"
          :auto-upload="false"
          :on-success="uploadSuccessUp">
          <el-button slot="trigger" size="small" type="primary">选择附件</el-button>
          <el-button style="margin-left: 10px;" size="small" type="success" @click="submitUpload">上传到服务器</el-button>
          <!--          <div slot="tip" class="el-upload__tip">只能上传jpg/png文件，且不超过500kb</div>-->
        </el-upload>

      </el-form>

      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisibleUp = false">取 消</el-button>
        <el-button type="primary" @click="dialogFormVisibleUp = false, updateNoticeInfo()">确 定</el-button>
      </div>

    </el-dialog>

    <!-- 分页 -->
    <el-pagination
      :current-page="page"
      :page-size="limit"
      :total="total"
      style="padding: 30px 0; text-align: center;"
      layout="total, prev, pager, next, jumper"
      @current-change="getNoticeInfo"
    />

  </div>
</template>

<script>

  import sysApi from '@/api/system/sys'
  import Tinymce from '@/components/Tinymce'
  import { getToken } from '@/utils/auth'

    export default {
      components: { Tinymce },
      data() {
        return {
          list: null,
          page: 1,
          limit: 20,
          total: 0,
          dialogFormVisible: false,
          dialogFormVisibleUp: false,
          notice: {},
          noticeUp: {
            T_NOTICE_CONTEXT: ''
          },
          headers: {token: getToken()},
          BASE_API: process.env.BASE_API
        }
      },

      created() {
        this.getNoticeInfo()
      },

      methods : {

        //初始化通知公告信息
        getNoticeInfo(page = 1) {
          this.page = page
          sysApi.getNotice(this.page)
          .then(result => {
            const data = result.OUT_DATA.data
            this.total = data.total
            this.list = data.data
          })
        },

        setNoticeInfo(noticeId) {
          // this.noticeUp = {}
          sysApi.getOneNotice(noticeId)
          .then(result => {
            this.noticeUp = result.OUT_DATA.data
          })
          this.dialogFormVisibleUp = true
        },

        removeNoticeInfo(noticeId) {
          this.$confirm('此操作将永久删除该记录, 是否继续?', '提示',{
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            type: 'warning'
          }).then(() => {
            sysApi.removeNotice(noticeId)
              .then(result => {
                this.$message({
                  type: "success",
                  message: "删除成功",
                  duration: 5 * 1000
                })
              })
            this.getNoticeInfo()
          })
        },

        submitUpload() {
          this.$refs.upload.submit();
        },

        //添加
        uploadSuccess(response) {
          const code = response.RETURN_CODE
          if (code !== 10000) {
            this.$message({
              type: "error",
              message: response.RETURN_MSG,
              duration: 5 * 1000
            })
          }else {
            const data = response.OUT_DATA.data
            this.notice.T_NOTICE_FILE = data.filename
            this.notice.T_NOTICE_FILE_URL = data.fileUrl
          }
        },

        //修改
        uploadSuccessUp(response) {
          const code = response.RETURN_CODE
          if (code !== 10000) {
            this.$message({
              type: "error",
              message: response.RETURN_MSG,
              duration: 5 * 1000
            })
          }else {
            const data = response.OUT_DATA.data
            this.noticeUp.T_NOTICE_FILE = data.filename
            this.noticeUp.T_NOTICE_FILE_URL = data.fileUrl
          }
        },

        saveNoticeInfo() {
          sysApi.saveNotice(this.notice)
          .then(result => {
            this.$message({
              type: "success",
              message: "添加成功",
              duration: 5 * 1000
            })

            this.dialogFormVisible = false
            this.getNoticeInfo()
          })
        },

        updateNoticeInfo() {
          sysApi.updateNotice(this.noticeUp)
          .then(result => {
            this.$message({
              type: "success",
              message: "修改成功",
              duration: 5 * 1000
            })

            this.dialogFormVisibleUp = false
            this.getNoticeInfo()
          })
        }

      }
    }
</script>

<style scoped>

</style>
