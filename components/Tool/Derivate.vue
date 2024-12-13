<template lang="pug">
ElImage(:src="image")
</template>

<script>
const Request = require('~/custom/frontend/Request');

export default {

  props: ['src', 'resize'],

  data() {
    return {
      derivate: null,
    };
  },

  computed: {

    image() {
      if (this.derivate === null) {
        this.loadDerivate();
      }
      return this.derivate;
    },

  },

  methods: {

    async loadDerivate() {
      const derivate = await Request.create('derivate/getter').GET({
        image: this.src,
        resize: this.resize,
      });
      this.derivate = derivate.path ?? this.src;
    },

  },

};
</script>
  
<style lang="sass">
    
</style> 