<template>
  <div class="player-cont">
    <div class="player-mask"></div>
    <div class="mod-player" v-if="!isshowLyric">
      <div class="imgUrl" @click="showLyric()">
        <img :src="song[0].al.picUrl" alt="">
      </div>
      <div class="hotComments" v-show="isConment">   
          <div class="comment-item" v-for="item in hotComments ">
              <img class="comment-avatar" :src="item.user.avatarUrl" :title="item.user.nickname">
              <span class="comment">{{item.content}}</span>
          </div>
          <div class="comment-add">
            <input type="text" class="comment-input" v-model="comment" @keyup.enter="addComment()">
            <button class="comment-enter" @click="addComment()">发表评论</button>
          </div>
      </div>
      <div class="mod-footer">
        <a href="javascript:;" class="btn_big_prev"></a>
        <a href="javascript:;" class="btn_big_play" @click="isPlay()" v-if="isPlaying"></a>
        <a href="javascript:;" class="btn_big_pause" @click="isPlay()" v-if="!isPlaying"></a>
        <a href="javascript:;" class="btn_big_next" @click="next()"></a>
        <div class="player_music">
          <div class="music_info">
            <a href="javascript:;" class="song_info">{{song[0].name}}</a>
            -
            <a href="javascript:;" class="singer">{{song[0].ar[0].name}}</a>
          </div>
          <div class="play_music_time">
            <p class="startT">{{transformTime(formatNow)}}</p>
            -
            <p class="endT">{{(transformTime(duration/1000))}}</p>
          </div>
          <div class="player_progress" @click="changeTime($event)">
            <div class="player_progress__inner" >
              <div class="player_progress__load" id="load"></div>
              <div class="player_progress__play" id="play" :style="{width: (now/reDuration).toFixed(3)*1000 + '%'}">
                <i class="player_progress__dot"></i>
              </div>
            </div>
          </div>
        </div>
        <div class="player_progress player_voice">
          <a href="javascript:;" class="btn_big_voice"  @click="voice()" v-if="sound"></a>
          <a href="javascript:;" class="btn_no_voice"  @click="voice()" v-if="!sound"></a>
          <a href="" class="btn_big_down" :download="this.$store.state.src"></a>          
          <a href="javascript:;" class="btn_big_share tooltip"  @click="share()" @onmouseover="share()">
              <div id="share-2" class="tooltiptext" ></div>
          </a>
          <a href="javascript:;" class="btn_comment"  @click="showConment()"></a>
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
      isshowLyric: false,
      move: '',
      sound: true,
      now: 0,
      comment: '',
      isConment: false
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
    },
    hotComments() {
      return this.$store.state.hotComments
    },
    reDuration() {
      return this.duration/100
    },
    formatNow() {
      return parseInt(this.now)
    }
  },
  mounted() {
    let audio = document.querySelector('audio')
    this.now = audio.currentTime
    audio.addEventListener('play', () => {
      this.now = audio.currentTime;
      setInterval(() => {
        this.now = audio.currentTime;
      }, 1000);
      this.now = audio.currentTime
    })
    this.$store.commit('save_isPlaying', false)
    this.id = this.$route.params.id
    let that = this
    this.duration = this.songList[this.id].duration
    this.axios.get(`http://127.0.0.1:3000/music/url?id=${this.songList[this.id].id}`)
      .then(res => {
        that.sid = res.data.data[0].id
        this.$store.commit('save_src', res.data.data[0].url)
        this.axios.get(`http://127.0.0.1:3000/song/detail?ids=${that.sid}`)
          .then(res => {
            this.$store.commit('save_song', res.data.songs)
          })
        this.axios.get(`http://127.0.0.1:3000/comment/music?id=${that.sid}&limit=1`)
        .then(res => {
          this.$store.commit('save_hotComments', res.data.hotComments)
        })
        this.axios.get(`http://localhost:3000/lyric?id=${that.sid}`)
          .then(res => {
            let str = res.data.lrc.lyric
            var arr1 = []
            var arr2 = []
            for (var i = 0; i < str.length; i++) {
              if (str[i].match(/\[/)) {
                arr1.push(i)
              }
              var t = str.substring(arr1[0], arr1[1])
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
      if (this.$store.state.isPlaying) {
            audio.pause()
            this.$store.commit('save_isPlaying', false)
      } else {
            audio.play()
            this.$store.commit('save_isPlaying', true)
      }
    },
    next() {
      this.songList.shift()
    },
    showLyric() {
      this.isshowLyric = !this.isshowLyric
    },
    voice() {
      let audio = document.querySelector('audio')   
      if(this.sound) {
          audio.muted = true
          this.sound = !this.sound
      } else {
          audio.muted = false
          this.sound = !this.sound
      }
    },
    share() {
      $('#share-2').share({sites: ['qzone', 'wechat', 'facebook','twitter']});
    },
    changeTime(event) {
      let audio = document.querySelector('audio')
      let progress = document.querySelector('.player_progress')
      let start = progress.getBoundingClientRect().left;
      let end = event.pageX;
      audio.currentTime = (end - start) / progress.offsetWidth * (this.duration/1000);
      this.now = audio.currentTime;
      audio.play();
      this.$store.commit('save_isPlaying', true);
    },
    success() {
      const h = this.$createElement;
        this.$notify.success({
        message: '评论成功',
        showClose: false
      });
    },
    fail() {
      const h = this.$createElement;
        this.$notify.info({
        message: '评论失败',
        showClose: false
      });
    },
    unlogin() {
      const h = this.$createElement;
        this.$notify.info({
        message: '请登录后发表评论',
        showClose: false
      });
    },
    showConment() {
      this.isConment = !this.isConment
    },
    addComment() {
      if(this.$store.state.isLogin == false) {
        this.unlogin()
      }
      else if(this.comment.trim() != ''){
          this.$store.state.hotComments.unshift({
            user: {
                avatarUrl: `${this.$store.state.user.avatarUrl}`,
                nickname: `${this.$store.state.user.nickname}`,
                },
                content: `${this.comment}`
          })
          this.success()
      }
      else {
          this.fail()
      }
       this.comment = ''
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
.hotComments {
    position: relative;
    width: 37%;
    height: 80%;
    left: 62%;
    overflow-y: scroll;
   .comment-avatar {
        height: 30px;
        width: 30px;
        margin-left: 10px;
        margin-top: 17px;
        border-radius: 80px;
        border: 2px solid rgba(60, 59, 60, 0.1);
   }
   .comment {
        position: relative;
        padding: 8px;
        margin-left: 60px;
        margin-top: -37px;
        color: aliceblue;
        background-color: rgba(52, 52, 52, 0.4);
        border-radius: 5px;
        display: -webkit-box;
        -webkit-line-clamp: 3;
        overflow: hidden;
   }
   .comment-add {
    margin-top: 10px;
      .comment-input {
        margin-left: 60px;
        background-color: rgba(52, 52, 52, 0.4);
        border: 1px solid rgba(52, 52, 52, 0.4);
        border-radius: 5px;
        width: 70%;
        height: 28px;
        color: antiquewhite;
        outline: #31c27c;
    }
    .comment-enter {
        background-color: #31c27c;
        border: 1px solid #31c27c;
        border-radius: 5px;
        color: #fff;
        width: 16%;
        height: 28px;
    }
   }

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
.btn_no_voice,
.btn_comment,
.btn_lang,
.player_progress__dot {
  background: url(https://y.gtimg.cn/mediastyle/yqq/img/player.png?max_age=2592000&v=749f8d7b865b29877500567512879e12);
  background-repeat: no-repeat;
  position: absolute;
  opacity: .8;
}
.btn_big_share {
  background: url('../assets/img/share.png') center center;
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

.btn_big_down
 {
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
    width: 100%;
    .player_progress__inner {
      position: relative;
      height: 2px;
      background: rgba(255, 255, 255, 0.1);
    }
    .player_progress__load {
      height: 2px;
      background: rgba(255, 255, 255, 0.2);
      width: 0%;
    }
    .player_progress__play {
      position: absolute;
      top: 0;
      left: 0;
      height: 2px;
      background: rgba(255, 255, 255, 0.7);
      width: 0%;
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
  .btn_no_voice {
    top: 4px;
    left: -300px;
    width: 26px;
    height: 21px;
    background-position: 0 -180px;
  }
   .btn_big_down {
    top: 4px;
    left: -255px;
    width: 26px;
    height: 21px;
    background-position: 0 -120px;
  }
   .btn_big_share {
    top: 5px;
    left: -210px;
    width: 26px;
    height: 22px;
  }
  .tooltip {
    /*position: relative;*/
    display: inline-block;
    /*border-bottom: 1px dotted black;*/
  }

  .tooltip .tooltiptext {
    visibility: hidden;
    width: 190px;
    /*height: -26px;*/
    background-color: black;
    color: #fff;
    text-align: center;
    border-radius: 8px;
    height: 43px;
    /* padding: 0px 0; */
    top: -50px;
    position: absolute;
    left: -70px;
    z-index: 1;
  }

  .tooltip:hover .tooltiptext {
      visibility: visible;
  }
  .tooltip .tooltiptext::after {
    content: "";
    position: absolute;
    top: 100%;
    left: 50%;
    margin-left: -14px;
    border-width: 5px;
    border-style: solid;
    border-color: black transparent transparent transparent;
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

.btn_comment {
    top: 5px;
    left: -166px;
    width: 26px;
    height: 25px;
    background-position: 0 -400px;
}
</style>
