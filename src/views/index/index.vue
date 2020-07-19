<template>
  <div class="index-wrapper">
    <!-- 操作区 -->
    <div class="tool-wrapper">
      <div style="text-align: center">
        <Input
          class="search-input"
          search
          clearable
          placeholder="歌手、单曲、专辑"
          @on-search="search"
          v-model="searchVal"
        />
      </div>

      <div class="btn-group">
        <div class="left">
          <Button
            type="warning"
            @click="playAll"
            :disabled="!tableData.length"
            style="margin-right: 10px"
            size="small"
          >
            <Icon type="md-play" />全部播放
          </Button>
          <Button
            type="primary"
            size="small"
            @click="addToPlaylist"
            :disabled="!selectSongs.length"
          >
            <Icon type="md-add" />添加
          </Button>
        </div>
        <div class="right">
          <Button
            size="small"
            icon="logo-github"
            to="https://github.com/C-old-M-oon/easyMusic"
            target="_blank"
            style="margin-right: 10px"
          >源码</Button>
          <Button size="small" icon="ios-notifications-outline" @click="toggleInfo">须知</Button>
        </div>
      </div>
    </div>
    <!-- 使用须知 -->
    <UseInfo :infoShow="infoShow" @hideInfo="toggleInfo" />
    <!-- 搜索结果列表 -->
    <div class="table-wrapper" style="position: relative">
      <Table
        @on-selection-change="selectChange"
        border
        ref="selection"
        :columns="columns"
        :data="tableData"
        :height="tableHeight"
        class="song-list-table"
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
        :key="item.rid"
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
            {{ item.name }}
            -
            {{ item.artist }}
          </div>
        </div>
        <div style="cursor: pointer" class="item-tools">
          <Icon @click="playSelect(index)" type="ios-play-outline" v-if="index !== currentIndex" />
          <Icon @click="deleteSong(index)" type="ios-trash-outline" />
        </div>
      </div>
    </Drawer>
    <!-- 播放器 -->
    <div class="mini-play-wraper">
      <audio
        class="mini-player"
        controls
        :src="playSrc"
        autoplay="autoplay"
        @ended="end"
        :loop="playMode === 'one'"
      ></audio>
      <div class="tools">
        <img :src="playModeIcon" alt class="play-mode" @click="switchPlayMode" />
        <Icon type="md-list" @click="togglePlayList" />
      </div>
    </div>
  </div>
</template>

<script>
import { mapState, mapMutations, mapGetters, mapActions } from "vuex";
import UseInfo from './useInfo'

export default {
  components: { UseInfo },
  data() {
    return {
      searchVal: "",
      playSrc: "",
      list: [],
      page: 1,
      pagesize: 30,
      total: 0,
      columns: [
        {
          type: "selection",
          width: 50,
          align: "center"
        },
        {
          title: "歌曲名",
          key: "name",
          align: "center"
        },
        {
          title: "歌手",
          key: "artist",
          align: "center"
        },
        {
          title: "专辑",
          key: "album",
          align: "center"
        },
        {
          title: "操作",
          key: "deel",
          align: "center",
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
                  props: { type: "ios-play-outline" },
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
                  props: { type: "ios-add" },
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
                //     attrs: { href: params.row.rid }
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
      playListShow: false,
      playMode: "list",
      infoShow: false
    };
  },
  computed: {
    ...mapState(["loading"]),
    tableHeight() {
      let height = document.body.clientHeight - 94 - 54 - 30;
      return height.toString();
    },
    playModeIcon() {
      let iconObj = {
        list: "loop-list",
        one: "loop-one",
        random: "random-play"
      };
      return require(`../../assets/images/${iconObj[this.playMode]}.png`);
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
      this.total = Number(data.total);
    },
    toggleInfo() {
      this.infoShow = !this.infoShow
    },
    // 全部播放
    playAll() {
      this.currentIndex = 0;
      this.playlist = (this.tableData.length && this.tableData) || [];
      this.play();
    },
    // 单曲播放
    addAndplayThisSong(song) {
      const { rid } = song;
      let index = this.playlist.findIndex(item => item.rid === rid);
      if (index === -1) {
        this.playlist.push(song);
        this.currentIndex = this.playlist.length - 1;
        this.play();
      } else {
        this.currentIndex = index;
        this.play();
      }
    },
    // 播放选中
    playSelect(index) {
      this.currentIndex = index;
      this.play();
    },
    // 播放列表歌曲
    async play() {
      if (!this.playlist.length) {
        this.$Message("暂无歌曲播放!");
        return;
      }
      const song = this.playlist[this.currentIndex] || {};
      const { rid = "", name = '未知歌曲', artist = '未知歌手' } = song;
      let src = await this.getSongDetail({ rid });
      this.playSrc = src.url;
      document.title = `${name}_${artist}`
    },
    // 删除列表歌曲
    deleteSong(index) {
      this.playlist.splice(index, 1);
      if (index === this.playlist.length) {
        this.currentIndex = 0;
        this.play();
      }
      if (index === this.currentIndex) {
        this.play();
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
        map[item.rid] = true;
      });
      this.selectSongs.map(item => {
        if (!map[item.rid]) notInPlaylist.push(item);
      });
      this.playlist.push(...notInPlaylist);
      this.selectSongs = [];
      this.$refs.selection.selectAll(false);
    },
    // 播放完毕
    end() {
      if (this.playMode === "random") {
        let len = this.playlist.length;
        let _index = Math.floor(Math.random() * len);
        this.currentIndex = _index;
      } else {
        if (this.currentIndex === this.playlist.length - 1) {
          this.currentIndex = 0;
        } else {
          this.currentIndex++;
        }
      }
      this.play();
    },
    // 切换播放模式
    switchPlayMode() {
      if (this.playMode === "list") {
        this.playMode = "one";
      } else if (this.playMode === "one") {
        this.playMode = "random";
      } else {
        this.playMode = "list";
      }
    },
    // 切换播放列表
    togglePlayList() {
      this.playListShow = !this.playListShow;
    },
    // 添加歌曲到播放列表
    addSongToPlaylist(song) {
      let { rid } = song;
      let hasSongs = this.playlist.filter(song => song.rid === rid);
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
  }
};
</script>

<style lang="less">
@import url('./index.less');
</style>
