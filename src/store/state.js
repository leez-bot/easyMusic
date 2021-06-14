export default {
  loading: false,
  playlist: [], // 播放列表
  playing: false, // 播放状态： false(暂停播放), true(播放中)
  playMode: 'order', // 播放模式： order(顺序播放)、random(随机播放)、loop(单曲循环)
  currentSong: {}, // 当前播放歌曲
}