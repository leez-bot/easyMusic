<template>
  <div class="index-wrapper">
    <div class="tool-wrapper">
      <Button type="primary" @click="playSelect" :disabled='!selectSongs.length'>播放选中</Button>
      <Input search style="width:200px" placeholder="输入搜索内容" @on-search='search' v-model="searchVal" />
      <Button @click="togglePlayList" type="primary">播放列表</Button>
    </div>
    <Table @on-selection-change='selectChange'  border ref="selection" :columns="columns" :data="tableData" />
    <Drawer title="Basic Drawer" :closable="false" v-model="playListShow">
      <p v-for="item in selectSongs" :key='item.id' style="cursor: pointer" @click="playSong(item.id)">{{ item.gqm }}</p>
    </Drawer>
    <div class="mini-play-wraper">
      <audio class="mini-player" controls :src='playSrc' autoplay="autoplay" @ended='end'></audio>
    </div>
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
            return h('div',[
              h('Icon', {
                props: {type: 'md-arrow-dropright-circle'},
                style: { fontSize: '20px',cursor: 'pointer', marginRight: '10px' },
                attrs: { title: '单曲播放' },
                on: {
                  click: () => {
                    this.playSong(params.row.id)
                  }
                }
              }),
              h('Icon', {
                props: {type: 'md-add'},
                style: { fontSize: '20px',cursor: 'pointer', marginRight: '10px' },
                attrs: { title: '添加到播放列表' },
                on: {
                  click: () => {
                    this.addSongToPlaylist(params.row)
                  }
                }
              }),
              h('a', {
                attrs: { href: params.row.id }
              },[
                h('Icon', {
                  props: {type: 'md-download'},
                  style: { fontSize: '20px',cursor: 'pointer',  },
                  attrs: { title: '下载' },
                  on: {
                    click: () => {
                      this.playSong(params.row.id)
                    }
                  }
                })
              ]),
            ])
          }
        }
      ],
      tableData: [],
      selectSongs: [],
      currentIndex: 0,
      playListShow: false
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
    },
    // 选中
    selectChange(selectSongs) {
      this.selectSongs = selectSongs
    },
    // 播放选中
    playSelect() {
      let id = this.selectSongs[this.currentIndex].id
      if (id) {
        this.playSong(id)
      }
    },
    // 播放完毕
    end() {
      if (this.currentIndex === this.selectSongs.length - 1) {
        this.currentIndex = 0
      } else {
        this.currentIndex++
      }
      this.playSelect()
    },
    // 切换播放列表
    togglePlayList() {
      this.playListShow = !this.playListShow
    },
    // 添加歌曲到播放列表
    addSongToPlaylist(song) {
      let { id } = song
      let hasSongs = this.selectSongs.filter(song => song.id === id)
      if (hasSongs.length) {
        this.$Message.warning('播放列表已经有这首歌了!')
        return
      }else {
        this.selectSongs.push(song)
        this.$Message.success('添加成功!')
      }
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
    height: 100%;
    .mini-play-wraper{
      width: 100%;
      position: fixed;
      bottom: 0;
      display: flex;
      justify-content: center;
      .mini-player{
        width: 100%;
        background: #fff;
        z-index: 9;
      }
    }
  }
</style>
