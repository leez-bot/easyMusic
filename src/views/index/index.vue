<template>
  <div class="index-wrapper">
    <Input search style="width:200px" placeholder="输入搜索内容" @on-search='search' />
    <Table />
  </div>
</template>

<script>
import { mapState, mapMutations, mapGetters, mapActions } from 'vuex'

export default {
  data() {
    return {
      list: [],
    }
  },
  computed: {
  },
  methods: {
    ...mapActions(['getSongList', 'getSongDetail']),
    async search(val) {
      let data = await this.getSongList({
        keyword: '周杰伦',
        page: 1,
        pagesize: 30
      })
      console.log('data', data)
    }
  },
  mounted() {
    this.getSongDetail()
  }
}
</script>

<style scoped lang="less">
  .index-wrapper {
    position: relative;
  }
</style>