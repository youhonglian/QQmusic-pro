import types from './mutations_types'
export default{
  save_songList(state, songList) {
    state.songList = songList
  },
  changeLinkIndex(state, index) {
    state.linkIndex = index
  },
  changeTagIndex(state, index) {
    state.tagLink = index
  },
  save_singer(state, singer) {
    state.singer = singer
  },
  save_song(state, song) {
    state.song = song
  },
  save_src(state, src) {
    state.src = src
  },
  save_isPlaying(state, isPlaying) {
    state.isPlating = isPlaying
  },
  save_lyric(state, lyric) {
    state.lyric = lyric
  }
}
