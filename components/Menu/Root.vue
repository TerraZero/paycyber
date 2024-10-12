<template lang="pug">
ElMenu.menu-root(mode="vertical", :collapse="true", @select="onSelect")
  MenuSub(v-for="item, index in menu", :key="index", :index="index", :menu="item", :id="index", @active="onActive")
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
  },
  methods: {

    getItem(id) {
      const parts = id.split('.');
      return this.menu[parts[0]].items[parts[1]].items[parts[2]];
    },

    onSelect(item, path) {
      const menuitem = this.getItem(path.pop());
      const pattern = new UrlPattern(menuitem.url);
      this.$router.push(pattern.stringify(menuitem.params));
    },

    onActive(id) {
      const menuitem = this.getItem(id);
      this.$emit('getActive', menuitem, id);
    },

  },
};
</script>
  
<style lang="sass">
.menu-root
  height: 100%

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