<template>
  <div class="mini-play-wraper">
    <audio
      class="mini-player"
      controls
      :src="currentPlayUrl"
      autoplay="autoplay"
      @ended="end"
      :loop="playMode === 'one'"
    ></audio>
    <div class="tools">
      <img :src="playModeIcon" alt class="play-mode" @click="switchPlayMode" />
      <Icon type="md-list" @click="togglePlayList" />
    </div>
  </div>
</template>

<script>
import { mapState, mapGetters } from "vuex";
import { Icon } from "view-design";
export default {
  components: { Icon },
  computed: {
    ...mapState(["playMode"]),
    ...mapGetters(["currentPlayUrl"]),
    playModeIcon() {
      let iconObj = {
        order: "loop-list",
        loop: "loop-one",
        random: "random-play"
      };
      return require(`../assets/images/${iconObj[this.playMode]}.png`);
    }
  },
  data() {
    return {};
  },
  methods: {
    // 播放列表歌曲
    async play() {
      const song = this.playlist[this.currentIndex] || {};
      const { rid = "", name = "未知歌曲", artist = "未知歌手" } = song;
      let src = await this.getSongDetail({ rid });
      this.playSrc = src.url;
      document.title = `${name}_${artist}`;
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
    }
  },
  mounted() {}
};
</script>

<style lang='less' scoped>
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
    .play-mode {
      width: 20px;
    }
  }
}
</style>