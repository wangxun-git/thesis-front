<template>
  <div class="app-container">
    <div class="block">
      <el-timeline>
        <el-timeline-item
          class="timeLine"
          v-for="(activity, index) in activities"
          :key="index"
          :icon="activity.icon"
          :type="activity.type"
          :color="activity.color"
          :size="activity.size"
          :timestamp="activity.timestamp">
          {{activity.content}}
        </el-timeline-item>
      </el-timeline>
    </div>
  </div>
</template>

<script>

  import homeApi from '@/api/system/home.js'

  export default {
    name: 'thesisStatus',
    data() {
      return {
        isUploadThesis: 0,
        activities: [{
          content: '提交论文',
          timestamp: '2018-04-12 20:46',
          size: 'large',
          type: 'success',
          icon: 'el-icon-more'
        }, {
          content: '导师审核',
          size: 'large',
          timestamp: '2018-04-03 20:46',
          type: 'success',
          icon: 'el-icon-more'
        }, {
          content: '研究院审核',
          size: 'large',
          timestamp: '2018-04-03 20:46',
          type: 'success',
          icon: 'el-icon-more'
        }, {
          content: '论文编目',
          size: 'large',
          timestamp: '2018-04-03 20:46',
          type: 'success',
          icon: 'el-icon-more'
        }]
      }
    },

    mounted() {
      //获取登录用户的论文状态
      this.getThesisStatus()
    },

    methods: {
      getThesisStatus() {
        homeApi.getThesisTimeLine()
        .then(result => {
          const data = result.OUT_DATA.data
          for (let i = 0; i < data.length; i++) {
            let flag = data[i].isHaveInfo
            if (1 == flag) {
              this.activities[i].content = data[i].content
              this.activities[i].timestamp = data[i].timestamp
            }else if (0 == flag){
              this.activities[i].type = 'info'
              this.activities[i].timestamp = data[i].timestamp
            }
          }
        })
      }
    }
  }
</script>

<style scoped>
  .block {
    margin: 0 auto;
    width: 100%;
  }
  .timeLine {
    font-size: 17px;
  }
</style>
