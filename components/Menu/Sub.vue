<template lang="pug">
ElSubmenu(:index="id")
  template(#title)
    i(:class="'el-icon-' + menu.icon")
  ElMenuItemGroup(v-for="group, gIndex in menu.items", :key="id + '.' + gIndex")
    template(#title) {{ group.title }}
    ElMenuItem(v-for="item, index in group.items", :key="id + '.' + index", :index="check(id + '.' + gIndex + '.' + index, item)") {{ item.title }}
</template>

<script>
import Debug from '../Form/Debug.mixin';
import UrlPattern from 'url-pattern';

export default {
  mixins: [Debug],
  props: {
    menu: {
      type: Object,
      required: true,
    },
    id: {
      type: String,
      required: true,
    },
  },
  methods: {

    getItem(id) {
      const parts = id.split('.');
      return this.menu.items[parts[1]].items[parts[2]];
    },

    check(id, item) {
      if (item.path === $nuxt.$route.path) {
        this.$emit('active', id);
      } else {
        for (const index in item.operations) {
          if (item.operations[index].path === $nuxt.$route.path) {
            this.$emit('active', id + '.' + index);
          }
        }
      }
      return id;
    },

  },
}
</script>
  
<style lang="sass">
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