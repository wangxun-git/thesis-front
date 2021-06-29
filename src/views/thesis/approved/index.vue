<template>

  <div class="app-container">
    <router-view/>
    <!-- 步骤条 -->
    <el-steps :active="active">
      <el-step title="论文提交" icon="el-icon-upload"></el-step>
      <el-step title="导师审核" icon="el-icon-edit-outline"></el-step>
      <el-step title="研究院审核" icon="el-icon-edit-outline"></el-step>
      <el-step title="论文编目" icon="el-icon-circle-check"></el-step>
    </el-steps>

    <div v-show="showThesisInfo">
        <el-form>

          <el-form-item label="学号" :label-width="formWidth">
            <el-input v-model="thesis.T_STU_ID" class="input-width" :disabled="editThesis"/>
          </el-form-item>

          <el-form-item label="学院名称" :label-width="formWidth">
            <el-select v-model="thesis.T_COLLEGE_ID" clearable placeholder="请选择学院信息" @change="handlerCollegeChange()" :disabled="editThesis">
              <el-option
                v-for="item in collegeList"
                :key="item.T_COLLEGE_ID"
                :label="item.T_COLLEGE_NAME"
                :value="item.T_COLLEGE_ID">
              </el-option>
            </el-select>
          </el-form-item>

          <el-form-item label="专业名称" :label-width="formWidth">
            <el-select v-model="thesis.T_MAJOR_ID" clearable placeholder="请选择专业信息" :disabled="editThesis">
              <el-option
                v-for="item in majorList"
                :key="item.T_MAJOR_ID"
                :label="item.T_MAJOR_NAME"
                :value="item.T_MAJOR_ID">
              </el-option>
            </el-select>
          </el-form-item>

          <el-form-item label="答辩日期" :label-width="formWidth">
            <el-col :span="11">
              <el-date-picker type="date" placeholder="选择日期" v-model="thesis.T_THESIS_DEFENCE_TIME" :disabled="editThesis"></el-date-picker>
            </el-col>
          </el-form-item>

          <el-form-item label="学位年度" :label-width="formWidth">
            <el-date-picker
              v-model="thesis.T_THESIS_FIN_TIME"
              type="year"
              value-format="yyyy"
              placeholder="选择年" :disabled="editThesis">
            </el-date-picker>
          </el-form-item>

          <el-form-item label="导师" :label-width="formWidth">
            <el-input v-model="thesis.T_TUTOR_NAME" class="input-width" placeholder="请使用;号分隔" :disabled="editThesis"></el-input>
          </el-form-item>

          <el-form-item label="学科" :label-width="formWidth">
            <el-cascader
              v-model="subjectCode"
              :options="options"
              @change="handleChange"
              @active-item-change="handleExpandChange"
              clearable
              :placeholder="subjectName"
              :disabled="editThesis"/>
          </el-form-item>

          <el-form-item label="研究方向" :label-width="formWidth">
            <el-input v-model="thesis.T_RESEARCH_DIRE" class="input-width" placeholder="上传论文后可自动回显" :disabled="editThesis"></el-input>
          </el-form-item>

          <el-form-item label="论文题目" :label-width="formWidth">
            <el-input v-model="thesis.T_THESIS_ZH_TITLE" class="input-width" placeholder="上传论文后可自动回显" :disabled="editThesis"></el-input>
          </el-form-item>

          <el-form-item label="英文题目" :label-width="formWidth">
            <el-input v-model="thesis.T_THESIS_EN_TITLE" class="input-width" :disabled="editThesis"></el-input>
          </el-form-item>

          <el-form-item label="关键词" :label-width="formWidth">
            <el-input v-model="thesis.T_THESIS_ZH_KEY" class="input-width" placeholder="上传论文后可自动回显" :disabled="editThesis"/>
          </el-form-item>

          <el-form-item label="英文关键词" :label-width="formWidth">
            <el-input v-model="thesis.T_THESIS_EN_KEY" class="input-width" placeholder="上传论文后可自动回显" :disabled="editThesis"/>
          </el-form-item>

          <el-form-item label="论文总页数" :label-width="formWidth">
            <el-input v-model="thesis.T_THESIS_PAGE_NUMBER" :disabled="editThesis"></el-input>
          </el-form-item>

          <el-form-item label="摘要"/>
          <el-form-item label="摘要">
            <tinymce :height="200" v-model="thesis.T_THESIS_ZH_ABSTRACT" :disabled="editThesis"></tinymce>
          </el-form-item>

          <!--        <el-form-item label="培养层级">-->
          <!--          <el-radio-group v-model="level">-->
          <!--            <el-radio :label="item.T_STU_TYPE_ID" :key="item.T_STU_TYPE_ID" v-for="item in levellist" @change="handlerLevelChange()">-->
          <!--              {{item.T_STU_TYPE_ZH_NAME}}-->
          <!--            </el-radio>-->
          <!--          </el-radio-group>-->
          <!--        </el-form-item>-->
          <el-form-item label="英文摘要"/>
          <el-form-item label="英文摘要">
            <tinymce :height="200" v-model="thesis.T_THESIS_EN_ABSTRACT" :disabled="editThesis"></tinymce>
          </el-form-item>

          <el-form-item v-show="showButton">
            <el-upload
              :headers="headers"
              :before-remove="beforeRemove"
              :limit="1"
              :on-success="uploadSuccess"
              :action="BASE_API+'/thesis/uploadThesis'">
              <el-button icon="el-icon-upload" type="success" round>论文上传</el-button>
              <template #tip >
                <div class="el-upload__tip">论文格式为[学号+姓名+学院名称+论文名称],且格式为PDF格式</div>
              </template>
            </el-upload>
          </el-form-item>

          <el-button type="success" round @click="updateThesisInfo()" v-show="showButton">保存</el-button>

        </el-form>
    </div>

    <el-button type="success" :icon="iconButton" class="viewThesis" round @click="changeShow()">查看论文信息</el-button>
  </div>

