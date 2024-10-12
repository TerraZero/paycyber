<template lang="pug">
.demo-view-unit(:class="classes")
  .demo-view-unit__left
    .demo-view-unit__label {{ values.label }} ({{ values.value.init ?? '0' }})
    .demo-view-unit__image-wrapper(v-if="image")
      ElImage.demo-view-unit__image(:src="image", fit="contain")
    .demo-view-unit__items
      .demo-view-unit__item(v-for="item, key in items", :key="key")
        .demo-view-unit__item-label {{ item.label }}
        .demo-view-unit__item-live {{ item.tough }}
        .demo-view-unit__item-controls(v-if="hasItemControls")
          slot(name="itemControl", :item="item")
            ElButtonGroup
              ElButton.demo-view-unit__micro(size="mini", @click="onItemChange(item, 1)") +
              ElButton.demo-view-unit__micro(size="mini", @click="onItemChange(item, -1)") -
  .demo-view-unit__right
    .demo-view-unit__controls
      slot(name="controls")
    .demo-view-unit__attrs
      .demo-view-unit__attr S 
      .demo-view-unit__value {{ values.value.t_str }}
      .demo-view-unit__input(v-if="hasAttrControls") 
        slot(name="strInput")
          ElButtonGroup
            ElButton(size="mini", @click="onChange('str', 1)") +
            ElButton(size="mini", @click="onChange('str', -1)") -
      .demo-view-unit__attr G 
      .demo-view-unit__value {{ values.value.t_dex }}
      .demo-view-unit__input(v-if="hasAttrControls") 
        slot(name="dexInput")
          ElButtonGroup
            ElButton(size="mini", @click="onChange('dex', 1)") +
            ElButton(size="mini", @click="onChange('dex', -1)") -
      .demo-view-unit__attr V 
      .demo-view-unit__value {{ values.value.t_wit }}
      .demo-view-unit__input(v-if="hasAttrControls") 
        slot(name="witInput")
          ElButtonGroup
            ElButton(size="mini", @click="onChange('wit', 1)") +
            ElButton(size="mini", @click="onChange('wit', -1)") -
      .demo-view-unit__attr E
      .demo-view-unit__value {{ values.value.t_emp }}
      .demo-view-unit__input(v-if="hasAttrControls") 
        slot(name="empInput")
          ElButtonGroup
            ElButton(size="mini", @click="onChange('emp', 1)") +
            ElButton(size="mini", @click="onChange('emp', -1)") -
</template>

<script>
import ActiveEntity from '~/custom/system/modules/controller/ActiveEntity';

export default {
  props: ['entity', 'values', 'type', 'options'],

  async fetch() {
    const target = await ActiveEntity.multi('Demo', {
      game: this.values.value.target_game,
      type: this.values.value.target_type,
      group: this.values.value.target_id,
    });
    this.target = target.shift().values;
  },

  data() {
    return {
      target: null,
    };
  },

  computed: {

    classes() {
      const classes = [];

      if (this.hasAttrControls) classes.push('attr');
      return classes.map(v => 'demo-view-unit--' + v);
    },

    hasAttrControls() {
      return this.options && this.options.controls && this.options.controls.attr;
    },

    hasItemControls() {
      return this.options && this.options.controls && this.options.controls.item;
    },

    image() {
      if (!this.target || !this.target.value.images) return null;
      return this.target.value.images[0].src;
    },

    items() {
      return this.values.value.items;
    },

  },

  methods: {

    onChange(prop, value) {
      this.entity.values.value['t_' + prop] = parseInt(this.entity.values.value['t_' + prop]) + parseInt(value);
      this.entity.save();
      this.$emit('attr-change', {
        entity: this.entity,
        prop,
        value,
      });
    },

    onItemChange(item, value) {
      item.tough += value;
      this.entity.save();
      this.$emit('item-change', {
        entity: this.entity,
        item,
        value,
      });
    },

  },

}
</script>
  
<style lang="sass">
.demo-view-unit
  display: grid
  grid-template-columns: 1fr max-content

  &__controls
    text-align: right
    padding-bottom: .5em

  &__label
    font-size: 1.1em
    font-weight: bold
    padding-bottom: .5em
  
  &__attrs
    display: grid
    grid-template-columns: 1fr 1fr
    gap: .3em
    padding-bottom: .5em
    align-items: center

  &--attr &__attrs
    grid-template-columns: min-content min-content max-content

  &__value
    white-space: nowrap
    text-overflow: ellipsis
    overflow: hidden

  &__image
    width: 100px
    height: 100px
    background: #222

  &__item
    background: #222
    margin: 0 .5em .5em 0
    display: inline-block
    white-space: nowrap
    display: inline-flex
    gap: .5em
    padding: .5em
    align-items: center
    font-size: .7em

  &__micro
    padding: .5em
    line-height: .5em

</style>