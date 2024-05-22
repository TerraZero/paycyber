<template lang="pug">
.coder-icon
  .coder-icon__name {{ card.name }}
  .coder-icon__image-wrapper
    img.coder-icon__image(v-if="card.icon", :src="image", :style="imageStyle")
  .coder-icon__field(v-if="field.length")
    .coder-icon__grid
      .coder-icon__item(v-for="item in field", :class="'coder-icon__item-' + item")
</template>
  
<script>
export default {
  props: ['card'],
  computed: {
    image() {
      return require('../../../cards/dest/img/icons/' + this.card.icon + '.png');
    },
    imageStyle() {
      const styles = {};

      if (this.card.rotate) {
        styles.transform = 'rotate(' + this.card.rotate + 'deg)';
      }
      if (this.card.padding) { 
        styles.padding = this.card.padding + 'px';
      }
      return styles;
    },
    field() {
      const fields = [];

      if (this.card.field) {
        for (const row of this.card.field) {
          for (const col of row.split('')) {
            if (col === '1') {
              fields.push('fill');
            } else {
              fields.push('empty');
            }
          }
        }
      }
      return fields;
    },
  },
}
</script>

<style lang="sass">
.coder-icon

  &__name
    text-align: center
    margin-bottom: .2em

  &__image-wrapper
    background: white

  &__image
    max-width: 100%
    box-sizing: border-box

  &__field
    width: 100%
    height: 100%
    aspect-ratio: 1/1
    border: 2px solid white
    padding: 2px
    box-sizing: border-box

  &__grid
    width: 100%
    height: 100%
    display: grid
    grid-template-columns: repeat(6, 1fr)
    grid-template-rows: repeat(6, 1fr)
    gap: 3px

  &__item
    background: white

  &__item-fill
    background: black
</style>