<template lang="pug">
.page-test-screencha(:class="classes", @click="onClick")
  img.page-test-screencha__background(:src="background")
  .page-test-screencha__cha
    .page-test-screencha__item-1
      .page-test-screencha__mask-1
    .page-test-screencha__item-2
      .page-test-screencha__mask-2
    .page-test-screencha__item-3
      img.page-test-screencha__background(:src="cha2")

</template>

<script>
export default {
  data() {
    return {
      show: false,
      background: '/media/demo/myz/images/saeuregras.webp',
      cha1: '/media/demo/myz/cha/ghoul-2.png',
      cha2: '/media/demo/myz/cha/ghoul-1.png',
    };
  },
  computed: {
    
    classes() {
      const classes = [];

      if (this.show) classes.push('show');

      return classes.map(v => 'page-test-screencha--' + v);
    },

  },  
  methods: {

    onClick() {
      this.show = !this.show;
    },

  },
}
</script>

<style lang="sass">
.page-test-screencha
  width: 100vw
  height: 100vh
  overflow: hidden
  position: relative

  &__background
    width: 100%
    height: 100%
    object-fit: cover

  &__cha
    position: absolute
    bottom: 0
    top: 0
    right: 0
    width: 0
    background: black
    border-left: 0 solid white
    transition: all .5s ease-in-out
    box-sizing: border-box

  &--show &__cha
    width: 25vw
    border-left: 5px solid white

  &__item-1,
  &__item-2,
  &__item-3
    position: absolute
    bottom: 0
    right: -20vw
    width: 14vw
    transition: all .7s .3s ease-in-out

    & > img
      object-fit: contain

  &--show &__item-1,
  &--show &__item-2,
  &--show &__item-3
    right: calc(100% - 7vw)

  &__item-1
    bottom: 25vh
    transform: scale(1.4)
    transition: all .5s .3s ease-in-out

  &__item-2
    bottom: 0
    width: 20vw
    transform: rotateY(180deg)

  &--show &__item-2
    right: calc(100% - 4vw)

  &__item-3
    transition: all .9s .3s ease-in-out

  &__item-1,
  &__item-2
    filter: drop-shadow(0 0 5px white) drop-shadow(0 0 5px white)

  &__mask-1,
  &__mask-2
    mask-image: url("/media/demo/myz/cha/ghoul-2.png")
    background: #222
    mask-size: 100%
    width: 250px
    height: 250px

  &__mask-2
    mask-image: url("/media/demo/myz/cha/ghoul-1.png")
    width: 400px
    height: 400px

</style>