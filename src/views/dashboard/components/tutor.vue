<template>
  <div class="app-container">
    <div class="content">
      <div class="main clearfix">
        <div class="head">
          <div class="logo"></div>

          <!-- 内容主体部分 -->
          <section class="data_section" ref="data_section">
            <div class="tpmp">
            </div>
            <a target="_blank" class="banner">
              <el-row :gutter="10" class="row_list">
                <el-col :span="8">
                  <div class="row_left row_base">
                    <el-col :span="12">
                      <div class="pay saleBgcolor data_list rflex">
                        <div class="leftItem cflex wflex">
                          <p class="investor">{{ $t("index.loginTimes") }}</p>
                          <p class="number">
                            {{this.loginTimes}}
                          </p>
                        </div>
                      </div>
                    </el-col>

                    <el-col :span="12">
                      <div class="pay taxBgcolor data_list rflex">
                        <div class="leftItem cflex wflex">
                          <p class="investor">{{ $t("index.studentNumber") }}</p>
                          <p class="number">
                            {{this.studentNum}}
                          </p>
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
                          <p class="investor">{{ $t("index.tutorApprNumber") }}</p>
                          <p class="number">
                            {{this.tutorAppr}}
                          </p>
                        </div>
                        <div class="rightItem">
                        </div>
                      </div>
                    </el-col>
                    <el-col :span="6">
                      <div class="likeBgcolor data_list rflex">
                        <div class="leftItem cflex wflex">
                          <p class="investor">{{ $t("index.adminApprNumber") }}</p>
                          <p class="number">
                            {{this.adminAppr}}
                          </p>
                        </div>
                        <div class="rightItem">
                        </div>
                      </div>
                    </el-col>
                    <el-col :span="6">
                      <div class="linkBgColor data_list rflex">
                        <div class="leftItem cflex wflex">
                          <p class="investor">{{ $t("index.noApprPassNumber") }}</p>
                          <p class="number">
                            {{this.noApprPass}}
                          </p>
                        </div>
                        <div class="rightItem">
                        </div>
                      </div>
                    </el-col>
                    <el-col :span="6">
                      <div class="keleBgColor data_list rflex">
                        <div class="leftItem cflex wflex">
                          <p class="investor">{{ $t("index.catalogueNumber") }}</p>
                          <p class="number">
                            {{catalogue}}
                          </p>
                        </div>
                        <div class="rightItem">
                        </div>
                      </div>
                    </el-col>
                  </div>
                </el-col>
              </el-row>
            </a>

            <!-- 第二行 -->
            <div class="echart">
              <el-row :gutter="10" class="row_list order_list">
                <el-col :span="10">
                  <div class="chart-container">
                    <div id="order-chart" class="orderArea"/>
                  </div>
<!--                  <pie-chart type="ordertype"></pie-chart>-->
                </el-col>

                <el-col :span="10">
                  <radar-chart/>

<!--                  <pie-chart2 ref="pieChart2" type="stutype"/>-->
                </el-col>


              </el-row>
              <!-- 第三行 -->

              <el-row :gutter="10" class="row_list order_list">
                <el-col :span="13">
                  <line-chart/>
                </el-col>

                <el-col :span="6">
                  <div class="chart-container">
                    <div id="chart" class="orderArea"/>
                  </div>
                </el-col>

              </el-row>
            </div>
          </section>

        </div>
      </div>
    </div>
    <div class="footer">技术支持：同方知网（北京）技术有限公司山东分公司 </div>
    <div class="rdown"></div>
  </div>
</template>

