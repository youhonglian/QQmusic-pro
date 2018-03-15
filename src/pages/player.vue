<template>
  <div class="player-cont">
    <div class="player-mask"></div>
    <!--<div class="player-bg"-->
    <!--style="background: url(song[0].al.picUrl);"></div>-->
    <div class="mod-player" v-if="!isshowLyric">
      <div class="imgUrl" @click="showLyric()">
        <img :src="song[0].al.picUrl" alt="">
      </div>
      <div class="mod-footer">
        <a href="javascript:;" class="btn_big_prev"></a>
        <a href="javascript:;" class="btn_big_play" @click="isPlay()" v-if="isPlaying"></a>
        <a href="javascript:;" class="btn_big_pause" @click="isPlay()" v-if="!isPlaying"></a>
        <a href="javascript:;" class="btn_big_next" @click="next()"></a>
        <div class="player_music">
          <div class="music_info">
            <a href="" class="song_info">{{song[0].name}}</a>
            -
            <a href="" class="singer">{{song[0].ar[0].name}}</a>
          </div>
          <div class="play_music_time">
            <p class="startT">00:00</p>
            -
            <p class="endT">{{(transformTime(duration/1000))}}</p>
          </div>
          <div class="player_progress">
            <div class="player_progress__inner">
              <div class="player_progress__load"></div>
              <div class="player_progress__play">
                <i class="player_progress__dot"></i>
              </div>
            </div>
          </div>
          <el-progress :percentage="50"></el-progress>
        </div>
        <div class="player_progress player_voice">
          <a href="javascript:;" class="btn_big_voice"  @click="voice()">
            <i class="icon_txt"></i>
          </a>
          <div class="player_progress__inner">
            <div class="player_progress__play">
              <i class="player_progress__dot"></i>
            </div>
          </div>
        </div>
      </div>
    </div>
    <pre class="mod-lyric" v-if="isshowLyric" @click="showLyric()">
       {{lyric}}
    </pre>
  </div>
</template>

