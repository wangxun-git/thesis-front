<template>
    <div class="main">
        <div class="show-info" @click="openMask">查看详情</div>
        <dialog-bar v-model="sendVal" type="danger" title="我是标题" content="asdsadsa" v-on:cancel="clickCancel()" @danger="clickDanger()" @confirm="clickConfirm()" dangerText="Delete">
          <el-input placeholder="adssadasdsas"></el-input>
        </dialog-bar>
    </div>
</template>
<script>
import dialogBar from './dialog.vue'
export default {
   components:{
        'dialog-bar': dialogBar,
    },
    data(){
        return{
            sendVal: false,
        }
    },
    methods:{
        openMask(index){
          console.log(index)
            this.sendVal = true;
        },
        clickCancel(){
            console.log('点击了取消');
        },
        clickDanger(){
            console.log('这里是danger回调函数')
        },
        clickConfirm(){
            console.log('点击了confirm');
        }
    }
}
</script>
<style lang="less" scoped>
  .show-info {
    font-size: 15px;
  }
</style>
