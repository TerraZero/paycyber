<template lang="pug">
.demo-map-grid(ref="root", :class="classes", @drag="onDrag", @mousedown.left="onMouseDown", @mouseup.left="onMouseUp", @dragover="onDragOver", @scroll.prevent.stop="onScroll")
  .demo-map-grid__latch
    i.demo-map-grid__button.el-icon-location(@click.prevent.stop="onReset")
    i.demo-map-grid__button.el-icon-zoom-in(@click.prevent.stop="onZoomIn")
    i.demo-map-grid__button.el-icon-zoom-out(@click.prevent.stop="onZoomOut")
  .demo-map-grid__item(:style="styles", draggable="true", @transitionend="focusing = false")
    .demo-map-grid__grid(ref="grid", :style="gridStyles")
      .demo-map-grid__sector(v-for="index in (width * height)", :key="index", :class="sectorClasses(index - 1)", @click="onGrid(index - 1)")
    img.demo-map-grid__image(:src="image")
  .demo-map-grid__sidebar
    .demo-map-grid__catch(@click.stop="onClose")
    .demo-map-grid__content(@click.stop)
      .demo-map-grid__controls
        i.demo-map-grid__button.el-icon-close(@click="onClose")
      ElForm.demo-map-grid__form
        .demo-map-grid__top-bar
          .demo-map-grid__coord
            | {{ coord.x }} | {{ coord.y }}
          .demo-map-grid__actions
            ElButton(type="primary", icon="el-icon-magic-stick", @click="onGenerate") Generate
        DemoFormInput(label="Label", v-model="label")
        .demo-map-grid__field
          DemoFormSelect(label="Umgebung", :options="getOptions('environments')", v-model="environment")
          .demo-map-grid__description(v-if="environment", style="width: 100%;")
            | {{ getOptionValue('environments', environment).value.description }}
            .demo-map-grid__info
              span Random:
              span {{ getOptionValue('environments', environment).value.random }}
        .demo-map-grid__field
          DemoFormSelect(label="Ruine", :options="getOptions('locations')", v-model="location")
          .demo-map-grid__description(v-if="location", style="width: 100%;")
            | {{ getOptionValue('locations', location).value.description }}
        .demo-map-grid__field
          DemoFormSelect(label="Fäulnis", :options="getOptions('rots')", v-model="rot")
          .demo-map-grid__description(v-if="rot", style="width: 100%;")
            | {{ getOptionValue('rots', rot).value.description }}
        DemoFormText(label="Beschreibung", :rows="10", v-model="description")
        ElButton(type="primary", @click="onSave") Save
        ElButton(v-if="id", type="danger", @click="onDelete") Delete
</template>

<script>
import Request from '~/custom/frontend/Request';
import RandomUtil from '~/custom/frontend/RandomUtil';
import Util from '~/custom/system/modules/utils/Util';

