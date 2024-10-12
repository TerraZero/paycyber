<template lang="pug">
ElButtonGroup
  ElButton(v-for="item, index in operations", :key="index", :type="getActiveMode(index)", @click="onClick(index)")
    i(v-if="item.before", :class="'el-icon-' + item.before")
    span(v-if="item.label") {{ item.label }}
    i(v-if="item.after", :class="'el-icon-' + item.after")
</template>

<script>
import UrlPattern from 'url-pattern';

export default {
  props: {
    operations: {
      type: Object,
      required: true,
    },
    params: {
      type: Object,
    },
  },
  watch: {
    params: {
      handler(params) {
        this.proxy = {};
        for (const index in this.operations) {
          const pattern = new UrlPattern(this.operations[index].url);
          this.proxy[index] = pattern.stringify(params);
        }
      },
      deep: true,
      immediate: true,
    },
  },
  data() {
    return {
      proxy: {},
    };
  },
  methods: {
    getActiveMode(index) {
      if (this.proxy[index] === $nuxt.$route.path) return this.operations[index].type ?? 'primary';
      return 'default';
    },
    onClick(index) {
      this.$router.push(this.proxy[index]);
    },
  },
};
</script>
  
<style lang="sass">

</style>