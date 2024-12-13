<template lang="pug">
.tool-persistent-slider
  transition(name="fade-only")
    .tool-persistent-slider__image(:key="current.slide?.src", :style="slideStyle")
</template>

<script>
import RandomUtil from '~/custom/frontend/RandomUtil';

export default {

  data() {
    return {
      slides: [],
      line: [],
      current: {},
      play: false,
    };
  },

  computed: {

    slideStyle() {
      const styles = {};

      if (this.current.slide?.src) {
        styles['background-image'] = 'url(' + this.current.slide.src + ')';
      }
      return styles;
    },

  },

  methods: {

    setSlides(slides) {
      this.slides = slides;
      this.line = [];
      this.next();
    },

    next() {
      if (this.line.length === 0) {
        if (this.slides.length === 1) {
          this.line = [0];
        } else {
          this.line = RandomUtil.getRandomIndexArray(this.slides);
          if (this.line[0] === this.current?.index) this.line.shift();
        }
      }
      clearTimeout(this.current.timeout);
      this.current = {
        index: this.line.shift(),
      };
      this.current.slide = this.slides[this.current.index];
      if (this.slides.length !== 1) {
        this.current.timeout = setTimeout(() => {
          this.next();
        }, this.current.slide.time);
      }
    },

  },

};
</script>
  
<style lang="sass">
.tool-persistent-slider
  width: 100%
  height: 100%
  position: relative

  &__image
    position: absolute
    top: 0
    left: 0
    width: 100%
    height: 100%
    background-size: cover
    background-position: center
    
</style> 