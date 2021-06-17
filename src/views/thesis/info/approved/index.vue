<template>
    <div class="app-container">
      <router-view/>

      <el-form ref="thesis" :inline="true" class="demo-from-inline">

        <el-form-item>
          <el-input v-model="thesis.T_STU_ID" placeholder="作者学号"></el-input>
        </el-form-item>

        <el-form-item>
          <el-input v-model="thesis.T_STU_NAME" placeholder="作者名称"></el-input>
        </el-form-item>

        <el-form-item>
          <el-select v-model="thesis.T_THESIS_STATUS" clearable placeholder="请选择审核状态">
            <el-option
              v-for="item in thesisStatusList"
              :key="item.key"
              :label="item.value"
              :value="item.key">
            </el-option>
          </el-select>
        </el-form-item>

        <el-form-item>
          <el-select v-model="thesis.T_COLLEGE_ID" clearable placeholder="请选择学院信息">
            <el-option
              v-for="item in collegeList"
              :key="item.T_COLLEGE_ID"
              :label="item.T_COLLEGE_NAME"
              :value="item.T_COLLEGE_ID">
            </el-option>
          </el-select>
        </el-form-item>

        <div v-show="showAdvanced">
          <el-form-item label="提交开始时间">
            <el-col :span="11">
              <el-date-picker type="date" placeholder="选择日期" v-model="thesis.T_BEGIN_TIME"></el-date-picker>
            </el-col>
          </el-form-item>

          <el-form-item label="提交结束时间">
            <el-col :span="11">
              <el-date-picker type="date" placeholder="选择日期" v-model="thesis.T_END_TIME"></el-date-picker>
            </el-col>
          </el-form-item>
        </div>

        <el-form-item>
          <el-button type="info" @click="changeShowAdvanced">
            {{showAdvanced ? '收起' : '高级检索'}}
            <i :class="showAdvanced ? 'el-icon-arrow-up' : 'el-icon-arrow-down'"/>
          </el-button>
        </el-form-item>

        <el-form-item>
          <el-button type="primary" icon="el-icon-search" @click="getThesisInfosByCond()">查询</el-button>
        </el-form-item>

        <el-form-item>
          <el-button type="warning" @click="resetData()">清空</el-button>
        </el-form-item>

        <el-form-item>
          <el-button @click="exportThesis()"><svg-icon icon-class="export"/>批量下载</el-button>
        </el-form-item>

      </el-form>

      <el-table
        :data="list"
        border
        fit
        highlight-current-row
        style="width: 100%"
        @selection-change="handlerTableSelect">

        <el-table-column type="selection" width="55"/>

        <el-table-column prop="T_THESIS_ZH_TITLE" label="论文题目" :show-overflow-tooltip='true'></el-table-column>

        <el-table-column prop="T_THESIS_STATUS_NAME" label="论文状态"></el-table-column>

        <el-table-column prop="T_STU_ID" label="学号"></el-table-column>

        <el-table-column prop="T_STU_NAME" label="作者"></el-table-column>

        <el-table-column prop="T_STU_DEGREE_NAME" label="学位"></el-table-column>

        <el-table-column prop="T_COLLEGE_NAME" label="院系"></el-table-column>

        <el-table-column prop="T_CREATE" label="提交时间" :show-overflow-tooltip='true'></el-table-column>

        <el-table-column prop="T_CREATE" label="审核时间" :show-overflow-tooltip='true'></el-table-column>

        <el-table-column  label="操作" align="center" width="250px" fixed="right">
          <template slot-scope="scope">
            <el-button size="mini"  icon="el-icon-edit" circle @click="editThesisInfo(scope.row.T_THESIS_ID)">修改</el-button>

            <el-button type="success" size="mini" icon="el-icon-view" circle @click="viewThesis(scope.row.T_THESIS_ID)">浏览</el-button>

            <el-button type="primary" size="mini" icon="el-icon-s-check" circle @click="dialogFormVisible = true, setApprovedThesisId(scope.row.T_THESIS_ID)">审核</el-button>
          </template>
        </el-table-column>
      </el-table>

      <!-- 审核信息弹出框 -->
      <el-dialog title="论文审核" :visible.sync="dialogFormVisible">
        <el-form :model="approvedThesis">

          <el-form-item label="审核状态">
            <el-select v-model="approvedThesis.T_THESIS_APPR_STATUS" clearable placeholder="请选择">
              <el-option
                v-for="item in statuslist"
                :key="item.key"
                :label="item.value"
                :value="item.key">
              </el-option>
            </el-select>
          </el-form-item>

          <el-form-item label="审核原因">
            <el-input v-model="approvedThesis.T_THESIS_APPR_REASON" size="small" type="textarea" :rows="2"></el-input>
          </el-form-item>

        </el-form>
        <div slot="footer" class="dialog-footer">
          <el-button @click="dialogFormVisible = false">取 消</el-button>
          <el-button type="primary" @click="dialogFormVisible = false, approvedThesisInfo()">确 定</el-button>
        </div>
      </el-dialog>

      <!-- 分页 -->
      <el-pagination
        :current-page="page"
        :page-size="limit"
        :total="total"
        style="padding: 30px 0; text-align: center;"
        layout="total, prev, pager, next, jumper"
        @current-change="getThesisInfo"
      />

    </div>
