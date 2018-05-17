<template>
  <div>
    <v-cd></v-cd>
    <v-event></v-event>
  </div>
</template>

<script>
  import newCD from './musicDis_c/newCD.vue'
  import event from './musicDis_c/event.vue'

  export default {
    data () {
      return {
        index: ''
      }
    },
    components: {
      'v-cd': newCD,
      'v-event': event,
    },
    mounted() {
      this.$store.commit('changeLinkIndex', 1)
      this.$store.commit('changeTagIndex', 1)
    }
  }
</script>

<style lang="scss">

</style>
