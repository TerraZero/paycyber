<template lang="pug">
.layout-admin-page
  .layout-admin-page__sidebar
    MenuRoot(v-if="menu", :menu="menu", @getActive="onActive")
  transition(name="fade-up")
    .layout-admin-page__content(v-if="loaded")
      .layout-admin-page__header(v-if="title || operations && params")
        h1.layout-admin-page__title(v-if="title") {{ title }}
        MenuOperations.layout-admin-page__operations(v-if="operations && params", :operations="operations", :params="params")
      .layout-admin-page__content-group
        slot
</template>

<script>
export default {
  props: {
    params: {
      type: [Object, null],
      require: true,
    },
  },
  async fetch() {
    const menu = await this.$axios.$get(`/api/menu`);
    this.menu = menu.menu;
  },
  data() {
    this.$nextTick(() => {
      this.loaded = true;
    });
    return {
      operations: null,
      loaded: false,
      menu: null,
    };
  },
  computed: {

    title() {
      if (this.operations) {
        for (const index in this.operations) {
          if (this.operations[index].path === $nuxt.$route.path) return this.operations[index].title ?? null;
        }
      }
      return null;
    },

  },
  methods: {

    onActive(item) {
      if (item.operations) {
        this.operations = item.operations;
      }
    },

  },
}
</script>
  
<style lang="sass">
.layout-admin-page
  background: #121212
  min-height: 100vh
  box-sizing: border-box
  display: grid
  grid-template-columns: 64px 1fr

  &__menu
    height: 100%
    background: #222
    border-color: #333
  
  &__content
    box-sizing: border-box
    padding: 0 1em

  &__content-group
    background: #333
    max-width: 1200px
    border: 2px solid black
    box-sizing: border-box
    margin: 0 auto
    box-shadow: 0 10px 10px black
    width: 100%
    border: 1px solid white

    &:first-child
      margin-top: 1em

  &__header
    margin: 0 auto
    max-width: 1200px

  &__title
    margin-bottom: 0

  &__operations
    margin-top: 1em

  &__operations .el-button
    border-radius: 0

.el-menu
  font-family: sans-serif
  padding: 0
  border: 1px solid #333
  background: #222

.el-menu-item
  line-height: 1em
  height: auto
  padding: 1em 0
  color: #909399

  &:hover
    background: #666
    color: black

.el-menu-item-group__title
  font-size: 1.5em
  padding: 0 !important
  margin: 7px
  border-bottom: 2px solid #333
  text-align: center

</style>