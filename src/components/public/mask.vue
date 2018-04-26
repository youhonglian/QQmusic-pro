<template>
<div class="mask-cell" v-if="mask"></div>
</template>

<script>
export default {
    data() {
        return {
            mask: this.$store.state.mask
        }
    }
}
</script>

<style lang="scss" scoped>
.mask-cell {
    position: fixed;
    left: 0;
    top: 0;
    width: 100%;
    height: 100%;
    opacity: .5;
    background: #000;
    z-index: 99;
}
</style>