</template>

<script>
  //引入富文本编译器
  import Tinymce from '@/components/Tinymce'
  import { mapGetters } from 'vuex'
  import thesisApi from '@/api/thesis/thesis.js'
  import collegeApi from '@/api/collegeTutor/college.js'
  import majorApi from '@/api/collmajor/major.js'
  import { getToken } from '@/utils/auth'
  import subjectApi from '@/api/subject/subject'

    export default {
      components: { Tinymce },
      name: "approved",
      computed: {
        ...mapGetters({
          userId: 'id'
        })
      },

      data() {
          return {
            active: 2,
            showThesisInfo: false,
            editInput: false,
            thesis: {
              T_THESIS_ID: '',
              T_STU_ID: '',
              T_COLLEGE_ID: '',
              T_TUTOR_NAME: '',
              T_MAJOR_ID: '',
              T_SUBJECT_CODE: '',
              T_RESEARCH_DIRE: '',
              T_THESIS_ZH_TITLE: '',
              T_THESIS_EN_TITLE: '',
              T_THESIS_ZH_KEY: '',
              T_THESIS_EN_KEY: '',
              T_THESIS_ZH_ABSTRACT: '',
              T_THESIS_EN_ABSTRACT: '',
              T_THESIS_FILE: '',
              T_THESIS_URL: '',
              T_THESIS_DEFENCE_TIME: '',  //论文答辩日期
              T_THESIS_PAGE_NUMBER: '',
              T_THESIS_FIN_TIME: ''
            },
            iconButton: 'el-icon-caret-bottom',
            page: 1,
            major: {},
            collegeList: {},
            majorList: {},
            editThesis: true,
            showButton: false,
            headers: {token: getToken()},
            BASE_API: process.env.BASE_API,
            updateThesis: {
              T_STU_ID: ''
            },
            formWidth: '90px',
            level: 0,  //学科等级
            options: [],  //学科信息
            subject: {},
            subjectCode: '',
            subjectName: 'asd'
          }
      },

      created() {
        //获取学院信息
        this.getCollegeInfo()

      },

      mounted() {
        //初始化获取学科信息
        this.getSubjectInfo()
        //获取登录用户的论文信息
        this.getThesisInfoByStuId()
        //判断登录用户是否提交论文，论文所处状态
        this.getThesisStatusInfo()
      },

      methods: {

        getSubjectInfo() {
          subjectApi.getSubjectByLevel(this.level)
            .then(result => {
              const data = result.OUT_DATA.data
              let pList = []
              for (var i = 0; i < data.length; i++) {
                let List = []
                pList.push({ value: data[i].T_SUBJECT_CODE, label: data[i].T_SUBJECT_NAME, children: List })
              }
              this.options = pList
            })
        },

        //删除上传的论文
        beforeRemove(file, fileList){
          return this.$confirm(`确定移除 ${ file.name }？`,'提示',{
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            type: 'warning'
          });
        },

        uploadSuccess(response) {
          const code = response.RETURN_CODE
          if (code !== 10000) {
            this.$message({
              type: "error",
              message: response.RETURN_MSG,
              duration: 5 * 1000
            })
          }else {
            this.$message({
              type: "success",
              message: "添加成功"
            })
            this.thesis.T_THESIS_FILE = data.filename;
            this.thesis.T_THESIS_URL = data.thesisUrl
          }
        },

        getThesisStatusInfo() {
          thesisApi.getThesisStatus()
            .then(result => {
              const data = result.OUT_DATA.data
              if (2 === data || 7 == data) {  //审核不通过，给予修改权限
                //跳转页面
                this.editThesis = false
                this.showButton = true
                if (7 == data) {
                  this.active = 3
                }
              }else if (0 == data || 1 == data){
                this.active = 2
              }else if (3 == data || 4 == data) {
                this.$router.push({path: '/thesis/catalogue'})
              }else {
                this.active = 3
              }
            })
        },

        getCollegeInfo() {
          collegeApi.getAllCollegeInfo()
            .then(result => {
              this.collegeList = result.OUT_DATA.data
            })
        },

        //选择学院之后初始化专业信息
        handlerCollegeChange() {
          this.majorList = {}
          this.major.T_COLLEGE_ID = this.thesis.T_COLLEGE_ID
          majorApi.getMajorInfoByCond(this.major)
            .then(result => {
              this.majorList = result.OUT_DATA.data
            })
        },

        getThesisInfoByStuId(page = 1) {
          this.thesis.T_STU_ID = this.userId
          this.page = page
          thesisApi.getThesisListByCond(this.page, this.thesis)
          .then(result => {
            const data = result.OUT_DATA.data.data
            this.thesis = data[0]
            this.handlerCollegeChange()
            this.subjectName = data[0].T_SUBJECT_NAME
            this.thesis.T_MAJOR_ID = data[0].T_MAJOR_ID
            //查询审核原因
            if (2 == this.thesis.T_THESIS_STATUS || 7 == this.thesis.T_THESIS_STATUS) {
              thesisApi.getNotPassThesisAppr(this.thesis.T_THESIS_ID)
                .then(result1 => {
                  console.log('++++++')

                  const data = result1.OUT_DATA.data
                  //弹出通知框
                  this.$notify({
                    title: '审核通知',
                    message: '您的论文未通过审核；原因：' + data.T_THESIS_APPR_REASON ,
                    type: 'warning'
                  });
                })
            }else if (0 == this.thesis.T_THESIS_STATUS || 5 == this.thesis.T_THESIS_STATUS) {
              this.$notify({
                title: '审核通知',
                message: '您的论文正在审核中......',
                type: 'info'
              });
            } else {
              this.$notify({
                title: '审核通知',
                message: '恭喜您的论文通过审核' ,
                type: 'success'
              });
            }
          })
        },

        changeShow() {
          this.showThesisInfo = !this.showThesisInfo
          if (this.showThesisInfo) {
            this.iconButton = 'el-icon-caret-top'
          }else {
            this.iconButton = 'el-icon-caret-bottom'
          }
        },

        updateThesisInfo() {
          thesisApi.updateThesis(this.thesis)
          .then(result => {
            this.$message({
              type: "success",
              message: "修改成功"
            })
            this.updateThesis.T_STU_ID = this.thesis.T_STU_ID
            thesisApi.getThesisListByCond(this.page, this.updateThesis)
              .then(result => {
                const data = result.OUT_DATA.data.data
                this.thesis = data[0]
                this.handlerCollegeChange()
                this.thesis.T_MAJOR_ID = data[0].T_MAJOR_ID
                //不可再次修改
                this.editThesis = false
                this.showButton = true
              })
          })
        },

        //处理学科代码
        handleChange(value) {
          let code = value[2]
          this.thesis.T_SUBJECT_CODE = code
        },

        handleExpandChange(value) {
          if (value.length > 2) {
            return
          }
          this.subject = {}
          this.subject.T_SUBJECT_CODE = value[value.length - 1]
          subjectApi.getSubjectByCond(this.subject)
            .then(result => {
              const data = result.OUT_DATA.data
              let level = data.T_SUBJECT_LEVEL
              let pList = []
              for (var i = 0; i < data.T_CHILDREN_SUBJECT_LIST.length; i++) {
                if (0 == level) {
                  let List = []
                  pList.push({ value: data.T_CHILDREN_SUBJECT_LIST[i].T_SUBJECT_CODE, label: data.T_CHILDREN_SUBJECT_LIST[i].T_SUBJECT_NAME, children: List })
                }
                if (1 == level) {
                  pList.push({ value: data.T_CHILDREN_SUBJECT_LIST[i].T_SUBJECT_CODE, label: data.T_CHILDREN_SUBJECT_LIST[i].T_SUBJECT_NAME })
                }
              }
              //遍历第一级选择器
              for (var i = 0; i < this.options.length; i++) {
                if (0 == level) {
                  if (this.subject.T_SUBJECT_CODE = this.options[i].value) {
                    this.options[i].children = pList
                  }
                }
                if (1 == level) {
                  //遍历二级选择器
                  for (var j = 0; j < this.options[i].children.length; j++) {
                    if (this.subject.T_SUBJECT_CODE = this.options[i].children[j].value) {
                      this.options[i].children[j].children = pList
                    }
                  }
                }
              }
            })
        }

      }
    }
</script>

<style scoped>
  .viewThesis {
    position: relative;
    left: 45%;
    top: -2px;
  }

  .tinymce-container {
    line-height: 29px;
  }
</style>
