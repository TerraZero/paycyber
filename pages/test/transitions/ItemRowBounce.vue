<template lang="pug">
.page.item-row-bounce
  transition-group.item-row-bounce__row(name="flip-list")
    .item-row-bounce__item(v-for="item, index in items", :key="item", :style="itemStyle(index)") {{ item }}
  .item-row-bounce__buttons
    ElButton.item-row-bounce__button(@click="shuffle") Shuffle
    ElButton.item-row-bounce__button(@click="remove") Remove
    ElButton.item-row-bounce__button(@click="removeLast") Remove Last
  
</template>

<script>
import RandomUtil from '~/custom/frontend/RandomUtil';
import Util from '~/custom/system/modules/utils/Util';

export default {
  data() {
    return {
      items: new Array(9).fill(1).map((v, i) => i + 1),
    };
  },
  methods: {

    shuffle() {
      this.items = Util.shuffle(this.items);
      this.$forceUpdate();
    },

    remove() {
      const index = RandomUtil.getRandomOptionIndex(this.items);
      this.items.splice(index, 1);
    },

    removeLast() {
      this.items.splice(0, 1);
    },

    itemStyle(index) {
      const styles = {
        '--transition-delay': ((index - 1) * .05 + 1) + 's',
      };

      if (index > 5) {
        styles.width = (10 - (index - 5)) + '%';
        styles.height = (200 - (index - 5) * 20) + 'px';
      }
      return styles;
    },

  },
}
</script>

<style lang="sass">
.page
  width: 100vw
  height: 100vh
  overflow: hidden
  box-sizing: border-box
  font-family: sans-serif

.item-row-bounce
  background: white
  position: relative

  &__row
    position: absolute
    top: 0
    left: 0
    right: 25%

  &__item
    width: 10%
    height: 200px
    border: 2px solid black
    display: inline-flex
    justify-content: center
    align-items: center
    font-size: 20px
    color: black
    box-sizing: border-box
    vertical-align: top
    transition: width 1s, height 1s

  &__buttons
    position: absolute
    top: 50%
    left: 50%

.flip-list-move
  transition: transform var(--transition-delay, 1s) cubic-bezier(.4,-0.4,.4,.8), width 1s, height 1s

.flip-list-leave-active
  transition: all 1s .2s
  position: absolute

.flip-list-leave-to
  opacity: 0
  transform: translateY(50%)

</style>