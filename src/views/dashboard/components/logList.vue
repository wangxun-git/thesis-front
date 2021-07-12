<template>
  <div class="logContainer">
    <el-card class="box-card">
      <div slot="header" class="clearfix">
        <a :href="github" target="_blank">
           <icon-svg icon-class="iconGithub" />
        </a>
        <span>项目更新日志：</span>
      </div>
      <div class="logArea el-scrollbar">
            <div class="item" v-for="(notice,index) in notices" :key="index">
              <p class="timeArea">
                <span class="title">日期：</span>
                <span class="title time">{{notice.T_OUT_TIME}}</span>
              </p>
              <br>
              <div class="logContent">
                <p class="title">更新内容：</p>
                <ul class="logUl">
                  <li>{{notice.T_NOTICE_TITLE}}
                    <el-button size="mini" type="success" round @click="dialogTableVisible = true, setContext(notice)">查看详情</el-button>
                  </li>
                </ul>
              </div>
          </div>
      </div>

      <el-dialog :title="dialogNotice.T_NOTICE_TITLE" :visible.sync="dialogTableVisible">
        <el-form :model="dialogNotice">

          <el-form-item>
            <p>通知内容</p>
            <tinymce :height="200" v-model="dialogNotice.T_NOTICE_CONTEXT" v-if="dialogTableVisible"/>
          </el-form-item>

          <el-form-item label="通知文件" v-if="dialogNotice.T_NOTICE_FILE != null">
            <a @click="downloadFileInfo(dialogNotice.T_NOTICE_ID)">{{dialogNotice.T_NOTICE_FILE}}</a>
          </el-form-item>

        </el-form>
      </el-dialog>

    </el-card>
  </div>
</template>

<script>
  import logsData from "@/assets/datas/logs.json";
  import { github } from "@/utils/env";
  import homeApi from '@/api/system/home.js'
  import dialogBar from "../components/dialog/main.vue"
  //引入富文本编译器
  import Tinymce from '@/components/Tinymce/readOnly'

  export default {
    name:'logList',
    components: {
      dialogBar,
      Tinymce
    },

    data() {
      return {
        logsData:logsData.data,
        github:github,
        notices: {},
        sendVal: false,
        dialogTableVisible: false,
        dialogNotice: {}
      };
    },

    mounted() {
      //获取系统更新日志
      this.getSysUpdLog()
    },

    methods: {
      getSysUpdLog() {
        homeApi.getAllNotice()
        .then(result => {
          const data = result.OUT_DATA.data
          this.notices = data
        })
      },

      setContext(value) {
        this.dialogNotice = value;
      },

      downloadFileInfo(noticeId) {
        homeApi.downloadFile(noticeId)  //文件导出
          .then(result => {
            if (!result) {
              return
            }
            const link = document.createElement('a')
            // let blob = new Blob([result], {type: 'application/vnd.ms-excel'})
            let blob = new Blob([result])
            link.style.display = 'none';
            link.href = URL.createObjectURL(blob);

            link.setAttribute('download', this.dialogNotice.T_NOTICE_FILE)
            document.body.appendChild(link)
            link.click()
            document.body.removeChild(link)
          }).catch(error => {
          console.error(error)
        })
      }

    }
  }
</script>

<style lang="less" scoped>
.logContainer{
    padding: 10px;
    background: #fff;
    box-sizing: border-box;
    height:370px;
    max-height: 370px;
    overflow: hidden;
    border-radius: 6px;
    .logArea{
       overflow: auto;
       height: 100%;
    }
    .item{
       .title{
         font-size: 13px;
       }
       .time{
         color:#87DE75;
       }
        .logContent{
          .logUl{
            padding-left: 30px;
            li{
              font-size: 12px;
              list-style: disc;
              line-height: 20px;
            }
          }
      }
    }
}
  .clearfix:before,
  .clearfix:after {
      display: table;
      content: "";
  }

  .clearfix:after {
      clear: both
  }

  .a-title {
    font-size: 20px;
    font-family: 华文行楷;
    list-style: disc;
    line-height: 20px;
    color: #0d4be7;
  }
</style>

