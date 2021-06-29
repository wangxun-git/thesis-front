<template>
  <section class="data_section" ref="data_section">
    <a :href="github" target="_blank">
      <el-row :gutter="10" class="row_list">
        <el-col :span="8">
          <div class="row_left row_base">
            <el-col :span="12">
              <div class="pay saleBgcolor data_list rflex">
                <div class="leftItem cflex wflex" v-if="roles == 'admin'">
                  <p class="investor">{{ $t("index.commit") }}</p>
                  <p class="number">
                    {{this.thesisNumbers}}<span class="perTitle"
                  >({{ $t("index.number") }})</span
                  >
                  </p>
                </div>
                <div class="leftItem cflex wflex" v-if="roles == 'tutor'">
                  <p class="investor">{{ $t("index.studentNumber") }}</p>
                  <p class="number">
                    {{this.thesisNumbers}}<span class="perTitle"
                  >({{ $t("index.person") }})</span
                  >
                  </p>
                </div>
                <div class="rightItem">
                  <icon-svg icon-class="iconfukuan" />
                </div>
              </div>
            </el-col>
            <el-col :span="12">
              <div class="pay taxBgcolor data_list rflex">
                <div class="leftItem cflex wflex">
                  <p class="investor">{{ $t("index.intentionInvestor") }}</p>
                  <p class="number">
                    {{this.loginTimes}}<span class="perTitle">({{ $t("index.loginTimes") }})</span>
                  </p>
                </div>
                <div class="rightItem">
                  <icon-svg icon-class="iconpay3" />
                </div>
              </div>
            </el-col>
          </div>
        </el-col>
        <el-col :span="16">
          <div class="row_right row_base">
            <el-col :span="6">
              <div class="extenedBgcolor data_list rflex">
                <div class="leftItem cflex wflex">
                  <p class="investor">{{ $t("index.potentialInvestor") }}</p>
                  <p class="number">
                    {{this.waitReviewCount}}<span class="perTitle">({{ $t("index.number") }})</span>
                  </p>
                </div>
                <div class="rightItem">
                  <icon-svg icon-class="iconpay2" />
                </div>
              </div>
            </el-col>
            <el-col :span="6">
              <div class="likeBgcolor data_list rflex">
                <div class="leftItem cflex wflex">
                  <p class="investor">{{ $t("index.percentage") }}</p>
                  <p class="number">{{this.percentage}}<span class="perTitle">(%)</span></p>
                </div>
                <div class="rightItem">
                  <icon-svg icon-class="iconpay1" />
                </div>
              </div>
            </el-col>
            <el-col :span="6">
              <div class="linkBgColor data_list rflex">
                <div class="leftItem cflex wflex">
                  <p class="investor">{{ $t("index.waitExamineInvestor") }}</p>
                  <span class="lastLoginTime">
                    {{this.lastLoginTime}}
                  </span>
                </div>
                <div class="rightItem">
                  <icon-svg icon-class="iconpay" />
                </div>
              </div>
            </el-col>
            <el-col :span="6">
              <div class="keleBgColor data_list rflex">
                <div class="leftItem cflex wflex">
                  <p class="investor">{{ $t("index.welcome") }}</p>
                  <p class="number">
                    {{name}}
                  </p>
                </div>
                <div class="rightItem">
                  <icon-svg icon-class="iconfufei0" />
                </div>
              </div>
            </el-col>
          </div>
        </el-col>
      </el-row>
    </a>
    <el-row :gutter="10" class="row_list order_list">
      <el-col :span="6">
        <log-list></log-list>
      </el-col>

      <el-col :span="16" v-if="roles == 'admin'">
        <bar-chart type="barChart"></bar-chart>
      </el-col>

      <el-col :span="10" v-if="roles == 'student'">
        <thesis-status></thesis-status>
      </el-col>

    </el-row>
    <el-row :gutter="10" class="row_list order_list" v-if="roles == 'admin'">
      <el-col :span="6">
        <pie-chart type="ordertype"></pie-chart>
      </el-col>
      <el-col :span="12">
        <line-chart></line-chart>
      </el-col>
      <el-col :span="6">
        <radar-chart></radar-chart>
      </el-col>
    </el-row>
  </section>

</template>

<script>
  import * as echarts from 'echarts'
  import logList from "./components/logList"; // 日志列表
  import barChart from "../../components/echarts/barChart"; // 用户投资类型 柱状图
  import pieChart from "../../components/echarts/pieChart"; // 用户投资类型 饼状图
  import radarChart from "../../components/echarts/radarChart"; // 用户投资类型 雷达图
  import lineChart from "../../components/echarts/lineChart"; // 用户投资类型 折线图
  import thesisStatus from "../../components/echarts/thesisStatus"; // 用户投资类型 折线图
  import homeApi from '@/api/system/home.js'
  import { mapGetters } from 'vuex'

  export default {
    data() {
      return {
        // github: github,
        thesisNumbers: '',
        waitReviewCount: '',
        percentage: '',
        loginTimes: '',
        lastLoginTime: '',
      };
    },
    computed: {
      ...mapGetters([
        'name',
        'roles'
      ])
    },
    components: {
      logList,
      barChart,
      pieChart,
      radarChart,
      lineChart,
      thesisStatus
    },

    created() {

    },

    mounted() {
      //获取登录信息
      this.getLoginInfos()
      //获取论文信息
      this.getThesisInfos()
    },
    methods: {
      getLoginInfos() {
        homeApi.getLoginInfo()
        .then(result => {
          const data = result.OUT_DATA.data
          this.loginTimes = data.count
          this.lastLoginTime = data.time
        })
      },

      getThesisInfos() {
        homeApi.getThesisInfo()
        .then(result => {
          const data = result.OUT_DATA.data
          this.thesisNumbers = data.thesisCount
          this.waitReviewCount = data.waitReviewCount
          this.percentage = data.percentage
        })
      }
    },
  };
</script>

<style lang="less" scoped>
  .data_section {
    margin: 20px;
    border-radius: 2px;
    .row_list {
      margin-bottom: 20px;
      .row_base {
        padding: 10px;
        box-sizing: border-box;
        background: #fff;
        border-radius: 6px;
        height: 120px;
      }
    }
    .order_list {
      .orderArea {
        width: 100%;
        height: 300px;
        background: #fff !important;
        border-radius: 6px;
        box-sizing: border-box;
        padding: 10px;
        padding-top: 40px;
        overflow: hidden;
      }
      .orderbarArea {
        height: 370px;
      }
    }
    .data_list {
      text-align: center;
      font-size: 14px;
      border-radius: 6px;
      padding: 10px;
      color: #fff;
      height: 80px;
      .leftItem {
        align-items: start;
        justify-content: space-between;
        text-align: left;
      }
      .rightItem {
        width: 62px;
        display: flex;
        align-items: center;
        justify-content: center;
        .svg-icon {
          font-size: 30px;
        }
      }
      .number {
        font-size: 22px;
        font-weight: bold;
        .perTitle {
          font-size: 13px;
          margin-left: 5px;
        }
      }
    }
    .pay {
      .leftItem {
        justify-content: space-around;
      }
    }
    .lastLoginTime {
      font-size: 15px;
      font-weight: bold;
    }
  }
</style>
