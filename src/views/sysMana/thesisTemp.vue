<template>
  <div class="app-container">

    <el-upload
      class="upload-demo"
      :headers="headers"
      :action="BASE_API+'/sys/uploadThesisTemp'"
      :on-preview="handlePreview"
      :on-remove="handleRemove"
      :before-remove="beforeRemove"
      :on-success="uploadSuccess"
      :limit="1"
      v-show="showUploadBtn">
      <el-button size="small" icon="el-icon-upload" type="primary" round>上传论文模板</el-button>
    </el-upload>

    <el-table
      :data="list"
      border
      fit
      highlight-current-row
      style="width: 100%">

      <el-table-column label="模板名称" prop="T_SYS_INFO_VALUE"/>

      <el-table-column label="文件名称" prop="T_SYS_FILE_NAME"/>

      <el-table-column label="创建时间" prop="T_CREATE"/>

      <el-table-column  label="操作" align="center" width="250px" fixed="right" height="500px">
        <template slot-scope="scope">
          <el-upload
            class="upload-demo"
            ref="update-upload"
            :headers="headers"
            :action="BASE_API+'/sys/uploadThesisTemp'"
            :on-success="updateSuccess"
            :limit="1">
            <el-button size="small" icon="el-icon-upload" type="primary" round @click="changeSysId(scope.row.T_SYS_ID)">修改</el-button>
          </el-upload>
        </template>
      </el-table-column>

    </el-table>

    <!-- 公告修改 -->
    <el-dialog title="修改FAQ" :visible.sync="dialogFormVisibleUp">


      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisibleUp = false" >取 消</el-button>
        <el-button type="primary" @click="dialogFormVisibleUp = false" >确 定</el-button>
      </div>

    </el-dialog>

  </div>
</template>

<script>

  import sysApi from '@/api/system/sys'
  import { getToken } from '@/utils/auth'

    export default {
        name: "thesisTemp",
      data() {
          return {
            list: [],
            showUploadBtn: true,
            dialogFormVisible: false,
            dialogFormVisibleUp: false,
            headers: {token: getToken()},
            BASE_API: process.env.BASE_API,
            sysSettings: {}
          }
      },

      mounted() {
          this.getTempInfo()
      },

      methods: {
        getTempInfo() {
          sysApi.getThesisTemp()
            .then(result => {
              const data = result.OUT_DATA.data
              this.list = data
              if (data.length >= 1) {
                this.showUploadBtn = false
              }
            })
        },

        handleRemove(file, fileList) {
          console.log(file, fileList);
        },

        handlePreview(file) {
          console.log(file);
        },

        beforeRemove(file, fileList) {
          return this.$confirm(`确定移除 ${ file.name }？`);
        },

        uploadSuccess(result) {
          const data = result.OUT_DATA.data
          this.sysSettings.T_SYS_FILE_NAME = data.fileName
          this.sysSettings.T_SYS_FILE_URL = data.fileUrl

          sysApi.saveThesisTemp(this.sysSettings)
            .then(result1 => {
              this.$message({
                type: "success",
                message: '上传成功'
              })
              this.getTempInfo()
              this.showUploadBtn = false
            })

        },
        changeSysId(sysId) {
          this.sysSettings = {}
          this.sysSettings.T_SYS_ID = sysId
        },

        updateSuccess(result) {
          const data = result.OUT_DATA.data
          this.sysSettings.T_SYS_FILE_NAME = data.fileName
          this.sysSettings.T_SYS_FILE_URL = data.fileUrl
          sysApi.updateThesisTemp(this.sysSettings)
            .then(result1 => {
              this.$message({
                type: "success",
                message: '修改成功'
              })
              this.getTempInfo()
              this.clearFiles()
            })
        },

        clearFiles() {
          this.$refs['update-upload'].clearFiles();
        }

      }

    }
</script>

<style scoped>

</style>
