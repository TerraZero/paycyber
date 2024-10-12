<template lang="pug">
.demo-view-entity
  component(v-if="comp", :is="comp", :entity="entity", :values="entity.values", :type="type", :options="options", v-on="$listeners")
    template(v-for="(_, slotName) in $scopedSlots", v-slot:[slotName]="props")
      slot(:name="slotName", v-bind="props")
  .demo-view-entity__notice(v-else) Unknown Type: {{ entity.values.type }}
</template>

<script>
export default {
  props: ['entity', 'options'],

  computed: {

    comp() {
      switch (this.entity.values.type) {
        case 'battle.enemy.type':
          return 'DemoViewEnemyType';
        case 'battle.enemy':
          return 'DemoViewEnemy';
        case 'battle.player':
          return 'DemoViewPlayer';
        case 'battle.unit':
          return 'DemoViewUnit';
      }
      return false;
    },

    type() {
      switch (this.entity.values.type) {
        case 'battle.enemy.type':
          return 'Enemy Type';
        case 'battle.enemy':
          return 'Enemy';
        case 'battle.player':
          return 'Player';
        case 'battle.unit':
          return 'Unit';
      }
      return '<UNKNOWN-' + this.entity.values.type + '>';
    },

  },

}
</script>
  
<style lang="sass">
.demo-view-entity

  &__notice
    padding-bottom: 1em
    
</style>