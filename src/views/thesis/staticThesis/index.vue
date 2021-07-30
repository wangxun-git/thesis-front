<template>
  <div class="app-container">
    <div class="content">
      <div class="main clearfix">
        <div class="head">
          <div class="logo"></div>
          <ul>
            <li><a href="/">首页</a></li>
            <li><a @click="openXkdh()">学科导航</a></li>
            <li><a @click="reloadClc()">中图法导航</a></li>
            <li><a @click="reloadFaq()">FAQ</a></li>
          </ul>
        </div>
        <div class="clearBox">
          <div class="tzgg">
            <div class="BT"></div>
          </div>
        </div>
        <div class="return">
            <span><i class="el-icon-location"></i>&nbsp;<a @click="back()">返回 >></a></span>
        </div>
        <div class="line"></div>

        <el-form>
          <div class="left-box">
            <el-form
              label-width="80px"
              label-position="right">
              <el-row>
                <el-col :span="12">
                  <el-form-item label="学号">
                    <el-input v-model="thesis.T_STU_ID" class="input-width" :disabled="editThesis"/>
                  </el-form-item>
                </el-col>

                <el-col :span="12">
                  <el-form-item label="导师">
                    <el-input v-model="thesis.T_TUTOR_NAME" class="input-width" placeholder="请使用;号分隔" :disabled="editThesis"></el-input>
                  </el-form-item>
                </el-col>
              </el-row>

              <el-form-item label="论文题目">
                <el-input v-model="thesis.T_THESIS_ZH_TITLE" class="input-width" placeholder="上传论文后可自动回显" :disabled="editThesis"></el-input>
              </el-form-item>

              <el-form-item label="英文题目">
                <el-input v-model="thesis.T_THESIS_EN_TITLE" class="input-width" :disabled="editThesis"></el-input>
              </el-form-item>

              <el-row>
                <el-col :span="12">
                  <el-form-item label="学院名称">
                    <el-input v-model="thesis.T_COLLEGE_NAME" clearable :disabled="editThesis" style="width: 270px"/>
                  </el-form-item>
                </el-col>

                <el-col :span="12">
                  <el-form-item label="专业名称">
                    <el-input v-model="thesis.T_MAJOR_NAME" clearable :disabled="editThesis" style="width: 270px"/>
                  </el-form-item>
                </el-col>
              </el-row>

              <el-row>
                <el-col :span="12">
                  <el-form-item label="学科">
                    <el-input v-model="thesis.T_SUBJECT_NAME" clearable :disabled="editThesis" style="width: 270px"/>
                  </el-form-item>
                </el-col>

                <el-col :span="12">
                  <el-form-item label="保密程度">
                    <el-select v-model="thesis.T_SECRECY_LEVEL" :disabled="editThesis" style="width: 270px">
                      <el-option
                        v-for="item in secrecyLevel"
                        :key="item.id"
                        :label="item.value"
                        :value="item.id"
                      >
                      </el-option>
                    </el-select>
                  </el-form-item>
                </el-col>
              </el-row>

              <el-row>
                <el-col :span="12">
                  <el-form-item label="答辩日期">
                    <el-col :span="11">
                      <el-date-picker type="date" placeholder="选择日期" v-model="thesis.T_THESIS_DEFENCE_TIME" :disabled="editThesis" style="width: 270px"></el-date-picker>
                    </el-col>
                  </el-form-item>
                </el-col>

                <el-col :span="12">
                  <el-form-item label="学位年度">
                    <el-date-picker
                      v-model="thesis.T_THESIS_FIN_TIME"
                      type="year"
                      value-format="yyyy"
                      placeholder="选择年" :disabled="editThesis" style="width: 270px">
                    </el-date-picker>
                  </el-form-item>
                </el-col>
              </el-row>

              <el-row>

              </el-row>
                <el-col :span="12">
                  <el-form-item label="研究方向">
                    <el-input v-model="thesis.T_RESEARCH_DIRE" class="input-width" :disabled="editThesis"/>
                  </el-form-item>
                </el-col>

                <el-col :span="12">
                  <el-form-item label="分类号">
                    <el-input v-model="thesis.T_CH_LIB_CLASS" class="input-width" :disabled="editThesis"></el-input>
                  </el-form-item>
                </el-col>
              <el-row>

                <el-col :span="12">
                  <el-form-item label="论文页数">
                    <el-input v-model="thesis.T_THESIS_PAGE_NUMBER" class="input-width" :disabled="editThesis"/>
                  </el-form-item>
                </el-col>

                <el-col :span="12">
                  <el-form-item label="馆藏号">
                    <el-input v-model="thesis.T_THESIS_COLL_CODE" class="input-width" :disabled="editThesis"></el-input>
                  </el-form-item>
                </el-col>
              </el-row>

              <el-form-item label="关键词">
                <el-input v-model="thesis.T_THESIS_ZH_KEY" class="input-width" placeholder="上传论文后可自动回显" :disabled="editThesis"/>
              </el-form-item>

              <el-form-item label="英文关键词" style="white-space:nowrap">
                <el-input v-model="thesis.T_THESIS_EN_KEY" class="input-width" placeholder="上传论文后可自动回显" :disabled="editThesis"/>
              </el-form-item>
            </el-form>
          </div>

          <!-- 导师消息反馈 -->
          <div class="right-box">
            <div class="summary">
              <h3>&nbsp;摘要:</h3>
              <div style="margin: 20px 0;"></div>
              <p class="p-abst" v-html="thesis.T_THESIS_ZH_ABSTRACT"/>
            </div>
            <div style="margin: 30px 0;"></div>
            <div class="summary">

              <h3>&nbsp;英文摘要:</h3>
              <div style="margin: 20px 0;"></div>
              <p class="p-abst" v-html="thesis.T_THESIS_EN_ABSTRACT"/>
            </div>
          </div>
        </el-form>
      </div>
    </div>

    <div class="footer">技术支持：同方知网（北京）技术有限公司山东分公司 </div>
    <div class="rdown"></div>
  </div>

