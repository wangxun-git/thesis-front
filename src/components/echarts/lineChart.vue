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
      id: "lineChart",
      myChart: null,
    };
  },
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
        homeApi.getSevenDaysThesis()
        .then(result => {
          const data = result.OUT_DATA.data
          this.myChart.setOption(this.initOption(data));
        })
      });
    },
    initOption(outData) {
      let data = {
        title: {
          text: "前七天论文情况",
        },
        tooltip: {
          trigger: "axis",
          axisPointer: {
            type: "cross",
            label: {
              backgroundColor: "#6a7985",
            },
          },
        },
        legend: {
          data: ["已提交", "已审核"],
        },
        grid: {
          left: "3%",
          right: "4%",
          bottom: "3%",
          containLabel: true,
        },
        xAxis: [
          {
            type: "category",
            boundaryGap: false,
            data: outData.days,
          },
        ],
        yAxis: [
          {
            type: "value",
          },
        ],
        series: [
          {
            name: "已提交",
            type: "line",
            stack: "总量",
            areaStyle: { normal: {} },
            data: outData.values,
          },
          {
            name: "已审核",
            type: "line",
            // stack: "总 量",
            // areaStyle: { normal: {} },
            data: outData.waitValueList,
          },
        ],
      };
      return data;
    },
  },
  watch: {
    // id:()=>{
    //     this.initOption()
    // }
  },
};
</script>

<style lang="less">
</style>