<script>
import { mapState, mapAction } from 'vuex'
export default {
  data() {
    return {
      id: '',
      audio: '',
      songUrl: [],
      sid: '',
      singPic: '',
      duration: '',
      isshowLyric: false
    }
  },
  computed: {
    songList() {
      return this.$store.state.songList
    },
    song() {
      return this.$store.state.song
    },
    isPlaying() {
      return this.$store.state.isPlaying
    },
    lyric() {
      return this.$store.state.lyric
    }
  },
  mounted() {
    this.id = this.$route.params.id
    let that = this
    this.duration = this.songList[this.id].duration
    this.axios.get(`http://music-u.leanapp.cn/music/url?id=${this.songList[this.id].id}`)
      .then(res => {
        that.sid = res.data.data[0].id
        console.log('that.sid' + that.sid)
        this.$store.commit('save_src', res.data.data[0].url)
        this.axios.get(`http://music-u.leanapp.cn/song/detail?ids=${that.sid}`)
          .then(res => {
            this.$store.commit('save_song', res.data.songs)
          })
        this.axios.get(`https://api.imjad.cn/cloudmusic/?type=lyric&id=${that.sid}`)
          .then(res => {
            console.log(res.data.lrc.lyric)
            let str = res.data.lrc.lyric
            var arr1 = []
            var arr2 = []
            for (var i = 0; i < str.length; i++) {
              if (str[i].match(/\[/)) {
                arr1.push(i)
              }
              var t = str.substring(arr1[0], arr1[1])
              console.log(t)
              t = t.substring(0, 10) + '                  ' + t.substring(10)
              for (var j = 1; j < arr1.length; j++) {
                var lyricSub = str.substring(arr1[j], arr1[j + 1])
                var s = '     '+lyricSub.substring(0, 10) + '                  ' + lyricSub.substring(10)
                var t = t + '\n' + s
              }
            }
            this.$store.commit('save_lyric', t)
          })
      })
  },
  methods: {
    transformTime: function (seconds) {
      let m, s;
      m = Math.floor(seconds / 60);
      m = m.toString().length == 1 ? ('0' + m) : m;
      s = Math.floor(seconds - 60 * m);
      s = s.toString().length == 1 ? ('0' + s) : s;
      return m + ':' + s;
    },
    isPlay() {
      console.log(this.$store.state.isPlaying)
      if (this.$store.state.isPlaying) {
        audio.pause()
        this.$store.state.isPlaying = !this.$store.state.isPlaying
      } else {
        audio.play()
        this.$store.state.isPlaying = !this.$store.state.isPlaying
      }
    },
    next() {

    },
    showLyric() {
      this.isshowLyric = !this.isshowLyric
    },
    voice() {
      // this.$refs.audio.volume = 0
      console.log(this.$refs.audio)
      // console.log('dfsdf')
    }
  }
}
</script>

<style lang="scss" scoped>
.player-cont {
  color: #fff;
  height: 600px;
  position: relative;
  overflow: hidden;
}

a {
  color: #fff;
}

.player-mask,
.player-bg,
.mod-player {
  width: 100%;
  height: 100%;
}

.player-bg {
  background-size: cover;
  background-position: 50%;
  filter: blur(54px);
  opacity: .7;
  transform: translateZ(0);
  position: absolute;
  top: 0;
  left: 0;
  z-index: 1;
}

.player-mask {
  position: absolute;
  background-color: rgba(0, 0, 0, 0.45);
  z-index: 2;
  box-shadow: 0 3px 4px rgba(255, 255, 255, 0.5);
  /*width: 100%;*/
  height: 100%;  
}

.mod-player {
  position: relative;
  z-index: 3;
  /*width: 100%;*/
  height: 600px;
  /*overflow: auto;*/
}

.mod-lyric {
  position: relative;
    z-index: 3;
    margin-left: 300px;
    margin-right: 300px;
    padding-top: 50px;
    padding-bottom: 50px;
    color: black;
    font-size: 16px;
    height: 450px;
    overflow-y: auto;
    font-family: YouYuan
}

.imgUrl {
  position: absolute;
  display: block;
  top: 16%;
  left: 39%;
  img {
    height: 300px;
    width: 300px;
    border-radius: 10px;
    box-shadow: -2px 2px 2px rgba(0, 0, 0, .5);
  }
  &:after {
    content: '';
    position: absolute;
    left: 124px;
    top: 58px;
    width: 201px;
    height: 180px;
    background: url(https://y.gtimg.cn/mediastyle/yqq/img/album_cover_player.png) 0 0 no-repeat;
  }
}

.btn_big_down,
.btn_big_like,
.btn_big_next,
.btn_big_only,
.btn_big_play,
.btn_big_pause,
.btn_big_prev,
.btn_big_style_list,
.btn_big_style_order,
.btn_big_style_random,
.btn_big_style_single,
.btn_big_voice,
.btn_lang,
.player_progress__dot {
  background: url(https://y.gtimg.cn/mediastyle/yqq/img/player.png?max_age=2592000&v=749f8d7b865b29877500567512879e12);
  background-repeat: no-repeat;
  position: absolute;
  opacity: .8;
}

.mod-footer {
  position: absolute;
  margin: 0 100px;
  bottom: 0;
  left: 0;
  width: 100%;
  height: 11%;
}

.btn_big_prev {
  top: 4px;
  left: 0;
  width: 19px;
  height: 20px;
  background-position: 0 -30px;
}

.btn_big_play {
  top: 0;
  left: 76px;
  width: 21px;
  height: 29px;
  background-position: -27px 0;
  a {
    background-color: rgba(225, 225, 225, .8);
  }
}

.btn_big_pause {
  top: 0;
  left: 76px;
  width: 21px;
  height: 29px;
  background-position: 0 0;
  a {
    background-color: rgba(225, 225, 225, .8);
  }
}

.btn_big_pause {
  top: 0;
  left: 76px;
  width: 21px;
  height: 29px;
  background-position: 0 0;
  a {
    background-color: rgba(225, 225, 225, .8);
  }
}

.btn_big_next {
  top: 4px;
  left: 148px;
  width: 19px;
  height: 20px;
  background-position: 0 -52px;
}

.player_music {
  position: relative;
  margin: 0 412px 0 208px;
  .music_info {
    padding-right: 90px;
    overflow: hidden;
    white-space: nowrap;
    text-overflow: ellipsis;
  }
  .play_music_time {
    position: absolute;
    width: px;
    top: 0;
    right: 0;
    .startT {
      float: left;
    }
    .endT {
      float: right;
    }
  }
  .player_progress {
    padding-top: 6px;
    height: 8px;
    cursor: pointer;
    .player_progress__inner {
      position: relative;
      height: 2px;
      background: rgba(255, 255, 255, 0.1);
    }
    .player_progress__load {
      height: 2px;
      background: rgba(255, 255, 255, 0.2);
    }
    .player_progress__play {
      position: absolute;
      top: 0;
      left: 0;
      height: 2px;
      background: rgba(255, 255, 255, 0.7);
    }
    .player_progress__dot {
      top: -4px;
      right: -4px;
      width: 10px;
      height: 10px;
      background-position: 0 -170px;
      opacity: 1;
      filter: none;
    }
  }
}

.player_voice {
  position: absolute;
  top: 0;
  right: 0;
  width: 80px;
  padding-top: 13px;
  .btn_big_voice {
    top: 4px;
    left: -300px;
    width: 26px;
    height: 21px;
    background-position: 0 -144px;
  }
}

.player_progress {
  height: 8px;
  cursor: pointer;
}

.player_progress__inner {
  position: relative;
  height: 2px;
  background: rgba(255, 255, 255, 0.1);
}
</style>
