<template>
  <div class="app-container">
    <router-view/>

    <!-- 检索条件 -->
    <el-form :inline="true" class="demo-from-inline">
      <el-form-item>
        <el-select v-model="loginUser.T_USER_IDENTITY" clearable placeholder="请选择用户身份">
          <el-option
            v-for="item in idenList"
            :key="item.key"
            :label="item.value"
            :value="item.key">
          </el-option>
        </el-select>

        <el-form-item label="开始时间">
          <el-col :span="11">
            <el-date-picker type="month" placeholder="选择日期" v-model="loginUser.T_BEGIN_TIME"></el-date-picker>
          </el-col>
        </el-form-item>

        <el-form-item label="结束时间">
          <el-col :span="11">
            <el-date-picker type="month" placeholder="选择日期" v-model="loginUser.T_END_TIME"></el-date-picker>
          </el-col>
        </el-form-item>

        <el-form-item>
          <el-button type="primary" icon="el-icon-search" @click="getLoginUserInfo()">查询</el-button>
        </el-form-item>

        <el-form-item>
          <el-button type="warning" @click="resetData()">清空</el-button>
        </el-form-item>

      </el-form-item>
    </el-form>

    <div class="chart-container">

      <div id="chart" class="chart" style="height:500px;width:50%;" />

      <div id="bar-chart" class="bar-chart" style="height:500px;width:50%;" />
    </div>

  </div>
</template>

<script>

  import * as echarts from 'echarts'
  import sataApi from '@/api/system/sata'

  export default {
    data() {
      return {
        loginUser: {},
        idenList: [
          {
            key: 0,
            value: '管理员'
          },
          {
            key: 1,
            value: '导师'
          },
          {
            key: 2,
            value: '学生'
          }
        ],
        flag: 0,
        chart: null,
        title: '',
        xData: [],
        yData: []

      }
    },

    created() {
      //获取本年用户登录信息
      this.getLoginInfo()
    },

    methods: {

      //初始化用户统计信息
      getLoginInfo(flag = 0) {
        this.flag = flag
        sataApi.getLogins(this.flag)
        .then(result => {
          const data = result.OUT_DATA.data
          if (data == null) {
            return
          }
          this.initChart(data)  //初始化饼图信息
          this.initBarCharts(data) //初始化柱状图信息
        })
      },

      //条件查询用户登录信息
      getLoginUserInfo() {
        sataApi.getLoginsByCond(this.loginUser)
        .then(result => {
          const data = result.OUT_DATA.data
          console.log(data)
          if (data == null) {
            this.$message({
              type: "warning",
              message: "没有查询到符合条件的信息"
            })
            return
          }
          this.initChart(data)  //饼图信息
          this.initBarCharts(data) //柱状图信息
        })
      },

      resetData() {
        this.loginUser = {}
        this.getLoginInfo()
      },

      //初始化饼图信息
      initChart(data) {
        // 基于准备好的dom，初始化echarts实例
        this.chart = echarts.init(document.getElementById('chart'))
        // 指定图表的配置项和数据
        var option = {
          title: {
            text: data.title,
            left: 'center'
          },
          tooltip: {
            trigger: 'item'
          },
          legend: {
            orient: 'vertical',
            left: 'left',
          },
          series: [
            {
              name: '访问来源',
              type: 'pie',
              radius: '50%',
              data: [
                {value: data.adminSize, name: '管理员访问次数'},
                {value: data.tutorSize, name: '导师访问次数'},
                {value: data.studentSize, name: '学生访问次数'}
              ],
              emphasis: {
                itemStyle: {
                  shadowBlur: 10,
                  shadowOffsetX: 0,
                  shadowColor: 'rgba(0, 0, 0, 0.5)'
                }
              }
            }
          ]
        }
        this.chart.setOption(option)
      },

      //初始化柱状图信息
      initBarCharts(data) {
        this.xData = []
        this.yData = []
        const loginTopList = data.loginTop
        for (let i = 0; i < loginTopList.length; i++) {
          this.yData.push(loginTopList[i].number)
          this.xData.push(loginTopList[i].t_login_user_id)
        }
        this.chart = echarts.init(document.getElementById('bar-chart'))
        var options = {
          title: {
            text: data.loginTopTitle,
            left: 'center'
          },
          tooltip: {
            trigger: 'axis',
            axisPointer: {            // 坐标轴指示器，坐标轴触发有效
              type: 'shadow'        // 默认为直线，可选为：'line' | 'shadow'
            }
          },
          grid: {
            left: '3%',
            right: '5%',
            bottom: '3%',
            containLabel: true
          },
          xAxis: [
            {
              type: 'category',
              data: this.xData,
              axisTick: {
                alignWithLabel: true
              }
            }
          ],
          yAxis: {
            type: 'value'
          },
          series: [{
            name: '登录次数',
            type: 'bar',
            barWidth: '60%',
            data: this.yData,
            backgroundStyle: {
              color: 'rgba(180, 180, 180, 0.2)'
            }
          }]
        };
        this.chart.setOption(options)
      }

    }
  }
</script>


<style scoped>
  .chart {
    display: inline-block;
  }
  .bar-chart {
    float:right;
    right:20px;
  }
</style>