</template>

<script>

  import thesisApi from '@/api/thesis/thesis'

  export default {

    data() {
      return {
        thesis: {},
        page: 1,
        editThesis: true,
        flag: 0,
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


    created() {
      this.init()
    },

    mounted() {
      this.getThesisInfo()
    },

    methods: {
      init() {
        if (this.$route.query && this.$route.query.id && this.$route.query.flag) {
          const id = this.$route.query.id
          const flag = this.$route.query.flag
          this.thesis.T_THESIS_ID = id
          this.flag = flag
        }
      },

      getThesisInfo() {
        thesisApi.getThesisListByCond(this.page, this.thesis)
        .then(result => {
          const data = result.OUT_DATA.data
          if (data == null) {
            return
          }
          this.thesis = data.data[0]
        })
      },

      openXkdh() {
        let routeData = this.$router.resolve({ path: '/xkdh'});
        window.open(routeData.href, '_blank');
      },

      reloadFaq() {
        let routeData = this.$router.resolve({ path: '/faq'});
        window.open(routeData.href, '_blank');
      },

      reloadClc() {
        let routeData = this.$router.resolve({ path: '/clc'});
        window.open(routeData.href, '_blank');
      },

      back() {
        if (1 == this.flag) {
          let routeData = this.$router.resolve({ path: '/xkdh'});
          window.open(routeData.href, '_blank');
        }else {
          let routeData = this.$router.resolve({ path: '/clc'});
          window.open(routeData.href, '_blank');
        }
      }

    }

  }
</script>

<style>

  .p-abst {
    text-indent: 2em;
    width: 100%;
    height: 18rem;
    overflow: scroll;
  }

  * {margin: 0;padding: 0;}
  .clearfix {clear: both;}

  a{text-decoration: none;color: #000;}
  a:hover{ cursor:pointer;}

  body{
    font-family:"微软雅黑";
    font-size:14px;
  }

  .content{
    width: 100%;
    overflow: hidden;
    margin: 0 auto;
    background:url("../../../assets/faqImages/bg.png") no-repeat top;
  }
  .main{
    width: 1200px;
    margin: 0 auto;
    overflow: hidden;
  }
  .head{
    width: 100%;
    overflow: hidden;
    margin-top: 60px;
  }
  .head ul{
    float: right;
    list-style: none;
  }
  .head ul li{
    float: left;
    margin: 0 18px;
  }
  .head ul li a{
    color: #5c63f0;
    font-size: 24px;
    font-family: 'Nunito', sans-serif;
  }
  .logo{
    background: url("../../../assets/noticeImg/TPMP.png") no-repeat 0;
    width: 250px;
    height: 40px;
    float: left;
  }

  .tzgg{
    width: 928px;
    overflow: hidden;
    margin-top: 58px;
    float: right;
  }

  .clearBox {
    overflow: hidden;
  }

  .BT{
    width: 400px;
    height: 50px;
    background: url("../../../assets/img/ThePaperInformation.png") no-repeat 0;
    float: left;
  }

  .rdown{
    position:fixed;
    right: 0;
    bottom: 0;
    background: url("../../../assets/noticeImg/rdown.png") no-repeat 0;
    width: 79px;
    height: 79px;
  }

  .footer{
    width: 1200px;
    overflow: hidden;
    margin: 0 auto;
    text-align: center;
    line-height: 92px;
    color: #aaa;
    background: url("../../../assets/noticeImg/ldown.png") no-repeat 0;
    margin-top: 50px;
  }

  .return {
    float:right;
    font-size: 20px;
    color: #605bf2;
  }
  .return a {
    color: #605bf2;
  }
  .line {
    height: 1px;
    padding-top: 45px;
    border-bottom: 2px solid #c5c5c5;
  }

  /* 主体区域 */

  .left-box {
    padding-top: 80px;
    width: 702px;
    display: inline-block;
  }

  .el-form-item{
    margin-bottom: 30px;
  }

  .right-box {
    width: 460px;
    height: 500px;
    margin-top: 90px;
    float: right;
    color:#7f7f7f;
  }
  .summary a {
    color: #565656;
  }

  .page-scroll {
    height: 100%;
  }

  .page-scroll .el-scrollbar__wrap {
    overflow-x: hidden;
  }
  *::-webkit-scrollbar {
    /*滚动条整体样式*/
    width : 8px;  /*高宽分别对应横竖滚动条的尺寸*/
    height: 1px;
  }
  *::-webkit-scrollbar-thumb {
    /*滚动条里面小方块*/
    border-radius   : 10px;
    background-color: #a3a3a3;
  }
  *::-webkit-scrollbar-track {
    /*滚动条里面轨道*/
    box-shadow   : inset 0 0 5px rgba(0, 0, 0, 0.2);
    background   : #dfdfdf;
    border-radius: 10px;
  }
</style>
