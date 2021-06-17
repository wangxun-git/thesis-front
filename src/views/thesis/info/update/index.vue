<template>
  <div class="app-container">
    <router-view/>

    <el-form>

      <el-form-item label="学号">
        <el-input v-model="thesis.T_STU_ID" class="input-width" />
      </el-form-item>

      <el-form-item label="学院名称">
        <el-select v-model="thesis.T_COLLEGE_ID" clearable placeholder="请选择学院信息" @change="handlerCollegeChange()" >
          <el-option
            v-for="item in collegeList"
            :key="item.T_COLLEGE_ID"
            :label="item.T_COLLEGE_NAME"
            :value="item.T_COLLEGE_ID">
          </el-option>
        </el-select>
      </el-form-item>

      <el-form-item label="专业名称">
        <el-select v-model="thesis.T_MAJOR_ID" clearable placeholder="请选择专业信息" >
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
          <el-date-picker type="date" placeholder="选择日期" v-model="thesis.T_THESIS_DEFENCE_TIME" ></el-date-picker>
        </el-col>
      </el-form-item>

      <el-form-item label="学位年度">
        <el-date-picker
          v-model="thesis.T_THESIS_FIN_TIME"
          type="year"
          value-format="yyyy"
          placeholder="选择年" >
        </el-date-picker>
      </el-form-item>

      <el-form-item label="导师">
        <el-input v-model="thesis.T_TUTOR_NAME" class="input-width" placeholder="请使用;号分隔" ></el-input>
      </el-form-item>

      <el-form-item label="研究方向">
        <el-input v-model="thesis.T_RESEARCH_DIRE" class="input-width" placeholder="上传论文后可自动回显" ></el-input>
      </el-form-item>

      <el-form-item label="论文题目">
        <el-input v-model="thesis.T_THESIS_ZH_TITLE" class="input-width" placeholder="上传论文后可自动回显" ></el-input>
      </el-form-item>

      <el-form-item label="英文题目">
        <el-input v-model="thesis.T_THESIS_EN_TITLE" class="input-width" ></el-input>
      </el-form-item>

      <el-form-item label="关键词">
        <el-input v-model="thesis.T_THESIS_ZH_KEY" class="input-width" placeholder="上传论文后可自动回显" />
      </el-form-item>

      <el-form-item label="英文关键词">
        <el-input v-model="thesis.T_THESIS_EN_KEY" class="input-width" placeholder="上传论文后可自动回显" />
      </el-form-item>

      <el-form-item label="摘要(上传论文后可自动回显)"/>
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
      <el-form-item label="英文摘要(上传论文后可自动回显)"/>
      <el-form-item label="英文摘要">
        <tinymce :height="200" v-model="thesis.T_THESIS_EN_ABSTRACT" ></tinymce>
      </el-form-item>

      <el-form-item label="论文总页数">
        <el-input v-model="thesis.T_THESIS_PAGE_NUMBER" ></el-input>
      </el-form-item>

      <el-button type="success" round @click="updateThesis()">保存</el-button>

    </el-form>

  </div>
</template>

<script>
  //引入富文本编译器
  import Tinymce from '@/components/Tinymce'
  import thesisApi from '@/api/thesis/thesis.js'
  import collegeApi from '@/api/collegeTutor/college.js'
  import majorApi from '@/api/collmajor/major.js'

    export default {
      components: { Tinymce },
      name: "index",
      data() {
          return {
            thesis: {
              T_THESIS_ID: '',
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
            page: 1,
            major: {},
            collegeList: {},
            majorList: {},
            editThesis: true
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

          updateThesis() {
            thesisApi.updateThesis(this.thesis)
              .then(result => {
                this.$message({
                  type: "success",
                  message: "修改成功"
                })
              })
          }
      }
    }
</script>

<style scoped>
  .tinymce-container {
    line-height: 29px;
  }
</style>
