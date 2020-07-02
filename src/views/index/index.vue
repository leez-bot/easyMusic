<template>
  <div class="index-wrapper">
    <div class="tool-wrapper">
      <Button type="primary" @click="addToPlaylist" :disabled="!selectSongs.length">添加到播放列表</Button>
      <Input
        search
        style="width:200px"
        placeholder="歌手、单曲、专辑"
        @on-search="search"
        v-model="searchVal"
      />
      <Button @click="togglePlayList" type="primary">播放列表</Button>
    </div>
    <Table
      @on-selection-change="selectChange"
      border
      ref="selection"
      :columns="columns"
      :data="tableData"
    />
    <Drawer title="播放列表" :closable="false" v-model="playListShow">
      <p
        v-for="(item, index) in playlist"
        :key="item.id"
        style="cursor: pointer"
        @click="play(index)"
      >{{ item.gqm }}</p>
    </Drawer>
    <div class="mini-play-wraper">
      <audio class="mini-player" controls :src="playSrc" autoplay="autoplay" @ended="end"></audio>
    </div>
  </div>
</template>

<script>
import { mapState, mapMutations, mapGetters, mapActions } from "vuex";

export default {
  data() {
    return {
      searchVal: "",
      playSrc: "",
      list: [],
      page: 1,
      pagesize: 30,
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
          title: "所属专辑",
          key: "zj"
        },
        {
          title: "操作",
          key: "deel",
          render: (h, params) => {
            return h("div", [
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
                    this.playThisSong(params.row);
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
              }),
              h(
                "a",
                {
                  attrs: { href: params.row.id }
                },
                [
                  h("Icon", {
                    props: { type: "md-download" },
                    style: { fontSize: "20px", cursor: "pointer" },
                    attrs: { title: "下载" },
                    on: {
                      click: () => {
                        this.addAndPlay(params.row);
                      }
                    }
                  })
                ]
              )
            ]);
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
  computed: {},
  methods: {
    ...mapActions(["getSongList", "getSongDetail"]),
    async search(val) {
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
      this.tableData = data;
    },
    // 单曲播放
    async playThisSong(song) {
      const { id } = song;
      let src = await this.getSongDetail({ id });
      this.playSrc = src.wma;
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
    // 选中表单单曲，添加到播放列表并播放当前
    addAndPlay(song) {
      this.playlist.push(song);
      let len = this.playlist.length;
      this.play(len - 1);
    },
    // 选中
    selectChange(selectSongs) {
      this.selectSongs = selectSongs;
    },
    // 添加选中到播放列表
    addToPlaylist() {
      this.playlist.push(...this.selectSongs);
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
      let hasSongs = this.selectSongs.filter(song => song.id === id);
      if (hasSongs.length) {
        this.$Message.warning("播放列表已经有这首歌了!");
        return;
      } else {
        this.selectSongs.push(song);
        this.$Message.success("添加成功!");
      }
    }
  },
  mounted() {
    // this.getSongDetail()
  }
};
</script>

<style scoped lang="less">
.index-wrapper {
  position: relative;
  height: 100%;
  .mini-play-wraper {
    width: 100%;
    position: fixed;
    bottom: 0;
    display: flex;
    justify-content: center;
    .mini-player {
      width: 100%;
      background: #fff;
      z-index: 9;
    }
  }
}
</style>
