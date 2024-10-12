<template lang="pug">
.demo-view-compose-random-sectors
  .demo-view-compose-random-sectors__item
    .demo-view-compose-random-sectors__sector Items
    .demo-view-compose-random-sectors__value Wahrscheinlichkeit
  .demo-view-compose-random-sectors__item(v-for="sector, index in itemSectors", :key="index") 
    .demo-view-compose-random-sectors__sector {{ sector.count }}
    .demo-view-compose-random-sectors__value {{ sector.percentage }}
</template>

<script>
import RandomUtil from '~/custom/frontend/RandomUtil';

export default {
  props: ['count', 'threshold'],

  computed: {

    itemSectors() {
      const split = this.count.split('-');
      if (split.length === 1) split.push(split[0]);
      let sectors = RandomUtil.generateSectorsInt(split[1] - split[0] + 1, 100 - this.threshold, 1);
      if (sectors.length === 0) sectors.push(100 - this.threshold);
      sectors.push(this.threshold);
      sectors = sectors.reverse().map((v, i) => {
        return {
          count: i === 0 ? 0 : i + parseInt(split[0]) - 1,
          percentage: v,
        };
      });
      sectors.push({
        count: '#',
        percentage: sectors.reduce((v, c) => v + parseInt(c.percentage), 0),
      });
      return sectors;
    },

  },

}
</script>
  
<style lang="sass">
.demo-view-compose-random-sectors
  display: flex

  &__item
    border: 2px solid white
    color: white
    text-align: right

    & + &
      border-left-width: 0

  &__sector
    padding: 1em 2em
    border-bottom: 2px solid white

  &__value
    padding: 1em 2em

</style>