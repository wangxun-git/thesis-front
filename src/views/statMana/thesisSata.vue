<template>
    <div class="app-container">
      <router-view/>

      <el-form :inline="true" class="demo-from-inline">

        <el-form-item label="年份">
          <el-date-picker v-model="thesis.T_YEAR" type="year" placeholder="请选择选择年">
          </el-date-picker>
        </el-form-item>

        <el-form-item label="学院">
          <el-select v-model="thesis.T_COLLEGE_ID" clearable placeholder="请选择学院信息">
            <el-option
              v-for="item in collegeList"
              :key="item.T_COLLEGE_ID"
              :label="item.T_COLLEGE_NAME"
              :value="item.T_COLLEGE_ID">
            </el-option>
          </el-select>
        </el-form-item>

        <el-form-item>
          <el-button type="primary" icon="el-icon-search" @click="getThesisInfo()">查询</el-button>
        </el-form-item>

        <el-form-item>
          <el-button type="warning" @click="resetData()">清空</el-button>
        </el-form-item>

      </el-form>

      <!-- 论文提交篇数 -->
      <div class="chart-container">
        <div id="rose-chart" class="rose-chart" style="height:500px;width:100%;"/>
      </div>

      <div class="chart-container">
        <!-- 学生情况 -->
        <div id="pie-chart" class="pie-chart" style="height:500px;width:50%;"></div>

        <!-- 论文月提交情况 -->
        <div id="bar-chart" class="bar-chart" style="height:500px;width:50%;"></div>
      </div>


      <div class="chart-container">

      </div>

    </div>
</template>

