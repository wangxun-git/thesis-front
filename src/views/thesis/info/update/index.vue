<template>
  <div class="app-container">
    <router-view/>

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
          placeholder="选择年"
          :disabled="editThesis">
        </el-date-picker>
      </el-form-item>

      <el-form-item label="学科名称" :label-width="formWidth">
        <el-input v-model="thesis.T_SUBJECT_NAME" class="input-width" :disabled="editThesis"/>
      </el-form-item>

      <el-form-item label="分类号" :label-width="formWidth">
        <el-input v-model="thesis.T_CH_LIB_CLASS" class="input-width" placeholder="上传论文后可自动回显" :disabled="editThesis"/>
      </el-form-item>

      <el-form-item label="导师" :label-width="formWidth">
        <el-input v-model="thesis.T_TUTOR_NAME" class="input-width" placeholder="请使用;号分隔" :disabled="editThesis"></el-input>
      </el-form-item>

      <el-form-item label="研究方向" :label-width="formWidth">
        <el-input v-model="thesis.T_RESEARCH_DIRE" class="input-width" placeholder="上传论文后可自动回显" :disabled="editThesis"></el-input>
      </el-form-item>

      <el-form-item label="论文题目" :label-width="formWidth">
        <el-input v-model="thesis.T_THESIS_ZH_TITLE" class="input-width" placeholder="上传论文后可自动回显" :disabled="editThesis"></el-input>
      </el-form-item>

      <el-form-item label="英文题目" :label-width="formWidth">
        <el-input v-model="thesis.T_THESIS_EN_TITLE" class="input-width" :disabled="editThesis"/>
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
        <tinymce :height="200" v-model="thesis.T_THESIS_ZH_ABSTRACT" ></tinymce>
      </el-form-item>

      <!--        <el-form-item label="培养层级">-->
      <!--          <el-radio-group v-model="level">-->
      <!--            <el-radio :label="item.T_STU_TYPE_ID" :key="item.T_STU_TYPE_ID" v-for="item in levellist" @change="handlerLevelChange()">-->
      <!--              {{item.T_STU_TYPE_ZH_NAME}}-->
      <!--            </el-radio>-->
      <!--          </el-radio-group>-->
      <!--        </el-form-item>-->
      <el-form-item label="英文摘要" />
      <el-form-item label="英文摘要">
        <tinymce :height="200" v-model="thesis.T_THESIS_EN_ABSTRACT" ></tinymce>
      </el-form-item>

    </el-form>

  </div>
</template>

<script>
  //引入富文本编译器
  import Tinymce from '@/components/Tinymce/readOnly'
  import thesisApi from '@/api/thesis/thesis.js'
  import collegeApi from '@/api/collegeTutor/college.js'
  import majorApi from '@/api/collmajor/major.js'

    export default {
      components: { Tinymce },
      name: "index",
      data() {
          return {
            editThesis: true,
            thesis: {
              T_THESIS_ID: '',
              T_STU_ID: '',
              T_COLLEGE_ID: '',
              T_TUTOR_NAME: '',
              T_MAJOR_ID: '',
              T_SUBJECT_NAME: '',
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
            page: 1,
            major: {},
            collegeList: {},
            majorList: {},
            formWidth: '90px',
          }
      },

      created() {
        this.init()
        //获取学院信息
        this.getCollegeInfo()
        //获取登录用户的论文信息
         this.getThesisInfoByThesisId()
      },

      methods: {

          init() {
            if (this.$route.params && this.$route.params.id) {
              const id = this.$route.params.id
              this.thesis.T_THESIS_ID = id
            }
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

          getThesisInfoByThesisId(page = 1) {
            this.page = page
            thesisApi.getThesisListByCond(this.page, this.thesis)
            .then(result => {
              const data = result.OUT_DATA.data.data
              this.thesis = data[0]
              this.handlerCollegeChange()
              this.thesis.T_MAJOR_ID = data[0].T_MAJOR_ID
            })
          },

      }
    }
</script>

<style scoped>
  .tinymce-container {
    line-height: 29px;
  }
</style>