</template>

<script>
  import collegeApi from '@/api/collegeTutor/college.js'
  import thesisApi from '@/api/thesis/thesis.js'

    export default {
        name: "info",
      data() {
          return {
            thesis: {},
            list: null,
            page: 1,
            limit: 20,
            total: 0,
            collegeList: {},
            BASE_API: process.env.BASE_API,
            showAdvanced: false,
            approvedThesis: {
              T_THESIS_ID: '',
              T_THESIS_APPR_STATUS: '',
              T_THESIS_APPR_REASON: ''
            },  //审核论文信息
            dialogFormVisible: false,
            selectThesisList: {},  //论文批量导出
            selectThesisIdList: [],  //论文批量导出
            statuslist: [
              {
              key: 1,
              value: '审核通过'
              },
              {
                key: 2,
                value: '审核不通过'
              }
            ],
            thesisStatusList: [  //审核状态
              {
                key: 0,
                value: '等待审核'
              },
              {
                key: 1,
                value: '审核通过'
              },
              {
                key: 2,
                value: '审核不通过'
              }
            ]
          }
      },

      created() {
        this.getThesisInfo()
        //获取学院信息
        this.getCollegeInfo()
      },

      methods: {

        getThesisInfo(page = 1) {
          this.page = page
          thesisApi.getThesisList(this.page)
          .then(result => {
            this.list = result.OUT_DATA.data.data
            this.total = result.OUT_DATA.data.total
          })
        },

        getCollegeInfo() {
          collegeApi.getAllCollegeInfo()
            .then(result => {
              this.collegeList = result.OUT_DATA.data
            })
        },

        //浏览论文
        viewThesis(thesisId) {
          window.open(this.BASE_API + '/thesis/previewDoc/' + thesisId, '_blank')
        },

        getThesisInfosByCond(page = 1) {
          this.page = page
          thesisApi.getThesisListByCond(this.page, this.thesis)
          .then(result => {
            this.list = result.OUT_DATA.data.data
            this.total = result.OUT_DATA.data.total
          })
        },

        //清空
        resetData() {
          this.thesis = {}
          this.getThesisInfo();
        },

        changeShowAdvanced() {
          this.showAdvanced = !this.showAdvanced
        },

        //
        setApprovedThesisId(thesisId) {
          this.approvedThesis.T_THESIS_ID = thesisId
        },

        //审核文件
        approvedThesisInfo() {
          thesisApi.approvedThesis(this.approvedThesis)
          .then(result => {
            this.$message({
              type: "success",
              message: "审核成功"
            })
            this.getThesisInfo();
          })
        },

        //处理选中框
        handlerTableSelect(value) {
          this.selectThesisList = value
        },

        exportThesis() {
          this.selectThesisIdList = []

          if (this.selectThesisList.length == null ) {
            this.$message({
              type: 'error',
              "message": '请选择论文信息'
            })
            return
          }
          for (let i = 0; i < this.selectThesisList.length; i++) {
            let thesisId = this.selectThesisList[i].T_THESIS_ID
            this.selectThesisIdList.push(thesisId)
          }

          thesisApi.downloadThesis(this.selectThesisIdList)
          .then(result => {
            if (!result) {
              return
            }
            const link = document.createElement('a')
            let blob = new Blob([result], {type: 'application/zip'})
            link.style.display = 'none';
            link.href = URL.createObjectURL(blob);

            link.setAttribute('download', '论文信息' + '.zip')
            document.body.appendChild(link)
            link.click()
            document.body.removeChild(link)
          })
        },

        editThesisInfo(thesisId) {
          this.$router.push({path: '/thesis/info/edit/' + thesisId})
        }

      }
    }
</script>

<style scoped>

</style>
