<template>
  <div class="app-container">
    <router-view/>

    <el-form ref="thesis" :inline="true" class="demo-from-inline">

      <el-form-item>
        <el-input v-model="thesis.T_STU_ID" clearable placeholder="作者学号"></el-input>
      </el-form-item>

      <el-form-item>
        <el-input v-model="thesis.T_STU_NAME" clearable placeholder="作者名称"></el-input>
      </el-form-item>

      <el-form-item>
        <el-input v-model="thesis.T_THESIS_ZH_TITLE" clearable placeholder="论文题目"></el-input>
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

      <el-table-column prop="T_THESIS_ZH_TITLE" label="论文题目" :show-overflow-tooltip='true' align="center"></el-table-column>

      <el-table-column prop="T_THESIS_STATUS_NAME" label="论文状态" align="center" width="150px"/>

      <el-table-column prop="T_STU_ID" label="学号" align="center"></el-table-column>

      <el-table-column prop="T_STU_NAME" label="作者" align="center" width="70px"></el-table-column>

      <el-table-column prop="T_STU_DEGREE_NAME" label="学位" align="center"></el-table-column>

      <el-table-column prop="T_COLLEGE_NAME" label="院系" align="center"></el-table-column>

      <el-table-column prop="T_CREATE" label="提交时间" :show-overflow-tooltip='true' align="center"></el-table-column>

      <el-table-column prop="T_THESIS_STATUS" label="审核/编目时间" :show-overflow-tooltip='true' align="center">
        <template slot-scope="scope">
          {{scope.row.T_THESIS_STATUS <= 2 ? scope.row.T_CREATE : scope.row.T_CATA_TIME}}
        </template>
      </el-table-column>

      <el-table-column  label="操作" align="center" width="280px" fixed="right">
        <template slot-scope="scope">
          <el-button type="success" size="mini" icon="el-icon-view" circle @click="viewThesis(scope.row.T_THESIS_ID)">浏览</el-button>

          <el-button v-if="scope.row.T_THESIS_STATUS == 4" type="primary" size="mini" icon="el-icon-s-check" circle
                     @click="dialogVisUp = true, showCollUp = false, getThesisCollInfo(scope.row.T_THESIS_ID)">查看编目</el-button>

          <el-button v-if="roles == 'library-admin' && scope.row.T_THESIS_STATUS == 4" type="info" size="mini" icon="el-icon-edit" circle
                     @click="dialogVisUp = true, showCollUp = true, getThesisCollInfo(scope.row.T_THESIS_ID)">
            修改编目
          </el-button>

          <el-button v-if="roles == 'library-admin' && scope.row.T_THESIS_STATUS == 3" type="primary" size="mini" icon="el-icon-s-check" circle
                     @click="dialogFormVisible = true, setThesisCollThesisId(scope.row.T_THESIS_ID)">
            编目
          </el-button>

        </template>
      </el-table-column>
    </el-table>

    <!-- 编目信息 -->
    <el-dialog title="论文编目信息" :visible.sync="dialogVisUp">
      <el-form :model="thesisCollUp">
        <el-form-item label="保密级别">
          <el-select v-model="thesisCollUp.T_SECRECY_LEVEL" clearable placeholder="请选择保密级别" :disabled="!showCollUp">
            <el-option
              v-for="item in secrecyList"
              :key="item.key"
              :label="item.value"
              :value="item.key">
            </el-option>
          </el-select>
        </el-form-item>

        <el-form-item label="开放时间">
          <el-date-picker
            v-model="thesisCollUp.T_THESIS_OPEN_TIME"
            type="date"
            placeholder="选择日期"
            :disabled="!showCollUp">
          </el-date-picker>
        </el-form-item>

        <el-form-item label="馆藏号" :required="true">
          <el-input clearable v-model="thesisCollUp.T_THESIS_COLL_CODE" :disabled="!showCollUp"/>
        </el-form-item>

      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogVisUp = false" v-if="showCollUp">取 消</el-button>
        <el-button type="primary" v-if="showCollUp" @click="updateThesisCollInfo()">确 定</el-button>
      </div>
    </el-dialog>

    <!-- 编目信息弹出框 -->
    <el-dialog title="论文编目" :visible.sync="dialogFormVisible">
      <el-form :model="thesisColl">
        <el-form-item label="保密级别">
          <el-select v-model="thesisColl.T_SECRECY_LEVEL" clearable placeholder="请选择保密级别">
            <el-option
              v-for="item in secrecyList"
              :key="item.key"
              :label="item.value"
              :value="item.key">
            </el-option>
          </el-select>
        </el-form-item>

        <el-form-item label="开放时间">
          <el-date-picker
            v-model="thesisColl.T_THESIS_OPEN_TIME"
            type="date"
            placeholder="选择日期">
          </el-date-picker>
        </el-form-item>

        <el-form-item label="馆藏号">
          <el-input clearable v-model="thesisColl.T_THESIS_COLL_CODE"></el-input>
        </el-form-item>

      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisible = false">取 消</el-button>
        <el-button type="primary" @click="dialogFormVisible = false, saveThesisCollInfo()">确 定</el-button>
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
  import { mapGetters } from 'vuex'

  export default {
    name: "info",
    computed: {
      ...mapGetters([
        'roles'
      ])
    },
    data() {
      return {
        thesis: {},
        list: null,
        page: 1,
        limit: 20,
        total: 0,
        collegeList: {},
        showAdvanced: false,
        dialogFormVisible: false,
        dialogVisUp: false,
        BASE_API: process.env.BASE_API,
        selectThesisList: {},  //论文批量导出
        selectThesisIdList: [],  //论文批量导出
        thesisColl: {
          T_THESIS_ID: '',
          T_SECRECY_LEVEL: '',
          T_THESIS_COLL_CODE: '',
          T_THESIS_RES_TYPE: '',
          T_THESIS_OPEN_TIME: ''
        },  //论文馆藏
        thesisCollUp: {},
        showCollUp: true,
        thesisStatusList: [  //审核状态
          {
            key: 3,
            value: '等待编目'
          },
          {
            key: 4,
            value: '编目完成'
          }
        ],
        secrecyList: [  //保密级别
          {
            key: 0,
            value: '公开'
          },
          {
            key: 1,
            value: '内部'
          },
          {
            key: 2,
            value: '秘密、机密'
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
        thesisApi.getCataThesisList(this.page)
          .then(result => {
            console.log(result.OUT_DATA.data.data)
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
        console.log(thesisId)
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
      setThesisCollThesisId(thesisId) {
        this.thesisColl.T_THESIS_ID = thesisId
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

      //保存编目信息
      saveThesisCollInfo() {
        thesisApi.saveThesisColl(this.thesisColl)
        .then(result => {
          this.$message({
            type: 'success',
            message: '编目成功'
          })
        })
        this.getThesisInfo()
      },

      getThesisCollInfo(thesisId) {
        this.thesisCollUp.T_THESIS_ID = thesisId
        thesisApi.getThesisColl(this.thesisCollUp)
        .then(result => {
          this.thesisCollUp = result.OUT_DATA.data
        })
      },

      //修改编目信息
      updateThesisCollInfo() {
        thesisApi.updateThesisColl(this.thesisCollUp)
        .then(result => {
          this.$message({
            type: 'success',
            message: '修改成功'
          })
          this.dialogVisUp = false
        })
      }

    }
  }
</script>

<style scoped>

</style>
