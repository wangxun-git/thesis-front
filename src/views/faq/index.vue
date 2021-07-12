<template>
  <div class="app-container">
  </div>
</template>

<script>

  import sysApi from '@/api/system/sys'

    export default {
        name: "index",
      data() {
          return {
            list: null
          }
      },

      created() {
          this.getFaqInfo()
      },

      methods: {

        getFaqInfo() {
          sysApi.getAllFaq()
            .then(result => {
              const data = result.OUT_DATA.data
              this.list = data
              console.log(this.list)
            })
        }
      }
    }
</script>

<style scoped>

</style>
