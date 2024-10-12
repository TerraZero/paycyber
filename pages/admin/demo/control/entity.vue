<template lang="pug">
.demo-control-entity(@class="classes")
  .demo-control-entity__controls
    ElButtonGroup
      ElButton(type="primary", icon="el-icon-plus", @click="open('battle.player')") Add Player
      ElButton(type="primary", icon="el-icon-plus", @click="open('battle.enemy.type')") Add Enemy Type
      ElButton(type="primary", icon="el-icon-plus", @click="open('battle.enemy')") Add Enemy
  .demo-control-entity__filter
    DemoFormInput(v-model="filter", label="Filter")
    DemoFormSelect(v-model="type", :options="types", label="Type")
  .demo-control-entity__list(v-if="items")
    .demo-control-entity__item(v-for="item in list")
      DemoViewEntity(:entity="item")
      ElButton.demo-control-entity__edit(type="primary", icon="el-icon-edit", @click="open(item)")
  DemoEntityEnemyTypeForm(ref="enemyTypeForm", @finish="update")
  DemoEntityEnemyForm(ref="enemyForm", @finish="update")
  DemoEntityPlayerForm(ref="playerForm", @finish="update")
</template>

<script>
import ActiveEntity from '~/custom/system/modules/controller/ActiveEntity';

export default {

  async fetch() {
    this.update();
  },

  data() {
    return {
      items: null,
      filter: '',
      type: '',
      types: {
        '': 'All',
        'battle.enemy.type': 'Enemy Type',
        'battle.enemy': 'Enemy',
        'battle.player': 'Player',
      },
    };
  },
  computed: {

    classes() {
      const classes = [];

      return classes.map(v => 'demo-control-entity--' + v);
    },
    
    list() {
      const items = this.items ?? [];

      return items.filter(v => {
        if (this.type || this.filter) {
          if (this.type && v.values.type !== this.type) return false;
          if (this.filter && !(v.values.label.includes(this.filter) || v.values.group.includes(this.filter))) return false;
        } 
        return true;
      }).sort((a, b) => {
        return b.values.type.localeCompare(a.values.type);
      });
    },

  },
  methods: {

    open(entity) {
      let type = null;
      if (typeof entity === 'string') {
        type = entity;
        entity = null;
      } else {
        type = entity.values.type;
      }

      switch (type) {
        case 'battle.enemy.type':
          this.$refs.enemyTypeForm.open(entity);
          break;
        case 'battle.enemy':
          this.$refs.enemyForm.open(entity);
          break;
        case 'battle.player':
          this.$refs.playerForm.open(entity);
          break;
      }
    },

    close() {
      if (this.$refs.enemyTypeForm) {
        this.$refs.enemyTypeForm.close();
        this.$refs.playerForm.close();
        this.$refs.enemyForm.close();
      }
    },

    async update() {
      this.close();
      this.items = await ActiveEntity.multi('Demo', {
        game: 'myz',
        type: { in: ['battle.player', 'battle.enemy.type', 'battle.enemy'] },
      });
    },

  },
}
</script>
  
<style lang="sass">
.demo-control-entity
  width: 100vw
  height: 100vh
  overflow: hidden
  padding: 1em
  box-sizing: border-box

  &__controls
    padding-bottom: 1em

  &__list
    display: grid
    grid-template-columns: repeat(auto-fit, minmax(200px, 300px))
    gap: 1em
    padding-bottom: 1em

  &__item
    background: #333
    padding: 1em
    display: flex
    flex-direction: column
    justify-content: space-between

  &__edit
    width: 100%

  &__filter
    display: flex
    gap: 1em
    padding-bottom: 1em

</style>