<template>
  <div class="index-wrapper">
    <!-- 操作区 -->
    <div class="tool-wrapper">
      <div style="text-align: right">
        <Input
          search
          style="width:200px"
          placeholder="歌手、单曲、专辑"
          @on-search="search"
          v-model="searchVal"
        />
      </div>

      <div style="text-align: left;margin-top:10px">
        <Button
          type="warning"
          @click="playAll"
          :disabled="!tableData.length"
          style="margin-right: 10px"
          size="small"
        >
          <Icon type="md-play" />全部播放
        </Button>
        <Button type="primary" size="small" @click="addToPlaylist" :disabled="!selectSongs.length">
          <Icon type="md-add" />添加
        </Button>
      </div>
    </div>
    <!-- 搜索结果列表 -->
    <div class="table-wrapper" style="position: relative">
      <Table
        @on-selection-change="selectChange"
        border
        ref="selection"
        :columns="columns"
        :data="tableData"
        :height="tableHeight"
      />
      <Spin fix v-if="loading"></Spin>
    </div>
    <Page
      class="pages"
      :current="page"
      :total="total"
      size="small"
      show-sizer
      :page-size-opts="[10, 30, 50, 100, 200]"
      :page-size="pagesize"
      @on-change="pageChange"
      @on-page-size-change="sizeChange"
    />
    <!-- 播放列表 -->
    <Drawer :closable="false" v-model="playListShow" class-name="play-list-wrapper" width="300">
      <slot name="header">
        <p class="play-list-header">
          播放列表
          <Icon @click="clearPlaylist" type="ios-trash-outline" />
        </p>
      </slot>
      <div
        :class="{active: index === currentIndex, 'play-list-item': true}"
        v-for="(item, index) in playlist"
        :key="item.id"
      >
        <div class="item-name">
          <div class="audio-icon unselectable" v-if="index === currentIndex">
            <div class="column" style="animation-delay:-1.2s"></div>
            <div class="column"></div>
            <div class="column" style="animation-delay:-1.5s"></div>
            <div class="column" style="animation-delay:-0.9s"></div>
            <div class="column" style="animation-delay:-0.6s"></div>
          </div>
          <div class="song-info">
            {{ item.gqm }}
            -
            {{ item.gs }}
          </div>
        </div>
        <div style="cursor: pointer" class="item-tools">
          <Icon @click="play(index)" type="ios-play-outline" v-if="index !== currentIndex" />
          <Icon @click="deleteSong(index)" type="ios-trash-outline" />
        </div>
      </div>
    </Drawer>
    <!-- 播放器 -->
    <div class="mini-play-wraper">
      <audio
        class="mini-player"
        @click.stop="clickPlayer"
        controls
        :src="playSrc"
        autoplay="autoplay"
        @ended="end"
      ></audio>
      <div class="tools">
        <Icon type="md-repeat" />
        <Icon type="md-list" @click="togglePlayList" />
      </div>
    </div>
  </div>
</template>

<script>
import { mapState, mapMutations, mapGetters, mapActions } from "vuex";

