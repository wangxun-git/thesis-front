<template>
  <div :id="id" class="orderArea"></div>
</template>

<script>
  import * as echarts from 'echarts'
  import echartsTheme from "../echarts/theme/westeros.json";
  import homeApi from '@/api/system/home.js'

export default {
  name: "radarChart",
  data() {
    return {
      id: "radarChart",
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
        this.myChart = echarts.init(document.getElementById(this.id), "westeros");
        homeApi.getThesisByCollege()
        .then(result => {
          const data = result.OUT_DATA.data
          this.myChart.setOption(this.initOption(data));
        })
      });
    },
    initOption(data) {
      let nameList = data.nameList
      let countList = data.countList
      let max = data.maxCount + 10
      let indicator = []
      nameList.forEach(item => indicator.push({
        'name': item,
        'max': max
      }))
      let option = {
        title: {
          text: '各学院论文提交情况',
        },
        radar: {
          indicator: indicator,
        },
        series: [{
          name: '',
          type: 'radar',
          data: [
            {
              value: countList,
              name: '论文篇数: ',
              label: {
                normal: {
                  show: true,
                  color: "#2dee0b", // 顶点数字颜色
                  fontSize: 16, // 顶点数字大小
                  formatter: function (params) {
                    return params.value;
                  },
                  textStyle: {
                    color: '#428BD4'
                  }
                },
              },
            },
          ]
        }]
      };
      return option;
    },
  },
  watch: {},
};
</script>

<style lang="less">
</style>
