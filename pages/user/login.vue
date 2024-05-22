<template lang="pug">
.page
  .frame
    .center
      .logo
      .loader-frame
        .loader
          .loader-balk(:style="loadingStyle")
    DecoArrowUp.deco(size="50px")
</template>

<script>
export default {
  mounted() {
    setTimeout(() => {
      this.loading = 100;
    }, 500);
  },
  data() {
    return {
      loading: 0,
    };
  },
  computed: {
    loadingStyle() {
      return {
        width: this.loading + '%',
      };
    },
  },
}
</script>

<style lang="sass">
.page
  width: 100vw
  height: 100vh
  overflow: hidden
  padding: 1.5em
  box-sizing: border-box

.frame
  border: 2px solid yellow
  width: 100%
  height: 100%
  position: relative

.center
  position: absolute
  top: 50%
  left: 50%
  transform: translate(-50%, -50%)
  display: flex
  flex-direction: column
  align-items: center

.logo
  width: 100px
  height: 100px
  border: 2px solid yellow
  margin-bottom: 2em

.loader-frame
  width: 366px
  height: 20px
  border: 2px solid yellow

.loader
  width: 100%
  height: 100%
  border: 3px solid black
  box-sizing: border-box
  position: relative
  overflow: hidden

.loader-balk
  position: absolute
  top: 0
  left: 0
  bottom: 0
  background: yellow
  transition: width 1s linear

  &::after
    content: ''
    width: 0
    height: 0
    border-style: solid
    border-width: 14px 14px 0 0 
    border-color: yellow transparent transparent transparent
    position: absolute
    left: 100%
    top: 0

.deco
  height: 100%

</style>