<template>

  <div class="app-container">

    <!-- 学生页面 -->
    <studentVue v-if="roles == 'student'"></studentVue>

    <!-- 解决学生端退出显示左侧导航菜单问题 -->
    <!-- 导师、研究院管理员、图书馆管理员页面 -->
    <tutor-vue v-if="roles == 'admin' || roles == 'tutor' || roles == 'library-admin'"></tutor-vue>

  </div>

</template>

<script>
  import { mapGetters } from 'vuex'
  import studentVue from '../dashboard/components/student'
  import tutorVue from '../dashboard/components/tutor'

  export default {
    computed: {
      ...mapGetters([
        'name',
        'roles'
      ])
    },
    components: {
      studentVue,
      tutorVue
    },

  };
</script>

<style lang="less" scoped>

</style>
