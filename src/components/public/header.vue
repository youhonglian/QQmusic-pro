<template>
  <div>
    <div class="mod_header">
      <div class="section_inner">
        <h1 class="qqmusic_title">
          <router-link to="/">
            <img class="qqmusic_logo" src="../../assets/img/logo.png" alt="qqmusic">
          </router-link>
        </h1>
        <ul class="mod_top_nav">
          <li class="top_nav__item top_nav__item--room" @click="changeFlagA()">
            <router-link class="top_nav_link" :class="{'top_nav_link--current': linkIndex==1}" to="/musicDis">音乐馆</router-link>
          </li>
          <li class="top_nav__item top_nav__item--mine" @click="changeFlagB()">
            <router-link class="top_nav_link" :class="{'top_nav_link--current': linkIndex==2}" to="/myMusic">我的音乐</router-link>
          </li>
          <li class="top_nav__item top_nav__item--down">
            <router-link class="top_nav_link" :class="{'top_nav_link--current': linkIndex==3}" to="/player">正在播放</router-link>
          </li>
        </ul>
        <ul class="mod_top_subnav" v-if="routerFlag" >
          <li class="top_subnav__item" >
            <router-link to="/musicDis" class="top_subnav__link" :class="{'top_subnav__link--current': tagLink==1}">首页</router-link>
          </li>
          <li class="top_subnav__item" >
            <router-link  to="/musicDis/singer" class="top_subnav__link" :class="{'top_subnav__link--current': tagLink==2}">歌手</router-link>
          </li>
        </ul>
        <ul class="mod_top_subnav" v-if="!routerFlag">
          <li class="top_subnav__item">
            <router-link to="/myMusic" class="top_subnav__link" :class="{'top_subnav__link--current': tagLink== 1}">首页</router-link>
          </li>
          <li class="top_subnav__item">
            <router-link to="/myMusic/MyList" class="top_subnav__link" :class="{'top_subnav__link--current': tagLink== 2}">我的歌单</router-link>
          </li>
          <li class="top_subnav__item">
            <router-link to="/myMusic/Mylove" class="top_subnav__link" :class="{'top_subnav__link--current': tagLink==3}">我喜欢的歌</router-link>
          </li>
        </ul>
        <div class="mod_top_search" @mouseout="schleave">
          <div class="mod_search_input">
            <input type="text" class="search_input__input" v-model="keyword" placeholder="先搜一下吧" @click="dropmenu" @keyup.enter="search(keyword)">
            <button class="search_input__btn">
              <i class="icon_search" @click="search(keyword)"></i>
              <span class="icon_text"></span>
            </button>
          </div>
          <div class="js_smartbox">
            <div class="mod_search_other" :class="drop?'drop':''">
              <div class="search_hot">
                <dl class="search_hot__list">
                  <dt class="search_hot__tit">热门搜索</dt>
                  <dd>
                    <a href="javascript:;" class="search_hot__link js_smartbox_search
                      js_left" data-name="" @click="search('鹿晗')">
                        <span class="search_hot__number">1</span>
                        <span class="search_hot__name">鹿晗</span>
                        <span class="search_hot__listen">100.6万</span>
                    </a>
                    <a href="javascript:;" class="search_hot__link js_smartbox_search
                      js_left" data-name="" @click="search('薛之谦')">
                        <span class="search_hot__number">2</span>
                        <span class="search_hot__name">薛之谦</span>
                        <span class="search_hot__listen">80.6万</span>
                    </a>
                    <a href="javascript:;" class="search_hot__link js_smartbox_search
                      js_left" data-name="" @click="search('周杰伦')">
                        <span class="search_hot__number">3</span>
                        <span class="search_hot__name">周杰伦</span>
                        <span class="search_hot__listen">78.6万</span>
                    </a>
                    <a href="javascript:;" class="search_hot__link js_smartbox_search
                      js_left" data-name="" @click="search('Bigbang')">
                        <span class="search_hot__number">4</span>
                        <span class="search_hot__name">Bigbang</span>
                        <span class="search_hot__listen">66.6万</span>
                    </a>
                  </dd>
                </dl>
              </div>
            </div>
          </div>
        </div>
        <div class="header__opt">
          <span class="mod_top_login">
            <img class="avatar" v-show='isLogin?true:false'
              :src="this.$store.state.user.avatarUrl" alt="">
            <p class="nickname"  v-show='isLogin?true:false'>{{this.$store.state.user.nickname}}gbgggggg</p>
            <a href="#" class="top_login__link js_login" v-show='isLogin?false:true' @click="unLogin()">未登录</a>              
            <a href="javascript:;" class="mod_btn_green top_login__btn_vip js_openvip" @click="dialogShow()" >开通豪华版</a>
            <!--<a href="#" class="mod_btn top_login__btn_vip js_openmusic">开通付费包</a>-->    

            <!--<el-button type="text" @click="dialogVipVisible = true" class="mod_btn_green profile_unlogin__btn js_login" v-if="!isLogin">立即登录</el-button>      -->
            <el-dialog title="开通豪华版" :visible.sync="dialogVipVisible" class="dialog-vip" style="z-index: 3000">
              <img src="../../assets/img/vip.png" alt="">
            </el-dialog>
          </span>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import {mapActions, mapState} from 'vuex'
  export default {
    data () {
      return {
        drop: false,
        keyword: '',
        routerFlag: true,
        dialogVipVisible: false
        // nickname: this.$store.state.user.nickname
      }
    },
    mounted () {
      console.log(this.$route.path)
      console.log(this.$store.state)
    },
    computed: {
      linkIndex () {
        return this.$store.state.linkIndex
      },
      tagLink () {
        return this.$store.state.tagLink
      },
      avatarUrl () {
        return this.$store.state.user.avatarUrl
      },
      nickname () {
        return this.$store.state.user.nickname
      },
      isLogin () {
        return this.$store.state.isLogin
      }
    },
    methods: {
      search: function (keyword, error) {
        if (keyword.trim()) {
          console.log(keyword)
          this.axios.get(`http://127.0.0.1:3000/search?keywords=${keyword}`)
            .then(res => {
              this.$store.commit('save_songList', res.data.result.songs)
              console.log('歌单   '+ this.$store.state.songList[0])
              this.$router.push({path: '/artList', query: {keyword: this.keyword}})
            })
        } else {
          alert(error)
        }
      },
      schleave: function () {
        setTimeout(
          () => {
            this.drop = false
          }, 5000)
      },
      dropmenu: function () {
        this.drop = true
      },
      changeFlagA: function() {
        this.routerFlag = true
      },
      changeFlagB: function() {
        this.routerFlag = false
      },
      unLogin: function () {
        this.$router.push({path: '/myMusic'})
      },
      dialogShow: function () {
        this.dialogVipVisible = true
        this.$store.commit("changeMask", true)
        console.log('mask'+ this.$store.state.mask)
        console.log(this.$store.state.user.nickname)
        console.log(this.$store.state.user.avatarUrl)
      }
    }
  }
</script>

<style lang="css" scoped>
  @import "./style/header.css";
</style>
