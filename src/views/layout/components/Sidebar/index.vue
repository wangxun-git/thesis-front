<template>
  <el-scrollbar wrap-class="scrollbar-wrapper">
    <el-menu
      :show-timeout="200"
      :default-active="$route.path"
      :collapse="isCollapse"
      mode="vertical"
      background-color="#5E5FF5"
      text-color="#FEFEFF"
      active-text-color="#66B1FF">
      <sidebar-item v-for="route in routes" :key="route.path" :item="route" :base-path="route.path"/>
    </el-menu>
  </el-scrollbar>
</template>

<script>
import { mapGetters } from 'vuex'
import SidebarItem from './SidebarItem'
import store from "../../../../store";

export default {
  components: { SidebarItem },
  computed: {
    ...mapGetters([
      'sidebar',
      'roles'
    ]),
    routes() {
      // return this.$router.options.routes
      return store.getters.routes
    },
    isCollapse() {
      return !this.sidebar.opened
    }
  }
}
</script>

<style scoped>

</style>
