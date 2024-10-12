<template lang="pug">
.demo-screen-battle(:class="classes")
  .demo-screen-battle__cha-row
  .demo-screen-battle__cha-attr
    .demo-screen-battle__cha(v-if="current.chas", v-for="cha in current.chas", :class="cha.classes")
      img.demo-screen-battle__img(:src="cha.src")

</template>

<script>
export default {
  data() {
    return {
      rows: [],
      current: {},
    };
  },
  computed: {
    
    classes() {
      const classes = [];

      return classes.map(v => 'demo-screen-battle--' + v);
    },

  },
}
</script>

<style lang="sass">
.demo-screen-battle
  width: 100%
  height: 100%
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
    filter: brightness(.7) hue-rotate(80deg)
    transition: all .9s .3s ease-in-out

</style>