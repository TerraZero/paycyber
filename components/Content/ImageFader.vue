<template lang="pug">
.content-image-fader(:class="classes")
  transition(name="fader")
    ContentViewImage(:key="current.value.url", v-bind="current.value")
</template>
  
<script>  
import Util from '~/custom/system/modules/utils/Util';

export default {
  props: ['images'],
  data() {
    return {
      index: 0,
      indexes: [],
      timeout: null,
    };
  },
  watch: {
    images: {
      handler() {
        this.shuffle();
        this.nextImage();
      },
      immediate: true,
    },
  },
  computed: {

    current() {
      return this.images[this.index];
    },

    classes() {
      const classes = [];

      return classes;
    },

    styles() {
      const styles = {};

      return styles;
    },

  },
  methods: {

    shuffle() {
      this.indexes = this.images.keys();
      this.indexes = Util.shuffle(this.indexes);
      if (this.indexes[0] === this.index) {
        [this.indexes[0], this.indexes[this.indexes.length - 1]] = [this.indexes[this.indexes.length - 1], this.indexes[0]];
      }
    },

    nextImage() {
      clearTimeout(this.timeout);
      let newIndex = null;
      if (this.indexes.length === 1) {
        newIndex = this.indexes[0];
        this.shuffle();
      } else {
        newIndex = this.indexes.shift();
      }
      this.index = newIndex;
      this.timeout = setTimeout(this.nextImage, this.current.value.timeout ?? 10000);
    },

  },
};
</script>

<style lang="sass">
.content-image-fader
  width: 100%
  height: 100%
  overflow: hidden
</style>