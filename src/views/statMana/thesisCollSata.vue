<template>
    <div class="app-container">
      <router-view/>

      <el-form :inline="true" class="demo-from-inline">

        <el-form-item label="年份">
          <el-date-picker v-model="college.T_YEAR" type="year" placeholder="请选择选择年">
          </el-date-picker>
        </el-form-item>

        <el-form-item label="学院">
          <el-select v-model="college.T_COLLEGE_ID" clearable placeholder="请选择学院信息" @change="getName">
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

      <!-- 学院论文提交篇数 -->
      <div class="chart-container">
        <div id="bar-chart" class="bar-chart" style="height:500px;width:100%;"/>
      </div>

      <!-- 学院下专业论文提交篇数 -->
      <div class="chart-container">
        <div id="major-bar-chart" class="major-bar-chart" style="height:500px;width:100%;"/>
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
          college: {},
          collegeList: {},
          collegeName: ''
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
          sataApi.getThesisByCollege(this.college)
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
        },

        getThesisInfo() {
          if (this.college.T_YEAR != null && this.college.T_YEAR != '') {
            this.getThesisInfos();
          }
          if (this.college.T_COLLEGE_ID != null && this.college.T_COLLEGE_ID != '') {
            sataApi.getThesisByMajor(this.college)
            .then(result => {
              const data = result.OUT_DATA.data
              if (data == null) {
                this.$message({
                  type: "warning",
                  message: "没有符合条件的信息"
                })
                return
              }
              this.initMajorBarCharts(data)
            })
          }
        },

        resetData() {
          this.college = {}
          this.getThesisInfos()
        },

        getName(value) {
          let obj = {};
          obj = this.collegeList.find((item)=>{//这里的selectList就是上面遍历的数据源
            return item.T_COLLEGE_ID === value;//筛选出匹配数据
          });
          if (obj == null || obj == {}) {
            this.collegeName = ''
          }else {
            this.collegeName = obj.T_COLLEGE_NAME
          }
        },

        //初始化学院条状图
        initBarCharts(data) {
          // 基于准备好的dom，初始化echarts实例
          this.chart = echarts.init(document.getElementById('bar-chart'))
          // 指定图表的配置项和数据
          var option = {
            title: {
              text: '学院论文提交情况',
              left: 'left'
            },
            tooltip: {
              trigger: 'axis',
              axisPointer: {            // Use axis to trigger tooltip
                type: 'shadow'        // 'shadow' as default; can also be 'line' or 'shadow'
              }
            },
            legend: {
              data: ['未提交', '已提交']
            },
            grid: {
              left: '3%',
              right: '4%',
              bottom: '3%',
              containLabel: true
            },
            xAxis: {
              type: 'value'
            },
            yAxis: {
              type: 'category',
              data: data.collegeNames
            },
            series: [
              {
                name: '未提交',
                type: 'bar',
                stack: 'total',
                label: {
                  show: true
                },
                emphasis: {
                  focus: 'series'
                },
                data: data.noSubmitList
              },
              {
                name: '已提交',
                type: 'bar',
                stack: 'total',
                label: {
                  show: true
                },
                emphasis: {
                  focus: 'series'
                },
                data: data.submitList
              }
            ]
          }
          this.chart.setOption(option)
        },

        //填充专业条状图
        initMajorBarCharts(data) {

          // 基于准备好的dom，初始化echarts实例
          this.chart = echarts.init(document.getElementById('major-bar-chart'))
          // 指定图表的配置项和数据
          var options = {
            title: {
              text: this.collegeName + '论文提交情况',
              left: 'left'
            },
            tooltip: {
              trigger: 'axis',
              axisPointer: {            // Use axis to trigger tooltip
                type: 'shadow'        // 'shadow' as default; can also be 'line' or 'shadow'
              }
            },
            legend: {
              data: ['未提交', '已提交']
            },
            grid: {
              left: '3%',
              right: '4%',
              bottom: '3%',
              containLabel: true
            },
            xAxis: {
              type: 'value'
            },
            yAxis: {
              type: 'category',
              data: data.majorNames
            },
            series: [
              {
                name: '未提交',
                type: 'bar',
                stack: 'total',
                label: {
                  show: true
                },
                emphasis: {
                  focus: 'series'
                },
                data: data.noSubmitList
              },
              {
                name: '已提交',
                type: 'bar',
                stack: 'total',
                label: {
                  show: true
                },
                emphasis: {
                  focus: 'series'
                },
                data: data.submitList
              }
            ]
          }
          this.chart.setOption(options)
        }

      }
    }
</script>

<style scoped>

</style>
