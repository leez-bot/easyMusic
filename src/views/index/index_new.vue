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
    <Player />
  </div>
</template>

<script>
import { mapState, mapMutations, mapGetters, mapActions } from "vuex";
import UseInfo from "./useInfo";
import Player from "@/components/player";
import {
  Input,
  Button,
  Table,
  Drawer,
  Icon,
  Spin,
  Page,
  Message
} from "view-design";

export default {
  components: {
    UseInfo,
    Player,
    Input,
    Button,
    Table,
    Drawer,
    Icon,
    Spin,
    Page
  },
  data() {
    return {
      searchVal: "", // 搜索条件
      selectSongs: [], // 表格中选中的歌曲对象
      // 筛选相关
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
      // 搜索结果数据源
      tableData: [],
      // 播放列表显示与否
      playListShow: false,
      infoShow: false
    };
  },
  computed: {
    ...mapState(["loading", "playlist", "currentSong"]),
    tableHeight() {
      let height = document.body.clientHeight - 94 - 54 - 30;
      return height.toString();
    },
    currentIndex() {
      return this.playlist.findIndex(item => item.rid === this.currentSong.rid);
    }
  },
  methods: {
    ...mapActions(["getSongList", "getSongDetail", "addSongToPlaylist"]),
    async search() {
      this.page = 1;
      const { searchVal, page, pagesize } = this;
      if (!searchVal) {
        Message.warning("请输入搜索内容");
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
      this.infoShow = !this.infoShow;
    },
    // 全部播放
    playAll() {
      this.currentIndex = 0;
      this.playlist = (this.tableData.length && this.tableData) || [];
      this.play();
    },
    // 添加单曲到列表并播放
    addAndplayThisSong(song) {
      const { rid } = song;
      let index = this.playlist.findIndex(item => item.rid === rid);
      if (index === -1) {
        this.addSongToPlaylist([song], "play");
      }
    },
    // 播放选中
    playSelect(index) {
      this.currentIndex = index;
      this.play();
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
      Message.error("保护版权，不要下载");
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
      this.addSongToPlaylist(notInPlaylist);
      this.selectSongs = [];
      this.$refs.selection.selectAll(false);
    },
    // 添加歌曲到播放列表
    addSongToPlaylist(song) {
      let { rid } = song;
      let hasSongs = this.playlist.filter(song => song.rid === rid);
      if (hasSongs.length) {
        Message.warning("播放列表已经有这首歌了!");
        return;
      } else {
        this.playlist.push(song);
        Message.success("添加成功!");
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
  mounted() {}
};
</script>

<style lang="less">
@import url("./index.less");
</style>
