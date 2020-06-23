<template>
  <div class="index-wrapper">
    <audio controls="" :src='playSrc' autoplay="autoplay"></audio>
    <Input search style="width:200px" placeholder="输入搜索内容" @on-search='search' v-model="searchVal" />
    <Table  border ref="selection" :columns="columns" :data="tableData" />
  </div>
</template>

<script>
import { mapState, mapMutations, mapGetters, mapActions } from 'vuex'

export default {
  data() {
    return {
      searchVal: '周杰伦',
      playSrc: '',
      list: [],
      page: 1,
      pagesize: 30,
      columns: [
        {
            type: 'selection',
            width: 40,
            align: 'center'
        },
        {
          title: '歌曲名',
          key: 'gqm'
        },
        {
          title: '歌手',
          key: 'gs'
        },
        {
          title: '所属专辑',
          key: 'zj'
        },
        {
          title: '操作',
          key: 'deel',
          render: (h, params) => {
            return h('Icon', {
              props: {
                type: 'md-arrow-dropright-circle'
              },
              on: {
                click: () => {
                  this.playSong(params.row.id)
                }
              }
            })
          }
        }
      ],
      tableData: []
    }
  },
  computed: {
  },
  methods: {
    ...mapActions(['getSongList', 'getSongDetail']),
    async search(val) {
    const { searchVal, page, pagesize } = this
      let data = await this.getSongList({
        keyword: searchVal,
        page,
        pagesize
      })
      this.tableData = data
    },
    // 播放单曲
    async playSong(id) {
      let src = await this.getSongDetail({ id })
      this.playSrc = src.wma
    }
  },
  mounted() {
    // this.getSongDetail()
  }
}
</script>

<style scoped lang="less">
  .index-wrapper {
    position: relative;
  }
</style>