<script>
  import * as echarts from 'echarts'
  import echartsTheme from "../../../components/echarts/theme/westeros.json";
  import barChart from "../../../components/echarts/barChart"; // 用户投资类型 柱状图
  import pieChart from "../../../components/echarts/pieChart"; // 用户投资类型 饼状图
  import pieChart2 from "../../../components/echarts/pieChart2";
  import radarChart from "../../../components/echarts/radarChart"; // 用户投资类型 雷达图
  import lineChart from "../../../components/echarts/lineChart"; // 用户投资类型 折线图
  import thesisStatus from "../../../components/echarts/thesisStatus"; // 用户投资类型 折线图
  import homeApi from '@/api/system/home.js'
  import { mapGetters } from 'vuex'

  export default {
    data() {
      return {
        // github: github,
        tutorAppr: '',
        adminAppr: '',
        noApprPass: '',
        percentage: '',
        loginTimes: '',
        lastLoginTime: '',
        catalogue: '',
        studentNum: '',
      };
    },

    computed: {
      ...mapGetters([
        'name',
        'roles'
      ])
    },
    components: {
      barChart,
      pieChart,
      pieChart2,
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
      //获取提交、未提交数据
      this.getSubmitInfo()
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
        //获取论文信息
        homeApi.getThesisByStatus()
        .then(result => {
          const data = result.OUT_DATA.data
          let status0 = data.status0 == null ? 0 : data.status0
          let status1 = data.status1 == null ? 0 : data.status1
          let status2 = data.status2 == null ? 0 : data.status2
          let status3 = data.status3 == null ? 0 : data.status3
          let status4 = data.status4 == null ? 0 : data.status4
          let status5 = data.status5 == null ? 0 : data.status5
          let status6 = data.status6 == null ? 0 : data.status6
          let status7 = data.status7 == null ? 0 : data.status7
          // this.tutorAppr =  status0 + status1 + status3 + status4 + status5 + status6 + status7
          this.tutorAppr =  status0
          // this.adminAppr = status3 + status4 + status6
          this.adminAppr = status5
          this.noApprPass = status2 + status7
          this.catalogue = status4
          //初始化环形图
          this.initStatusCharts(data)
        })
      },

      getSubmitInfo() {
        homeApi.getSubmitStu()
          .then(result => {
            const data = result.OUT_DATA.data
            this.studentNum = data.total
            this.initSubmitCharts(data)
          })
      },

      //提交、未提交人数
      initSubmitCharts(outData) {
        echarts.registerTheme("westeros", echartsTheme);
        this.chart = echarts.init(document.getElementById('chart'), "westeros")
        let text, legend_data, series_data;

        text = "学生人数: " + outData.total;
        legend_data = ["已提交学生数", "未提交学生数"];
        series_data = [
          { value: outData.submitCount, name: "已提交学生数" },
          { value: outData.noSubmitCount, name: "未提交学生数" },
        ];

        let data = {
          title: {
            text: text,
            // left: "center",
          },
          color:['#37a1da', '#ff9b65'],
          tooltip: {
            trigger: "item",
            formatter: "{a} <br/>{b} : {c} ({d}%)",
          },
          // color: ['#2db7f5','#ff6600'],
          legend: {
            orient: "vertical",
            left: "right",
            data: legend_data,
          },
          series: [
            {
              name: "学生人数",
              type: "pie",
              radius: "70%",
              center: ["50%", "50%"],
              data: series_data,
              itemStyle: {
                emphasis: {
                  shadowBlur: 10,
                  shadowOffsetX: 0,
                  shadowColor: "rgba(0, 0, 0, 0.5)",
                },
              },
            },
          ],
        };
        this.chart.setOption(data)
      },

      //填充各状态
      initStatusCharts(outData) {
        echarts.registerTheme("westeros", echartsTheme);
        this.chart = echarts.init(document.getElementById('order-chart'), "westeros")
        let text, legend_data, series_data;
        text = "论文状态";
        legend_data = ["等待审核", "审核通过", "审核不通过", "等待编目", "编目完成", "研究院审核中", "研究院审核通过", "研究院审核不通过"];
        series_data = [
          { value: outData.status0, name: "导师审核中" },
          { value: outData.status1, name: "审核通过" },
          { value: outData.status2, name: "审核不通过" },
          { value: outData.status3, name: "等待编目" },
          { value: outData.status4, name: "编目完成" },
          { value: outData.status5, name: "研究院审核中" },
          { value: outData.status6, name: "研究院审核通过" },
          { value: outData.status7, name: "研究院审核不通过" },
        ];

        let option = {
          title: {
            text: text,
            // x: "center",
          },
          tooltip: {
            trigger: "item",
            formatter: "{a} <br/>{b} : {c} ({d}%)",
          },
          legend: {
            orient: "vertical",
            left: "right",
            data: legend_data,
          },
          series: [
            {
              name: "论文篇数",
              type: "pie",
              radius: ['60%','80%'],
              center: ["50%", "50%"],
              data: series_data,
              itemStyle: {
                emphasis: {
                  shadowBlur: 10,
                  shadowOffsetX: 0,
                  shadowColor: "rgba(0, 0, 0, 0.5)",
                },
              },
            },
          ],
        };
        this.chart.setOption(option)
      },

    },

  };
</script>

<style lang="less" scoped>
  .data_section {
    margin: 20px;
    margin-top: 140px;
    text-align: center;
    border-radius: 2px;
    .row_list {
      margin-bottom: 20px;
      .row_base {
        padding: 10px;
        box-sizing: border-box;
        background: #fff;
        border-radius: 6px;
        height: 100px;
      }
    }
    .order_list {
      .orderArea {
        width: 100%;
        height: 300px;
        // background: #fff !important;
        border-radius: 6px;
        box-sizing: border-box;
        padding: 10px;
        // padding-top: 10px;
        overflow: hidden;
      }
      .orderbarArea {
        height: 300px;
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
        width: 12px;
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
  .echart{
    width: 1440px;
    // padding-left: 50px;
    display: inline-block;
  }


  // 整体ui

  * {margin: 0;padding: 0;}
  .clearfix {clear: both;}

  a{text-decoration: none;color: #000;}
  a:hover{ cursor:pointer;}

  body{
    font-family:"微软雅黑";
    font-size:14px;
    height: 100%;
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
    margin-top: -50px;
  }

</style>
