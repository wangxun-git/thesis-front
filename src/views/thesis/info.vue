<template>
    <div class="app-container">

      <el-form ref="thesis" :inline="true" class="demo-from-inline">

        <el-form-item>
          <el-input v-model="thesis.T_STU_ID" placeholder="作者学号"></el-input>
        </el-form-item>

        <el-form-item>
          <el-input v-model="thesis.T_STU_NAME" placeholder="作者名称"></el-input>
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

      </el-form>

      <el-table
        :data="list"
        border
        fit
        highlight-current-row>

        <el-table-column prop="T_THESIS_ZH_TITLE" label="论文中文标题"></el-table-column>

        <el-table-column prop="T_THESIS_STATUS_NAME" label="论文状态"></el-table-column>

        <el-table-column prop="T_STU_ID" label="学号"></el-table-column>

        <el-table-column prop="T_STU_NAME" label="作者"></el-table-column>

        <el-table-column prop="T_STU_DEGREE_NAME" label="学位"></el-table-column>

        <el-table-column prop="T_COLLEGE_NAME" label="院系"></el-table-column>

        <el-table-column prop="T_CREATE" label="提交时间"></el-table-column>

        <el-table-column prop="T_CREATE" label="审核时间"></el-table-column>

        <el-table-column  label="操作" align="center" width="150px">
          <template slot-scope="scope">
            <el-button size="mini"  icon="el-icon-edit" circle >修改</el-button>

            <el-button type="success" size="mini" icon="el-icon-view" circle @click="viewThesis(scope.row.T_THESIS_ID)">浏览</el-button>
          </template>
        </el-table-column>

      </el-table>

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
            showAdvanced: false
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
            console.log(result)
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
        }

      }
    }
</script>

<style scoped>

</style>
