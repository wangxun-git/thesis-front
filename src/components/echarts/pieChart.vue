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
      id: "ordertype",
      myChart: null,
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
        //获取论文信息
        homeApi.getThesisByStatus()
          .then(result => {
            const data = result.OUT_DATA.data
            this.myChart.setOption(this.initOption(this.type, data));
          })
      });
    },
    initOption(type, outData) {
      let text, legend_data, series_data;
      if (type == "ordertype") {
        text = "论文提交情况";
        legend_data = ["等待审核", "审核通过", "审核不通过", "等待编目", "编目完成"];
        series_data = [
          { value: outData.status0, name: "等待审核" },
          { value: outData.status1, name: "审核通过" },
          { value: outData.status2, name: "审核不通过" },
          { value: outData.status3, name: "等待编目" },
          { value: outData.status4, name: "编目完成" },
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
            name: "论文篇数",
            type: "pie",
            radius: "50%",
            center: ["50%", "60%"],
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
