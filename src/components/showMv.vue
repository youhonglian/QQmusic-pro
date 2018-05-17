<template>
  <div>
      <!--{{Mv.brs[240]}}-->
       <!--<video autoplay src="http://v4.music.126.net/20180512094227/6a87bc00a9b15a784757801b99277125/web/cloudmusic/mv/20180510113020/8fb609b8-f22c-49cc-8101-abf8aad8cf3d/70a4e8d95c62ac9b400882fdec69e602.mp4"></video>-->
       <!--<video width="320" height="240" controls>
  <source src="http://v4.music.126.net/20180512234536/94c446d674a8b46df82b291715cb68d1/web/cloudmusic/NjEyMTk1NjU=/ae211eb7845081d7bb85b4951195f35a/e36c3ea8f91eeeefe8f5ea8a649aa76e.mp4" type="video/mp4">

</video>-->
<a  target="_blank" rel="noreferrer" href="http://v4.music.126.net/20180512234536/94c446d674a8b46df82b291715cb68d1/web/cloudmusic/NjEyMTk1NjU=/ae211eb7845081d7bb85b4951195f35a/e36c3ea8f91eeeefe8f5ea8a649aa76e.mp4">ds</a>

  </div>
</template>

<script>
  export default {
    data() {
      return{
        id: '',
      }
    },
    computed: {
        Mv() {
            return this.$store.state.Mv
        }
    },
    mounted() {
        this.id = this.$route.params.id
        this.axios.get(`http://127.0.0.1:3000/mv?mvid=${this.id}`)
        .then(res => {
          this.$store.commit('save_Mv', res.data.data)
          console.log(res.data)
        })

    },
    methods: {
           
    }
  }
</script>

<style media="screen">

</style>
