<template>
  <div :id="id" class="orderArea"></div>
</template>

<script>
  import * as echarts from 'echarts'
  import echartsTheme from "../echarts/theme/westeros.json";
  import homeApi from '@/api/system/home.js'

  export default {
    data() {
      return {
        id: "stutype",
        myChart: null,
        studentNums: '',
      };
    },
    props: ["type"],

    mounted() {
      this.loadChart();
    },
    beforeDestroy() {
      if (!this.myChart) {
        return;
      }
      this.myChart.dispose();
      this.myChart = null;
    },
    methods: {
      loadChart() {
        this.$nextTick(() => {
          echarts.registerTheme("westeros", echartsTheme);
          this.myChart = echarts.init(
            document.getElementById(this.id),
            "westeros"
          );
          homeApi.getSubmitStu()
          .then(result => {
            const data = result.OUT_DATA.data
            this.studentNums = data.total
            console.log(this.studentNums)
            this.myChart.setOption(this.initOption(this.type, data));
          })
        });
      },
      initOption(type, outData) {
        let text, legend_data, series_data;
        if (type == "stutype") {
          text = "学生人数: " + outData.total;
          legend_data = ["已提交学生数", "未提交学生数"];
          series_data = [
            { value: outData.submitCount, name: "已提交学生数" },
            { value: outData.noSubmitCount, name: "未提交学生数" },
          ];
        }
        let data = {
          title: {
            text: text,
            x: "center",
          },
          tooltip: {
            trigger: "item",
            formatter: "{a} <br/>{b} : {c} ({d}%)",
          },
          legend: {
            orient: "vertical",
            left: "left",
            data: legend_data,
          },
          series: [
            {
              name: "学生人数",
              type: "pie",
              radius: "80%",
              center: ["60%", "50%"],
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
        return data;
      },
    },
    watch: {
      type: (v) => {
        this.initOption(v);
      },
    },
  };
</script>

<style lang="less">
</style>
