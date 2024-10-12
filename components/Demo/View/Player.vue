<template lang="pug">
.demo-view-player(:class="classes")
  .demo-view-player__label {{ values.label }} ({{ type }}: {{ values.group }})
  .demo-view-player__attrs
    .demo-view-player__attr Stärke 
    .demo-view-player__value {{ values.value.t_str }} / {{ values.value.str }}
    .demo-view-player__input(v-if="hasAttrControls")
      slot(name="strInput")
        ElButtonGroup
          ElButton(size="mini", @click="onChange('str', 1)") +
          ElButton(size="mini", @click="onChange('str', -1)") -
    .demo-view-player__attr Geschicklichkeit 
    .demo-view-player__value {{ values.value.t_dex }} / {{ values.value.dex }}
    .demo-view-player__input(v-if="hasAttrControls") 
      slot(name="dexInput")
        ElButtonGroup
          ElButton(size="mini", @click="onChange('dex', 1)") +
          ElButton(size="mini", @click="onChange('dex', -1)") -
    .demo-view-player__attr Verstand 
    .demo-view-player__value {{ values.value.t_wit }} / {{ values.value.wit }}
    .demo-view-player__input(v-if="hasAttrControls") 
      slot(name="witInput")
        ElButtonGroup
          ElButton(size="mini", @click="onChange('wit', 1)") +
          ElButton(size="mini", @click="onChange('wit', -1)") -
    .demo-view-player__attr Empathy
    .demo-view-player__value {{ values.value.t_emp }} / {{ values.value.emp }}
    .demo-view-player__input(v-if="hasAttrControls") 
      slot(name="empInput")
        ElButtonGroup
          ElButton(size="mini", @click="onChange('emp', 1)") +
          ElButton(size="mini", @click="onChange('emp', -1)") -
  .demo-view-player__attrs-extra
    .demo-view-player__attr Images
    .demo-view-player__value {{ imagesVal }}
  .demo-view-player__image-wrapper(v-if="image")
    ElImage.demo-view-player__image(:src="image", fit="contain")
  .demo-view-player__init(v-if="hasInitControls")
    .demo-view-player__init-item(v-for="i in 25", :key="i", :class="{'demo-view-player__init-item--active': i === values.value.init}", @click="onInitChange(i)") {{ i }}
</template>

<script>
export default {
  props: ['entity', 'values', 'type', 'options'],

  computed: {

    classes() {
      const classes = [];

      if (this.hasAttrControls) classes.push('attr');
      return classes.map(v => 'demo-view-player--' + v);
    },

    hasAttrControls() {
      return this.options && this.options.controls && this.options.controls.attr;
    },

    hasInitControls() {
      return this.options && this.options.controls && this.options.controls.init;
    },

    imagesVal() {
      if (!this.values || !this.values.value.images) return '[X]';
      if (this.values.value.images.length > 1) {
        return '[...' + this.values.value.images.length + ']';
      } else {
        return '[' + this.values.value.images[0].src + ']';
      }
    },

    image() {
      if (!this.values || !this.values.value.images) return null;
      return this.values.value.images[0].src;
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

    onInitChange(init) {
      this.entity.values.value.init = init;
      this.entity.save();
      this.$emit('init-change', {
        entity: this.entity,
        init,
      });
    },

  },

}
</script>
  
<style lang="sass">
.demo-view-player

  &__label
    font-size: 1.1em
    font-weight: bold
    padding-bottom: .5em
  
  &__attrs
    display: grid
    grid-template-columns: 1fr 1fr
    gap: .2em
    padding-bottom: .5em

  &--attr &__attrs
    grid-template-columns: 1fr 1fr max-content

  &__attrs-extra
    display: grid
    grid-template-columns: 1fr minmax(0, 1fr)
    gap: .2em
    padding-bottom: .5em

  &__value
    white-space: nowrap
    text-overflow: ellipsis
    overflow: hidden

  &__image
    width: 100%
    height: 100px

  &__init
    display: grid
    grid-template-columns: repeat(5, 1fr)
    gap: .2em
  
  &__init-item
    display: flex
    justify-content: center
    align-items: center
    background: #CCC
    padding: 1em
    cursor: pointer

    &:hover
      background: #EEE

  &__init-item--active
    background: #999

</style>