<template>
  <div class="mod_index mod_index--new mod_slide_box" style="background: #000 url(https://y.gtimg.cn/mediastyle/yqq/img/bg_index_new.jpg) 50% 0 repeat-x;"
    id="albumlist_box" @mouseover="arrow" @mouseout="arrowL">
    <div class="section_inner">
      <div class="index__hd">
        <h2 class="index__tit">
          <i class="index__tit_sprite" style="background-position:0 -136px"></i>
          <i class="icon_txt">新碟首发</i>
        </h2>
        <i class="index__line index__line--left"></i>
        <i class="index__line index__line--right"></i>
      </div>
      <a href="y.qq.com/portal/album_lib.html#stat=y_new.index.album.more" class="index__more index__more--white js_album_more">
        全部
        <i class="icon_index_arrow"></i>
      </a>
      <div class="mod_index_tab">
        <a href="" class="index_tab__item js_tab" v-for="item in navList">{{item}}</a>
      </div>
      <el-carousel :interval="5000" arrow="always" indicator-position="outside" height="450px">
        <el-carousel-item v-for="item in 4" :key="item">
          <div class="mod_playlist mod_slide">
            <ul class="playlist__list slide__list" id="albumlist" style="left:-1200px;">
              <a class="playlist__item slide__item" v-for="(item,index) in lastMv" :href="Mv[index]" rel="noreferrer" target="_blank">
                <a class="playlist__item_box" target="_blank" rel="noreferrer" :href="Mv[item]">
                  <div class="playlist__cover mod_cover">
                    <a :href="Mv[item]" class="js_album" target="_blank" rel="noreferrer">
                      <img :src='item.picUrl'
                        class="playlist__pic">
                      <i class="mod_cover__mask"></i>
                      <i class="mod_cover__icon_play js_play"></i>
                    </a>
                  </div>
                  <h4 class="playlist__title">
                    <span class="playlist__title_txt">
                      <a href="javascript:;" class="js_album">{{item.name}}</a>
                    </span>
                    <a href="javascript:;" class="btn_opera_menu js_albumlist_more">
                      <span class="icon_txt">更多</span>
                    </a>
                  </h4>
                  <div class="playlist__author">
                    <a href="javascript:;" class="js_singer">{{item.artistName}}</a>
                  </div>
                </a>
              </a>
            </ul>
          </div>
        </el-carousel-item>
      </el-carousel>
    </div>
  </div>
</template>

<script>
  export default {
    data() {
      return {
        id: []
      }
    },
    computed: {
      lastMv() {
        return this.$store.state.lastMv
      },
      Mv() {
        return this.$store.state.Mv
      }
    },
    mounted() {
      this.axios.get(`http://127.0.0.1:3000/personalized/mv`)
        .then(res => {
          this.$store.commit('save_lastMv', res.data.result)
          let that = this
          for (let i = 0; i <= 4; i++) {
            this.id.push(this.$store.state.lastMv[i].id)
              this.axios.get(`http://127.0.0.1:3000/mv?mvid=${this.id[i]}`)
                .then(res => {
                  that.$store.state.Mv.push(res.data.data.brs[720])
                })
          }     
        })
    },
    methods: {
      arrow: function () {
        const sab = document.querySelectorAll('.slide_action__btn')
        for (var i = 0; i < sab.length; i++) {
          sab[i].style.transform = 'translatex(0)'
        }
      },
      arrowL: function () {
        const sab = document.querySelectorAll('.slide_action__btn')
        sab[0].style.transform = 'translatex(-100%)'        
      }
    }
  }
  

</script>

<style lang="scss" scoped>
  @import "./style/newCD.scss"
</style>