export default {
  data() {
    return {
      searchVal: "周杰伦",
      playSrc: "",
      list: [],
      page: 1,
      pagesize: 30,
      total: 0,
      columns: [
        {
          type: "selection",
          width: 40,
          align: "center"
        },
        {
          title: "歌曲名",
          key: "gqm"
        },
        {
          title: "歌手",
          key: "gs"
        },
        {
          title: "专辑",
          key: "zj"
        },
        {
          title: "操作",
          key: "deel",
          render: (h, params) => {
            return h(
              "div",
              {
                style: {
                  display: "flex"
                }
              },
              [
                h("Icon", {
                  props: { type: "md-arrow-dropright-circle" },
                  style: {
                    fontSize: "20px",
                    cursor: "pointer",
                    marginRight: "10px"
                  },
                  attrs: { title: "单曲播放" },
                  on: {
                    click: () => {
                      this.addAndplayThisSong(params.row);
                    }
                  }
                }),
                h("Icon", {
                  props: { type: "md-add" },
                  style: {
                    fontSize: "20px",
                    cursor: "pointer",
                    marginRight: "10px"
                  },
                  attrs: { title: "添加到播放列表" },
                  on: {
                    click: () => {
                      this.addSongToPlaylist(params.row);
                    }
                  }
                })
                // h(
                //   "a",
                //   {
                //     attrs: { href: params.row.id }
                //   },
                //   [
                //     h("Icon", {
                //       props: { type: "md-download" },
                //       style: { fontSize: "20px", cursor: "pointer" },
                //       attrs: { title: "下载" },
                //       on: {
                //         click: () => {
                //           this.downLoadSong(params.row);
                //         }
                //       }
                //     })
                //   ]
                // )
              ]
            );
          }
        }
      ],
      tableData: [],
      selectSongs: [],
      playlist: [],
      currentIndex: 0, // 当前播放歌曲在播放列表中的下标
      playListShow: false
    };
  },
  computed: {
    ...mapState(["loading"]),
    tableHeight() {
      let height = document.body.clientHeight - 94 - 54 - 30;
      return height.toString();
    }
  },
  methods: {
    ...mapActions(["getSongList", "getSongDetail"]),
    async search() {
      const { searchVal, page, pagesize } = this;
      if (!searchVal) {
        this.$Message.warning("请输入搜索内容");
        return;
      }
      let data = await this.getSongList({
        keyword: searchVal,
        page,
        pagesize
      });
      this.tableData = data.list || [];
      this.total = Number(data.count);
    },
    clickPlayer() {},
    // 全部播放
    playAll() {
      this.currentIndex = 0;
      this.playlist = (this.tableData.length && this.tableData) || [];
      this.play(this.currentIndex);
    },
    // 单曲播放
    addAndplayThisSong(song) {
      const { id } = song;
      let index = this.playlist.findIndex(item => item.id === id);
      if (index === -1) {
        this.playlist.push(song);
        this.currentIndex = this.playlist.length - 1;
        this.play(this.currentIndex);
      } else {
        this.currentIndex = index;
        this.play(index);
      }
    },
    // 播放列表歌曲
    async play(index) {
      this.currentIndex = index;
      if (!this.playlist.length) {
        this.$Message("暂无歌曲播放!");
        return;
      }
      const song = this.playlist[index] || {};
      const { id = "" } = song;
      let src = await this.getSongDetail({ id });
      this.playSrc = src.wma;
    },
    deleteSong(index) {
      this.playlist.splice(index, 1);
      if (index === this.currentIndex) {
        this.play(index);
      }
    },
    // 下载歌曲
    downLoadSong(song) {
      this.$Message.error("保护版权，不要下载");
    },
    // 选中
    selectChange(selectSongs) {
      this.selectSongs = selectSongs;
    },
    // 添加选中到播放列表
    addToPlaylist() {
      let map = {};
      let notInPlaylist = [];
      this.playlist.map(item => {
        map[item.id] = true;
      });
      this.selectSongs.map(item => {
        if (!map[item.id]) notInPlaylist.push(item);
      });
      console.log(notInPlaylist);
      this.playlist.push(...notInPlaylist);
      this.selectSongs = [];
      this.$refs.selection.selectAll(false);
    },
    // 播放完毕
    end() {
      if (this.currentIndex === this.playlist.length - 1) {
        this.currentIndex = 0;
      } else {
        this.currentIndex++;
      }
      this.play(this.currentIndex);
    },
    // 切换播放列表
    togglePlayList() {
      this.playListShow = !this.playListShow;
    },
    // 添加歌曲到播放列表
    addSongToPlaylist(song) {
      let { id } = song;
      let hasSongs = this.playlist.filter(song => song.id === id);
      if (hasSongs.length) {
        this.$Message.warning("播放列表已经有这首歌了!");
        return;
      } else {
        this.playlist.push(song);
        this.$Message.success("添加成功!");
      }
    },
    // 清空播放列表
    clearPlaylist() {
      this.playlist = [];
      this.playSrc = "";
    },
    // 页码变化
    pageChange(page) {
      this.page = page;
      this.search();
    },
    sizeChange(size) {
      this.page = 1;
      this.pagesize = size;
      this.search();
    }
  },
  mounted() {
    // this.getSongDetail()
  }
};
</script>

<style lang="less">
.index-wrapper {
  position: relative;
  height: 100%;
  padding: 0 10px;
  .tool-wrapper {
    padding: 10px 0;
  }
  .mini-play-wraper {
    width: 100%;
    position: fixed;
    bottom: 0;
    left: 0;
    display: flex;
    align-items: center;
    background: #f1f3f4;
    z-index: 9;
    .mini-player {
      width: 85%;
      height: 36px;
    }
    .tools {
      flex: 1;
      font-size: 20px;
      display: flex;
      justify-content: space-around;
    }
  }
  .pages {
    text-align: right;
    margin-top: 15px;
    .ivu-page-options-sizer {
      margin-right: 0;
    }
  }
}

.play-list-wrapper {
  .play-list-header {
    font-size: 18px;
  }
  .play-list-item {
    border-bottom: 1px solid #ccc;
    display: flex;
    padding: 5px 0;
    justify-content: space-between;
    &.active {
      color: #ff410f;
    }
    .item-name {
      display: flex;
      align-items: center;
      width: 85%;
      .song-info {
        width: calc(100% - 25px);
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
      }
      .audio-icon {
        margin-right: 5px;
        display: flex;
        width: 20px;
        height: 12px;
        min-width: 20px;
        overflow: hidden;
        .column {
          &:first {
            margin-left: 0;
          }
          width: 2px;
          height: 100%;
          margin-left: 2px;
          background-color: #ff410f;
          animation: play 0.9s linear infinite alternate;
        }
      }
    }
    .item-tools {
      font-size: 20px;
    }
  }
}

@keyframes play {
  0% {
    margin-top: 0;
  }
  50% {
    margin-top: 9px;
  }
  100% {
    margin-top: 0;
  }
}
</style>