<script>

  import * as echarts from 'echarts'
  import sataApi from '@/api/system/sata'
  import collegeApi from '@/api/collegeTutor/college.js'

    export default {
      data() {
        return {
          thesis: {},
          collegeList: {},
          student: {
            T_COLLEGE_ID: '',
            T_GRA_YEAR: ''
          }
        }
      },

      created() {
        //获取学院信息
        this.getCollegeInfoList()
      },

      //初始化DOM之后
      mounted() {
        //获取论文提交情况
        this.getThesisInfos()
      },

      methods: {

        //获取学院信息
        getCollegeInfoList() {
          collegeApi.getAllCollegeInfo()
            .then(result => {
              this.collegeList = result.OUT_DATA.data
            })
        },

        getThesisInfos() {
          //初始化玫瑰图
          sataApi.getThesisByCond(this.thesis)
          .then(result => {
            const data = result.OUT_DATA.data
            if (data == null) {
              this.$message({
                type: "warning",
                message: "没有符合条件的信息"
              })
              return
            }
            this.initRoseType(data)
          })

          //初始化折柱混合图
          sataApi.getThesisByMonth(this.thesis)
          .then(result => {
            const data = result.OUT_DATA.data
            if (data == null) {
              this.$message({
                type: "warning",
                message: "没有符合条件的信息"
              })
              return
            }
            this.initBarCharts(data)
          })

          this.student.T_COLLEGE_ID = this.thesis.T_COLLEGE_ID
          this.student.T_GRA_YEAR = this.thesis.T_YEAR
          //初始化学生饼图
          sataApi.getThesisByStudent(this.student)
          .then(result => {
            const data = result.OUT_DATA.data
            if (data == null) {
              this.$message({
                type: "warning",
                message: "没有符合条件的信息"
              })
              return
            }
            this.initPieCharts(data)
          })
        },

        //条件查询论文信息
        getThesisInfo() {
          sataApi.getThesisByCond(this.thesis)
            .then(result => {
              const data = result.OUT_DATA.data
              if (data == null) {
                this.$message({
                  type: "warning",
                  message: "没有符合条件的信息"
                })
                return
              }
              this.initRoseType(data)
            })

          //初始化折柱混合图
          sataApi.getThesisByMonth(this.thesis)
            .then(result => {
              const data = result.OUT_DATA.data
              if (data == null) {
                this.$message({
                  type: "warning",
                  message: "没有符合条件的信息"
                })
                return
              }
              this.initBarCharts(data)
            })

          this.student.T_COLLEGE_ID = this.thesis.T_COLLEGE_ID
          this.student.T_GRA_YEAR = this.thesis.T_YEAR
          //初始化学生饼图
          sataApi.getThesisByStudent(this.student)
            .then(result => {
              const data = result.OUT_DATA.data
              if (data == null) {
                this.$message({
                  type: "warning",
                  message: "没有符合条件的信息"
                })
                return
              }
              this.initPieCharts(data)
            })

        },

        //清空
        resetData() {
          this.thesis = {}
          this.getThesisInfos()
        },

        //初始化玫瑰图
        initRoseType(data) {
          // 基于准备好的dom，初始化echarts实例
          this.chart = echarts.init(document.getElementById('rose-chart'))
          // 指定图表的配置项和数据
          var option = {
            title: {
              text: data.title,
              left: 'center'
            },
            tooltip: {
              trigger: 'item',
              formatter: '{a} <br/>{b} : {c} ({d}%)'
            },
            legend: {
              top: 'bottom'
            },
            toolbox: {
              show: true,
              feature: {
                mark: {show: true},
                dataView: {show: true, readOnly: false},
                restore: {show: true},
                saveAsImage: {show: true}
              }
            },
            series: [
              {
                name: '篇数',
                type: 'pie',
                radius: [20, 140],
                center: ['50%', '50%'],
                roseType: 'area',
                itemStyle: {
                  borderRadius: 8
                },
                data: [
                  {value: data.waitApproSize, name: '等待审核'},
                  {value: data.approSize, name: '审核通过'},
                  {value: data.noApproSize, name: '审核不通过'},
                  {value: data.waitCataSize, name: '等待编目'},
                  {value: data.cataSize, name: '编目完成'}
                ]
              }
            ]
          }
          this.chart.setOption(option)
        },

        //初始化折柱混合图
        initBarCharts(data) {
          let interval = 2
          let max = 10
          if (data.max <= 10) {
            interval = data.max
            max = data.max + 10
          }else if (data.max <= 100){
            interval = 20
            max = data.max + 50
          }else {
            interval = 50
            max = data.max + 100
          }
          // 基于准备好的dom，初始化echarts实例
          this.chart = echarts.init(document.getElementById('bar-chart'))

          // 指定图表的配置项和数据
          var option = {
            title: {
              text: data.title,
              left: 'center'
            },
            tooltip: {
              trigger: 'axis',
              axisPointer: {
                type: 'cross',
                crossStyle: {
                  color: '#999'
                }
              }
            },
            toolbox: {
              feature: {
                dataView: {show: true, readOnly: false},
                magicType: {show: true, type: ['line', 'bar']},
                restore: {show: true},
                saveAsImage: {show: true}
              }
            },
            xAxis: [
              {
                type: 'category',
                data: ['1月', '2月', '3月', '4月', '5月', '6月', '7月', '8月', '9月', '10月', '11月', '12月'],
                axisPointer: {
                  type: 'shadow'
                }
              }
            ],
            yAxis: [
              {
                type: 'value',
                name: '篇数',
                min: 0,
                max: max,
                interval: interval,
                axisLabel: {
                  formatter: '{value} 篇'
                }
              },
              {
                type: 'value',
                name: '篇数',
                min: 0,
                max: max,
                interval: interval,
                axisLabel: {
                  formatter: '{value} 篇'
                }
              }
            ],
            series: [
              {
                name: '该月论文提交：',
                type: 'bar',
                data: [data.month01 == null ? 0 : data.month01, data.month02 == null ? 0 : data.month02, data.month03 == null ? 0 : data.month03,
                  data.month04 == null ? 0 : data.month04, data.month05 == null ? 0 : data.month05, data.month06 == null ? 0 : data.month06,
                  data.month07 == null ? 0 : data.month07, data.month08 == null ? 0 : data.month08, data.month09 == null ? 0 : data.month09,
                  data.month10 == null ? 0 : data.month10, data.month11 == null ? 0 : data.month11, data.month12 == null ? 0 : data.month12]
              },
              {
                name: '日提交最多：',
                type: 'line',
                yAxisIndex: 1,
                data: [data.day01 == null ? 0 : data.day01, data.day02 == null ? 0 : data.day02, data.day03 == null ? 0 : data.day03,
                  data.day04 == null ? 0 : data.day04, data.day05 == null ? 0 : data.day05, data.day06 == null ? 0 : data.day06,
                  data.day07 == null ? 0 : data.day07, data.day08 == null ? 0 : data.day08, data.day09 == null ? 0 : data.day09,
                  data.day10 == null ? 0 : data.day10, data.day11 == null ? 0 : data.day11, data.day12 == null ? 0 : data.day12]
              }
            ]
          }

          this.chart.setOption(option)
        },

        //初始化学生信息饼图
        initPieCharts(data) {
          // 基于准备好的dom，初始化echarts实例
          this.chart = echarts.init(document.getElementById('pie-chart'))
          // 指定图表的配置项和数据
          var pieOption = {
            title: {
              text: data.title,
              left: 'center'
            },
            tooltip: {
              trigger: 'item'
            },
            legend: {
              top: '5%',
              left: 'center'
            },
            series: [
              {
                name: data.title,
                type: 'pie',
                radius: ['40%', '70%'],
                avoidLabelOverlap: false,
                itemStyle: {
                  borderRadius: 10,
                  borderColor: '#fff',
                  borderWidth: 2
                },
                label: {
                  show: false,
                  position: 'center'
                },
                emphasis: {
                  label: {
                    show: true,
                    fontSize: '40',
                    fontWeight: 'bold'
                  }
                },
                labelLine: {
                  show: false
                },
                data: [
                  {value: data.submitSize, name: '提交人数'},
                  {value: data.noSubmitSize, name: '未提交人数'}
                ]
              }
            ]
          }
          this.chart.setOption(pieOption)

        }

      }
    }
</script>

<style scoped>
  .bar-chart {
    display: inline-block;
  }
  .pie-chart {
    float:right;
    right:20px;
  }
</style>
