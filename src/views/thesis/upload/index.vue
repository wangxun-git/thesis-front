<template>
    <div class="app-container">
      <router-view/>

      <!-- 步骤条 -->
      <el-steps :active="1">
        <el-step title="论文提交" icon="el-icon-upload"></el-step>
        <el-step title="论文审核" icon="el-icon-edit-outline"></el-step>
        <el-step title="论文归档" icon="el-icon-circle-check"></el-step>
      </el-steps>

      <el-form>

        <el-form-item>
          <el-upload
            :headers="headers"
            :before-remove="beforeRemove"
            :limit="1"
            :on-success="uploadSuccess"
            :action="BASE_API+'/thesis/uploadThesis'">
            <el-button icon="el-icon-upload" type="success" round>论文上传</el-button>
            <template #tip>
              <div class="el-upload__tip">论文格式为[学号+姓名+学院名称+论文名称],且格式为PDF格式</div>
            </template>
          </el-upload>
        </el-form-item>

        <el-form-item label="学号">
          <el-input v-model="thesis.T_STU_ID" clearable class="input-width" placeholder="上传论文后可自动回显"/>
        </el-form-item>

        <el-form-item label="学院名称">
          <el-select v-model="thesis.T_COLLEGE_ID" clearable placeholder="请选择学院信息" @change="handlerCollegeChange()">
            <el-option
              v-for="item in collegeList"
              :key="item.T_COLLEGE_ID"
              :label="item.T_COLLEGE_NAME"
              :value="item.T_COLLEGE_ID">
            </el-option>
          </el-select>
        </el-form-item>

        <el-form-item label="专业名称">
          <el-select v-model="thesis.T_MAJOR_ID" clearable placeholder="请选择专业信息">
            <el-option
              v-for="item in majorList"
              :key="item.T_MAJOR_ID"
              :label="item.T_MAJOR_NAME"
              :value="item.T_MAJOR_ID">
            </el-option>
          </el-select>
        </el-form-item>

        <el-form-item label="论文答辩日期">
          <el-col :span="11">
            <el-date-picker type="date" placeholder="选择日期" v-model="thesis.T_THESIS_DEFENCE_TIME"></el-date-picker>
          </el-col>
        </el-form-item>

        <el-form-item label="学位年度">
          <el-date-picker
            v-model="thesis.T_THESIS_FIN_TIME"
            type="year"
            value-format="yyyy"
            placeholder="选择年">
          </el-date-picker>
        </el-form-item>

        <el-form-item label="导师">
          <el-input v-model="thesis.T_TUTOR_NAME" class="input-width" placeholder="请使用;号分隔"></el-input>
        </el-form-item>

        <el-form-item label="研究方向">
          <el-input v-model="thesis.T_RESEARCH_DIRE" class="input-width" placeholder="上传论文后可自动回显"></el-input>
        </el-form-item>

        <el-form-item label="论文题目">
          <el-input v-model="thesis.T_THESIS_ZH_TITLE" class="input-width" placeholder="上传论文后可自动回显"></el-input>
        </el-form-item>

        <el-form-item label="英文题目">
          <el-input v-model="thesis.T_THESIS_EN_TITLE" class="input-width"></el-input>
        </el-form-item>

        <el-form-item label="关键词">
          <el-input v-model="thesis.T_THESIS_ZH_KEY" class="input-width" placeholder="上传论文后可自动回显"/>
        </el-form-item>

        <el-form-item label="英文关键词">
          <el-input v-model="thesis.T_THESIS_EN_KEY" class="input-width" placeholder="上传论文后可自动回显"/>
        </el-form-item>

        <el-form-item label="摘要(上传论文后可自动回显)"/>
        <el-form-item label="摘要">
          <tinymce :height="200" v-model="thesis.T_THESIS_ZH_ABSTRACT"></tinymce>
        </el-form-item>

<!--        <el-form-item label="培养层级">-->
<!--          <el-radio-group v-model="level">-->
<!--            <el-radio :label="item.T_STU_TYPE_ID" :key="item.T_STU_TYPE_ID" v-for="item in levellist" @change="handlerLevelChange()">-->
<!--              {{item.T_STU_TYPE_ZH_NAME}}-->
<!--            </el-radio>-->
<!--          </el-radio-group>-->
<!--        </el-form-item>-->
        <el-form-item label="英文摘要(上传论文后可自动回显)"/>
        <el-form-item label="英文摘要">
          <tinymce :height="200" v-model="thesis.T_THESIS_EN_ABSTRACT"></tinymce>
        </el-form-item>

        <el-form-item label="论文总页数">
          <el-input v-model="thesis.T_THESIS_PAGE_NUMBER"></el-input>
        </el-form-item>

        <el-form-item>
          <el-button type="success" @click="submitThesisInfo()" round>提交</el-button>
        </el-form-item>
      </el-form>

    </div>
</template>

