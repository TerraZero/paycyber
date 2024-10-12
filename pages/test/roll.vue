<template lang="pug">
.page-test.page-test-roll(@click="onClick")
  .container
    img.image#image1(src="https://media.gettyimages.com/id/2159010840/de/foto/kalahari-l%C3%B6wenjunges-neben-seiner-mutter-die-sich-im-sp%C3%A4ten-nachmittagslicht-streckt.jpg?s=2048x2048&w=gi&k=20&c=ODIUhBNomqyCSPUAR8MP5l5ZOaZpqDQfw68-v56sfv8=")
    img.image#image2(:class="classes", src="https://media.gettyimages.com/id/2127929960/de/foto/cannonball-jelly.jpg?s=2048x2048&w=gi&k=20&c=BBr79-dH-knUyq2MiNymviBckNUqAGf_Pn1kNb4NRbY=")
    svg(width="0" height="0")
      filter#clippy
        circle(cx="40", cy="40")
    ExternalDiceBox.page-test-roll__dicer(id="dicer", @init="onInit")
</template>

<script>
export default {
  mounted() {
    setTimeout(() => {
      this.active = true;
    }, 1000);
  },
  data() {
    return {
      active: false,
      box: null,
    };
  },
  computed: {

    classes() {
      return {
        active: this.active,
      };
    },

  },
  methods: {
    onInit({ box }) {
      this.box = box;
      this.box.roll('2d20');
    },
    async onClick() {
      if (this.box) {
        const result = await this.box.roll('2d6');
        console.log(result); 
      }
    },
  },
}
</script>

<style lang="sass">
.page-test-roll
  width: 100vw
  height: 100vh
  overflow: hidden
  position: relative

  &__background
    background: green

  &__dicer
    width: 100%
    height: 100%
    position: absolute
    top: 0
    left: 0

.container
  position: relative
  width: 80%
  height: 80%
  overflow: hidden

.image
  position: absolute
  top: 0
  left: 0
  width: 100%
  height: 100%
  object-fit: cover
  transition: opacity 2s ease-in-out
  clip-path: circle(18.1% at 26% 25%), circle(18.1% at 72% 74%)

</style>