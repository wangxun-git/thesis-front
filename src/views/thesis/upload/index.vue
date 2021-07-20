<template>
    <div class="app-container">
      <router-view/>

      <!-- 步骤条 -->
      <el-steps :active="1">
        <el-step title="论文提交" icon="el-icon-upload"></el-step>
        <el-step title="导师审核" icon="el-icon-edit-outline"></el-step>
        <el-step title="研究院审核" icon="el-icon-edit-outline"></el-step>
        <el-step title="论文编目" icon="el-icon-circle-check"></el-step>
      </el-steps>

      <el-form>

        <el-form-item>
          <el-upload
            :headers="headers"
            :before-remove="beforeRemove"
            :on-remove="onRemove"
            :limit="1"
            :on-success="uploadSuccess"
            :action="BASE_API+'/thesis/uploadThesis'">
            <el-button icon="el-icon-upload" type="success" round>论文上传</el-button>
            <template #tip>
              <div class="el-upload__tip">论文格式为[学号+姓名+学院名称+论文名称],且格式为PDF格式</div>
            </template>
          </el-upload>
        </el-form-item>

        <el-form-item label="学号" :label-width="formWidth">
          <el-input v-model="thesis.T_STU_ID" clearable class="input-width" placeholder="上传论文后可自动回显" @input="change($event)"/>
        </el-form-item>

        <el-form-item label="学院名称" :label-width="formWidth">
          <el-select v-model="thesis.T_COLLEGE_ID" clearable placeholder="请选择学院信息" @change="handlerCollegeChange()">
            <el-option
              v-for="item in collegeList"
              :key="item.T_COLLEGE_ID"
              :label="item.T_COLLEGE_NAME"
              :value="item.T_COLLEGE_ID">
            </el-option>
          </el-select>
        </el-form-item>

        <el-form-item label="专业名称" :label-width="formWidth">
          <el-select v-model="thesis.T_MAJOR_ID" clearable placeholder="请选择专业信息" @change="handleMajorChange">
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
            <el-date-picker type="date" placeholder="选择日期" v-model="thesis.T_THESIS_DEFENCE_TIME" @input="change($event)"/>
          </el-col>
        </el-form-item>

        <el-form-item label="学位年度" :label-width="formWidth">
          <el-date-picker
            v-model="thesis.T_THESIS_FIN_TIME"
            type="year"
            value-format="yyyy"
            placeholder="选择年"
            @input="change($event)">
          </el-date-picker>
        </el-form-item>

        <el-form-item label="分类号" :label-width="formWidth">
          <el-input v-model="thesis.T_CH_LIB_CLASS" class="input-width" placeholder="上传论文后可自动回显" @input="change($event)"/>
        </el-form-item>

        <el-form-item label="导师" :label-width="formWidth">
          <el-input v-model="thesis.T_TUTOR_NAME" class="input-width" placeholder="请使用;号分隔" @input="change($event)"/>
        </el-form-item>

        <el-form-item label="学科" :label-width="formWidth">
          <el-cascader
            v-model="subjectCode"
            :options="options"
            @change="handleChange"
            @active-item-change="handleExpandChange"
            clearable
            :placeholder="subjectValue"
            @input="change($event)"
            width="100px"/>
        </el-form-item>

        <el-form-item label="保密程度" :label-width="formWidth">
          <el-select v-model="secercyValue" clearable placeholder="请选择保密程度" @change="handlerSecercyChange" @input="change($event)">
            <el-option
              v-for="item in secrecyLevel"
              :key="item.id"
              :label="item.value"
              :value="item.id">
            </el-option>
          </el-select>
        </el-form-item>

        <el-form-item label="研究方向" :label-width="formWidth">
          <el-input v-model="thesis.T_RESEARCH_DIRE" class="input-width" placeholder="上传论文后可自动回显" @input="change($event)"/>
        </el-form-item>

        <el-form-item label="论文题目" :label-width="formWidth">
          <el-input v-model="thesis.T_THESIS_ZH_TITLE" class="input-width" placeholder="上传论文后可自动回显" @input="change($event)"/>
        </el-form-item>

        <el-form-item label="英文题目" :label-width="formWidth">
          <el-input v-model="thesis.T_THESIS_EN_TITLE" class="input-width" placeholder="上传论文后可自动回显" @input="change($event)"/>
        </el-form-item>

        <el-form-item label="关键词" :label-width="formWidth">
          <el-input v-model="thesis.T_THESIS_ZH_KEY" class="input-width" placeholder="上传论文后可自动回显" @input="change($event)"/>
        </el-form-item>

        <el-form-item label="英文关键词" :label-width="formWidth">
          <el-input v-model="thesis.T_THESIS_EN_KEY" class="input-width" placeholder="上传论文后可自动回显" @input="change($event)"/>
        </el-form-item>

        <el-form-item label="论文页数" :label-width="formWidth">
          <el-input v-model="thesis.T_THESIS_PAGE_NUMBER" @input="change($event)"/>
        </el-form-item>

        <el-form-item label="摘要(上传论文后可自动回显)"/>
        <el-form-item label="摘要">
          <tinymce :height="200" v-model="thesis.T_THESIS_ZH_ABSTRACT"/>
        </el-form-item>

        <el-form-item label="英文摘要(上传论文后可自动回显)"/>
        <el-form-item label="英文摘要">
          <tinymce :height="200" v-model="thesis.T_THESIS_EN_ABSTRACT"/>
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
  import subjectApi from '@/api/subject/subject'
  //引入富文本编译器
  import Tinymce from '@/components/Tinymce'

  export default {
    components: {Tinymce},
    inject: ['reload'],
    data() {
      return {
        thesis: {
          T_STU_ID: '',
          T_COLLEGE_ID: '',
          T_TUTOR_NAME: '',
          T_MAJOR_ID: '',
          T_CH_LIB_CLASS: '',
          T_RESEARCH_DIRE: '',
          T_SUBJECT_CODE: '',
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
          T_THESIS_FIN_TIME: '',
          T_SECRECY_LEVEL: ''
        },
        major: {},
        collegeList: {},
        majorList: {},
        headers: {token: getToken()},
        BASE_API: process.env.BASE_API,
        formWidth: '90px',
        level: 0,  //学科等级
        options: [],  //学科信息
        subject: {},
        subjectCode: '',
        subjectValue: '请选择学科',
        secercyValue: '',
        secrecyLevel: [
          {
            id: 0,
            value: '公开'
          },
          {
            id: 1,
            value: '内部'
          },
          {
            id: 2,
            value: '秘密'
          }
        ]
      }
    },
    created() {},

    mounted() {
      //初始化获取学科信息
      this.getSubjectInfo()
      //获取学院信息
      this.getCollegeInfo()
      // this.getStuTypeInfo()
      //判断登录用户是否提交论文，论文所处状态
      this.getThesisStatusInfo()
    },

    methods: {

      change() {
        this.$forceUpdate()
      },

      handleMajorChange() {
        this.$forceUpdate()
      },

      newPay() {  //刷新局部组件
        this.reload()
      },

      getCollegeInfo() {
        collegeApi.getAllCollegeInfo()
          .then(result => {
            this.collegeList = result.OUT_DATA.data
          })
      },

      getSubjectInfo() {
        subjectApi.getSubjectByLevel(this.level)
        .then(result => {
          const data = result.OUT_DATA.data
          let pList = []
          for (var i = 0; i < data.length; i++) {
            let List = []
            pList.push({ value: data[i].T_SUBJECT_CODE, label: data[i].T_SUBJECT_NAME, children: List })
            // for (var n = 0; n < this.categoryList[i].child.length; n++) {
            //   List.push({ value: this.categoryList[i].child[n].id, label: this.categoryList[i].child[n].name })
            // }
          }
          this.options = pList
        })
      },

      getThesisStatusInfo() {
        thesisApi.getThesisStatus()
          .then(result => {
            const data = result.OUT_DATA.data
            if (3 == data || 4 == data) {
              this.$router.push({path: '/thesis/catalogue'})
            }else if (data == null){
              return
            }else {
              this.$router.push({path: '/thesis/approved'})
            }
          })
      },

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

      beforeRemove(file, fileList) {
        return this.$confirm(`确定移除 ${ file.name }？`);
      },

      //删除上传的论文
      onRemove(file, fileList){
        thesisApi.removeThesisFile(this.thesis.T_THESIS_URL)
          .then(response => {
            this.newPay()
          })
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
          const loading = this.$loading({
            lock: true,
            text: 'Loading',
            spinner: 'el-icon-loading',
            background: 'rgba(0, 0, 0, 0.7)'
          });

          this.$message({
            type: "success",
            message: "添加成功"
          })
          //回显文件中的关键词、摘要等信息
          this.thesis = {}
          const data = response.OUT_DATA.data
          this.thesis.T_STU_ID = data.stuId
          this.thesis.T_COLLEGE_ID = data.collegeId
          if (this.thesis.T_COLLEGE_ID != null || this.thesis.T_COLLEGE_ID == '') {
            this.handlerCollegeChange()
          }
          this.thesis.T_RESEARCH_DIRE = data.researchDir;
          this.thesis.T_THESIS_EN_KEY = data.enKeyWords;
          this.thesis.T_THESIS_ZH_KEY = data.zhKeyWords
          this.thesis.T_THESIS_ZH_ABSTRACT = data.zhAbstract
          this.thesis.T_THESIS_EN_ABSTRACT = data.enAbstract
          this.thesis.T_THESIS_ZH_TITLE = data.zhTitle
          this.thesis.T_THESIS_EN_TITLE = data.enTitle
          this.thesis.T_TUTOR_NAME = data.tutorName
          this.thesis.T_THESIS_FIN_TIME = data.thesisYear
          this.thesis.T_THESIS_DEFENCE_TIME = data.thesisDate
          this.thesis.T_CH_LIB_CLASS = data.chLib
          this.secercyValue = data.secrecy
          if ('公开' == data.secrecy) {
            this.thesis.T_SECRECY_LEVEL = 0
          }else if ('内部' == data.secrecy) {
            this.thesis.T_SECRECY_LEVEL = 1
          }else if ('秘密' == data.secrecy) {
            this.thesis.T_SECRECY_LEVEL = 2
          }
          this.subjectValue = data.subjectName
          if (data.subjectCode != null && data.subjectCode != '') {
            this.thesis.T_SUBJECT_CODE = data.subjectCode
          }
          this.thesis.T_THESIS_PAGE_NUMBER = data.page
          this.thesis.T_THESIS_FILE = data.filename;
          this.thesis.T_THESIS_URL = data.thesisUrl
          loading.close();
        }
      },

      submitThesisInfo() {
        console.log(this.thesis)
        thesisApi.submitThesis(this.thesis)
          .then(result => {
            this.$message({
              type: "success",
              message: "提交成功"
            })
            //跳转页面
            this.$router.push({path: '/thesis/approved'})
          })
      },

      //处理学科代码
      handleChange(value) {
        let code = value[2]
        this.thesis.T_SUBJECT_CODE = code
      },

      //处理选中的保密层级
      handlerSecercyChange(value) {
        this.thesis.T_SECRECY_LEVEL = value
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
  .tinymce-container {
    line-height: 29px;
  }
  .input-width {
    width: 70%;
  }
  .tinymce-container {
    line-height: 29px;
  }
</style>