export default {
  props: ['image', 'width', 'height', 'top', 'left', 'right', 'bottom'],
  async fetch() {
    await this.loadOptions();
    await this.updateItems();
  },
  data() {
    return {
      dragging: false,
      position: { x: 50, y: 50 },
      startPosition: { x: 0, y: 0 },
      mouseStart: { x: 0, y: 0 },
      zoom: 1,

      focusing: false,
      open: false,
      id: undefined,
      current: null,
      label: '',
      description: '',
      location: '',
      environment: '',
      rot: '',
      threat1: '',
      threat2: '',
      threat3: '',
      mood: '',
      options: {},

      items: [],
    };
  },
  computed: {

    classes() {
      const classes = [];

      if (this.dragging) classes.push('dragging');
      if (this.open) classes.push('open');
      if (this.focusing) classes.push('focus');
      return classes.map(v => 'demo-map-grid--' + v);
    },

    styles() {
      const styles = {};

      styles.transform = `translate(${this.position.x}px, ${this.position.y}px) scale(${this.zoom})`;
      return styles;
    },

    gridStyles() {
      const styles = {};

      if (this.top) styles.top = this.top;
      if (this.left) styles.left = this.left;
      if (this.right) styles.right = this.right;
      if (this.bottom) styles.bottom = this.bottom;
      styles['grid-template-columns'] = `repeat(${this.width}, 1fr)`; 
      styles['grid-template-rows'] = `repeat(${this.height}, 1fr)`; 
      return styles;
    },

    root() {
      return this.$refs.root;
    },

    grid() {
      return this.$refs.grid;
    },

    itemWidth() {
      return this.grid.clientWidth / this.width;
    },

    itemHeight() {
      return this.grid.clientHeight / this.height;
    },

    coord() {
      return this.getCoord(this.current);
    },

  },
  methods: {

    async loadOptions() {
      this.options.locations = await Request.create('demo/myz/load-options').deep('options').POST({
        type: 'map_option_location',
      });
      this.options.environments = await Request.create('demo/myz/load-options').deep('options').POST({
        type: 'map_option_environment',
      });
      this.options.rots = await Request.create('demo/myz/load-options').deep('options').POST({
        type: 'map_option_rot',
      });
      console.log(this.options);
    },

    async updateItems() {
      this.items = await Request.create('demo/load-props').deep('items').POST({
        where: {
          game: 'myz',
          type: 'map_item',
        },
      });
    },

    getOptions(key) {
      return Util.omap(this.options[key], (v) => {
        return [v.group, v.label];
      });
    },

    getOptionValue(key, value) {
      return this.options[key].find(v => v.group === value);
    },

    sectorClasses(index) {
      const classes = [];

      if (this.current === index) classes.push('current');
      if (this.items.find(v => v.group === 'map-' + index)) classes.push('has-item');
      return classes.map(v => 'demo-map-grid__sector--' + v);
    },

    onMouseDown(event) {
      this.dragging = true;
      this.mouseStart = { x: event.clientX, y: event.clientY };
      this.startPosition = { ...this.position };
    },

    onDrag(event) {
      if (this.dragging) {
        const dx = event.clientX - this.mouseStart.x;
        const dy = event.clientY - this.mouseStart.y;
        this.position = {
          x: this.startPosition.x + dx,
          y: this.startPosition.y + dy,
        };
      }
    },

    onMouseUp(event) {
      this.dragging = false;
      this.onDrag(event);
    },

    onDragOver(event) {
      event.dataTransfer.dropEffect = 'move';
      event.preventDefault();
    },

    onReset() {
      this.position = { x: 50, y: 50 };
      this.zoom = 1;
    },

    onZoomIn() {
      this.zoom += .1;
    },

    onZoomOut() {
      this.zoom -= .1;
      if (this.zoom < .8) this.zoom = .8;
    },

    async onGrid(index) {
      this.current = index;
      const response = await Request.create('demo/load-props').deep('items').POST({
        where: {
          game: 'myz',
          type: 'map_item',
          group: 'map-' + index,
        },
      });
      if (response && response.length) {
        const item = response.shift();
        this.id = item.id;
        this.label = item.label;
        this.description = item.value.description;
        this.environment = item.value.environment;
        this.location = item.value.location;
        this.rot = item.value.rot;
      } else {
        this.id = undefined;
        this.label = '';
        this.description = '';
        this.environment = '';
        this.location = '';
        this.rot = '';
      }
      this.open = true;
      this.focus(index);
    },

    onClose() {
      this.open = false;
      this.focus(this.current);
      this.current = null;
    },

    getIndex(x, y) {
      return y * this.width + x;
    },

    getCoord(index) {
      return {
        x: index % this.width + 1,
        y: Math.floor(index / this.width) + 1,
      };
    },

    focus(index) {
      this.focusing = true;
      const width = this.$refs.root.clientWidth * (this.open ? .25 : 1);
      const height = this.$refs.root.clientHeight;
      const coord = this.getCoord(index);

      this.position = {
        x: (coord.x * this.itemWidth - (width + this.itemWidth) / 2) * -1,
        y: (coord.y * this.itemHeight - (height - this.itemHeight * 4) / 2) * -1,
      };
    },

    async onDelete() {
      const response = await Request.create('demo/delete').POST({
        id: this.id,
      });
      await this.updateItems();
      this.onClose();
    },

    async onSave() {
      const response = await Request.create('demo/save').POST({
        entity: {
          id: this.id,
          game: 'myz',
          type: 'map_item',
          label: this.label,
          group: 'map-' + this.current,
          value: {
            description: this.description,
            environment: this.environment,
            location: this.location,
            rot: this.rot,
          },
        },
      });
      await this.updateItems();
      this.onClose();
    },

    onGenerate() {
      if (!this.environment) {
        const index = RandomUtil.getRandomOptionIndex(this.options.environments, v => v.value.random);
        this.environment = this.options.environments[index].group;
      }
    },

  },
};
</script>

<style lang="sass" scoped>
.demo-map-grid
  overflow: hidden
  position: relative

  &__item
    position: relative
    display: inline-block

  &--focus &__item
    transition: transform .4s ease-in-out

  &__grid
    position: absolute
    display: grid

  &__latch
    position: absolute
    padding: 0 .3em
    background: #353535
    left: 50%
    top: 0
    transform: translateX(-50%)
    font-size: 2em
    border-bottom-left-radius: 16px
    border-bottom-right-radius: 16px
    border: 1px solid black
    border-top: 0
    z-index: 1000

  &__button
    padding: .2em
    cursor: pointer

  &__button:hover
    background: #555

  &__sidebar
    position: absolute
    width: 0
    right: 0
    top: 0
    bottom: 0
    z-index: 1000
    transition: width .4s ease-in-out
    display: grid
    grid-template-columns: 25% 75% 

  &--open &__sidebar
    width: 100%

  &__content
    background: #353535

  &__controls
    padding: 1em 1em 0

  &__form
    display: flex
    flex-wrap: wrap
    gap: 1em
    padding: 1em

  &__sector
    box-sizing: border-box

  &__sector--current
    border: 2px solid red

  &__sector--has-item
    position: relative

  &__sector--has-item:after
    content: ''
    position: absolute
    top: 0
    right: 0
    width: 0px
    height: 0px
    border-style: solid
    border-width: 0 1em 1em 0
    border-color: transparent red transparent transparent
    transform: rotate(0deg)

  &__coord
    padding: 1em
    background: #555

  &__description
    background: #222
    border-radius: 5px
    border-top-left-radius: 0
    border-top-right-radius: 0
    padding: 1em 1em .5em
    box-sizing: border-box

  &__field
    width: 100%

  &__top-bar
    display: flex
    justify-items: center
    align-items: center
    gap: 1em

  &__infos
    display: flex
    gap: 1em

  &__info
    border: 2px 4px
    border-radius: 3px

</style>