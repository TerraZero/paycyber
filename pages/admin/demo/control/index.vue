<template lang="pug">
.demo-control
  | hallo
</template>

<script>
const Request = require('~/custom/frontend/Request');

export default {
  async asyncData() {
    const items = await Request.create('demo/load-multi').POST({
      ids: [1, 2],
    });
    return { images: items };
  },
  computed: {

    classes() {
      const classes = [];

      return classes;
    },

  },
  methods: {

  },
}
</script>
  
<style lang="sass">
.demo-control
  width: 100vw
  height: 100vh
  overflow: hidden
</style>