<script>

  import thesisApi from '@/api/thesis/thesis.js'
  import collegeApi from '@/api/collegeTutor/college.js'
  import majorApi from '@/api/collmajor/major.js'
  import studentApi from '@/api/custome/student.js'
  import { getToken } from '@/utils/auth'
  //引入富文本编译器
  import Tinymce from '@/components/Tinymce'

    export default {
      components: { Tinymce },
      name: "submit",
      data() {
          return {
            thesis: {
              T_STU_ID: '',
              T_COLLEGE_ID: '',
              T_TUTOR_NAME: '',
              T_MAJOR_ID: '',
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
            // level: '',
            major: {},
            collegeList: {},
            majorList: {},
            // levellist: {},
            headers: {token: getToken()},
            BASE_API: process.env.BASE_API
          }
      },

      created() {
        //获取学院信息
        this.getCollegeInfo()
        // this.getStuTypeInfo()
        //判断登录用户是否提交论文，论文所处状态
        this.getThesisStatusInfo()
      },

      methods: {
        getCollegeInfo() {
          collegeApi.getAllCollegeInfo()
            .then(result => {
              this.collegeList = result.OUT_DATA.data
            })
        },

        getThesisStatusInfo() {
          thesisApi.getThesisStatus()
          .then(result => {
            const data = result.OUT_DATA.data
            if (0 === data) {
              //跳转页面
              this.$router.push({path: '/thesis/approved'})
            }else if (1 == data || 2 == data) {
              this.$router.push({path: '/thesis/approved'})
            }else if (3 == data || 4 == data) {
              this.$router.push({path: '/thesis/catalogue'})
            }
          })
        },

        // //初始化培养层级信息
        // getStuTypeInfo() {
        //   studentApi.getStuTypeInfo()
        //     .then(result => {
        //       this.levellist = result.OUT_DATA.data
        //     })
        // },

        //选择学院之后初始化专业信息
        handlerCollegeChange() {
          this.majorList = {}
          this.major.T_COLLEGE_ID = this.thesis.T_COLLEGE_ID
          majorApi.getMajorInfoByCond(this.major)
            .then(result => {
              this.thesis.T_MAJOR_ID = ''
              this.majorList = result.OUT_DATA.data
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
            //回显文件中的关键词、摘要等信息
            const data = response.OUT_DATA.data
            if (this.thesis.T_STU_ID == null || this.thesis.T_STU_ID == '') {
              this.thesis.T_STU_ID = data.stuId
            }
            if (this.thesis.T_COLLEGE_ID = null || this.thesis.T_COLLEGE_ID == '') {
              this.thesis.T_COLLEGE_ID = data.collegeId
              this.handlerCollegeChange()
            }
            if (this.thesis.T_RESEARCH_DIRE == null || this.thesis.T_RESEARCH_DIRE == '') {
              this.thesis.T_RESEARCH_DIRE = data.researchDir;
            }
            if (this.thesis.T_THESIS_EN_KEY == null || this.thesis.T_THESIS_EN_KEY == '') {
              this.thesis.T_THESIS_EN_KEY = data.enKeyWords;
            }
            if (this.thesis.T_THESIS_ZH_KEY == null || this.thesis.T_THESIS_ZH_KEY == '') {
              this.thesis.T_THESIS_ZH_KEY = data.zhKeyWords
            }
            if (this.thesis.T_THESIS_ZH_ABSTRACT == null || this.thesis.T_THESIS_ZH_ABSTRACT == '') {
              this.thesis.T_THESIS_ZH_ABSTRACT = data.zhAbstract
            }
            if (this.thesis.T_THESIS_EN_ABSTRACT == null || this.thesis.T_THESIS_EN_ABSTRACT == '') {
              this.thesis.T_THESIS_EN_ABSTRACT = data.enAbstract
            }
            if (this.thesis.T_THESIS_EN_ABSTRACT == null || this.thesis.T_THESIS_EN_ABSTRACT == '') {
              this.thesis.T_THESIS_EN_ABSTRACT = data.enAbstract
            }
            if (this.thesis.T_THESIS_ZH_TITLE == null || this.thesis.T_THESIS_ZH_TITLE == '') {
              this.thesis.T_THESIS_ZH_TITLE = data.zhTitle
            }
            if (this.thesis.T_THESIS_PAGE_NUMBER == null || this.thesis.T_THESIS_PAGE_NUMBER == '') {
              this.thesis.T_THESIS_PAGE_NUMBER = data.page
            }
            this.thesis.T_THESIS_FILE = data.filename;
            this.thesis.T_THESIS_URL = data.thesisUrl
          }
        },

        submitThesisInfo() {
          thesisApi.submitThesis(this.thesis)
          .then(result => {
            this.$message({
              type: "success",
              message: "提交成功"
            })
            //跳转页面
            this.$router.push({path: '/thesis/approved'})
          })
        }

      }
    }
</script>

<style scoped>
  .tinymce-container {
    line-height: 29px;
  }
  .input-width {
    width: 70%;
  }
</style>
