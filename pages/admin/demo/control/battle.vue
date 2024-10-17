<template lang="pug">
.demo-control-battle
  .demo-control-battle__sound
  .demo-control-battle__middle
    .demo-control-battle__battle(v-if="battleItems && row.length")
      .demo-control-battle__battle-row
        .demo-control-battle__row(v-if="row")
          .demo-control-battle__row-item(v-for="item, key in row", :class="modi('row-item', { break: item.type === 'break', selected: item === selectedItem })", @click="onSelectItem(item)")
            .demo-control-battle__title
              .demo-control-battle__label(v-if="item.type !== 'break'") {{ getTarget(item).values.label }}
              strong.demo-control-battle__label(v-if="item.type === 'break'") Round: {{ item.round }}
              .demo-control-battle__init(v-if="item.type !== 'break'") {{ item.order }} [{{ item.orderChange }}]
            .demo-control-battle__break-image(v-if="item.type === 'break'")
            ElImage.demo-control-battle__mini-image(v-if="item.type !== 'break'", :src="getImage(item)", fit="contain")
        ElButton.demo-control-battle__next(type="primary", size="mini", icon="el-icon-d-arrow-right", @click="onNext")
      .demo-control-battle__battle-control
        ElButton(@click="onOrderChange(-2)") -2
        ElButton(@click="onOrderChange(-1)") -1
        ElButton(@click="onOrderChange(0)") 0
        ElButton(@click="onOrderChange(+1)") +1
        ElButton(@click="onOrderChange(+2)") +2
        ElButton(type="danger") Beenden
    .demo-control-battle__list
      .demo-control-battle__enemy(v-if="units", v-for="unit, index in units", :key="index", :class="modi('enemy', { selected: false })")
        DemoViewEntity(:entity="unit", :options="{ controls: { attr: true, item: true } }")
          template(#controls)
            ElButtonGroup
              ElButton(type="danger", size="mini", icon="el-icon-close", @click="onDeleteUnit(unit)")
              ElButton(size="mini", :icon="unit.enable ? 'el-icon-view' : 'el-icon-loading'", @click="onViewUnit(unit)")
              ElButton(type="primary", size="mini", icon="el-icon-d-arrow-right")
  .demo-control-battle__sidebar
    .demo-control-battle__actions
      ElButton(type="primary", size="mini") Add
      ElButton(type="danger", size="mini", @click="onClear") Clear
      ElButton(size="mini", @click="openStartBattleDialog") Start
    .demo-control-battle__units
      .demo-control-battle__enemy(v-if="enemyTypes", v-for="type, index in enemyTypes", :key="index", @click="addUnit(type)")
        .demo-control-battle__item-left
          .demo-control-battle__name {{ type.values.label }}
        .demo-control-battle__item-right
          ElImage.demo-control-battle__image(:src="type.values.value.images[0].src", fit="contain")
  ElDialog(title="Kampf Start", :visible.sync="startDialog", width="90%", :close-on-click-modal="false")
    .demo-control-battle__dialog-content
      .demo-control-battle__players
        .demo-control-battle__player(v-if="players", v-for="player, key in players", :key="key")
          DemoViewEntity(:entity="player", :options="{ controls: { attr: true, init: true } }")
    template(#footer)
      ElButton(type="primary", @click="onBattleStart") Start

</template>

<script>
import RandomUtil from '~/custom/frontend/RandomUtil';
import ActiveEntity from '~/custom/system/modules/controller/ActiveEntity';
import StateEntity from '~/custom/system/modules/controller/StateEntity';

export default {
  async fetch() {
    this.update();
  },
  data() {
    return {
      state: null,
      enemyTypes: null,
      players: null,
      units: null,
      label: '',
      group: '',
      health: '',
      startDialog: false,
      battleItems: null,
      battleRow: null,
      selectedItem: null,
    };
  },
  computed: {

    classes() {
      const classes = [];

      return classes.map(v => 'demo-control-battle--' + v);
    },

    row() {
      return false;
    },  

  },
  methods: {

    modi(element, modis) {
      const classes = [];

      for (const key in modis) if (modis[key]) classes.push(key);
      return classes.map(v => 'demo-control-battle__' + element + '--' + v);
    },

    async update() {
      this.enemyTypes = await ActiveEntity.multi('Demo', {
        game: 'myz',
        type: 'battle.enemy.type',
      });
      this.players = await ActiveEntity.multi('Demo', {
        game: 'myz',
        type: 'battle.player',
      });

      this.state = await StateEntity.load('myz', 'battle.config', 'Battle Config', {
        battleItems: [],
        units: [],
      }, this);
    },

    onSelectItem(item) {
      this.selectedItem = item;
    },

    /**
     * @param {(import('~/custom/types/DemoTypes').T_UnitType)} type 
     */
    async addUnit(type) {
      const split = type.values.value.items_count.split('-');
      if (split.length === 1) split.push(split[0]);
      let sectors = RandomUtil.generateSectorsInt(split[1] - split[0] + 1, 100 - type.values.value.items_threshold, 1);
      sectors.push(parseInt(type.values.value.items_threshold));
      sectors = sectors.reverse();

      const count = RandomUtil.getRandomOptionIndex(sectors, v => v);
      let items = [];
      let times = 0;
      while (items.length < count) {
        let iindex = RandomUtil.getRandomOptionIndex(type.values.value.items, v => v.weight);
        for (let i = 0; i < 3; i++) {
          if (!items.includes(iindex)) break;
          iindex = ++iindex % type.values.value.items.length;
        }
        if (!items.includes(iindex)) {
          items.push(iindex);
        }
        if (times++ > 10) break;
      }

      items = items.map(v => {
        const item = type.values.value.items[v];
        const minmax = item.tough.split('-');
        if (minmax.length === 1) minmax.push(minmax[0]);

        return {
          id: item.id,
          label: item.label,
          tough: RandomUtil.getRandomInt(minmax[0], minmax[1]),
        };
      });

      this.units.push({
        type: 'battle.unit',
        target_game: type.values.game,
        target_type: type.values.type,
        target_id: type.values.group,
        t_str: this.getRandomAttr(type.values.value.str),
        t_dex: this.getRandomAttr(type.values.value.dex),
        t_wit: this.getRandomAttr(type.values.value.wit),
        t_emp: this.getRandomAttr(type.values.value.emp),
        items: items,
        enable: false,
        init: 0,
      });

      await this.state.up('units');

      // this.update();
    },

    getRandomAttr(attr) {
      const split = (attr + '').split('-');
      if (split.length === 1) return parseInt(attr);
      return RandomUtil.getRandomInt(split[0], split[1]);
    },

    async onDeleteUnit(unit) {
      await unit.delete();
      this.update();
    },

    onViewUnit(unit) {
      unit.values.value.enable = !unit.values.value.enable;
      unit.save();
    },

    onClear() {
      console.log('todo');
    },

    openStartBattleDialog() {
      this.startDialog = true;
    },

    onBattleStart() {
      this.startDialog = false;
      const items = [];
      for (const unit of this.units) {
        unit.values.value.init = RandomUtil.getRandomInt(1, 20) + parseInt(unit.values.value.t_dex);
        items.push({
          target_id: unit.values.id,
          type: 'unit',
          order: 0,
          type_id: unit.values.value.target_id,
          init: unit.values.value.init,
        });
      }
      for (const player of this.players) {
        items.push({
          target_id: player.values.id,
          type: 'player',
          order: 0,
          init: player.values.value.init + parseInt(player.values.value.t_dex),
        });
      }
      items.sort((a, b) => b.init - a.init);

      items.push({
        type: 'break',
        order: 0,
        round: 1,
      });
      for (const order in items) {
        items[order].order = parseInt(order) + 1;
        items[order].orderChange = 0;
      }
      this.battleItems.values.value.items = items;
      this.battleItems.save();
    },

    getTarget(item) {
      switch (item.type) {
        case 'player':
          return this.players.find(v => v.values.id === item.target_id);
        case 'unit':
          return this.units.find(v => v.values.id === item.target_id);
      }
      return null;
    },

    getType(item) {
      return this.enemyTypes.find(v => v.values.group === item.type_id);
    },

    getImage(item) {
      if (item.type === 'unit') {
        if (!this.getType(item) || !this.getType(item).values || !this.getType(item).values.value.images) return null;
        return this.getType(item).values.value.images[0].src;
      } else {
        if (!this.getTarget(item) || !this.getTarget(item).values || !this.getTarget(item).values.value.images) return null;
        return this.getTarget(item).values.value.images[0].src;
      }
    },

    onNext() {
      const item = this.battleItems.values.value.items.shift();
      this.battleItems.values.value.items.push(item);
      if (item.type === 'break') {
        item.round++;
        this.onNextRound();
      }
      this.battleItems.save();
    },

    onNextRound() {
      const items = this.battleItems.values.value.items;
      for (const index in items) {
        if (items[index].orderChange !== 0) {
          let to = parseInt(index) + parseInt(items[index].orderChange);
          if (to < 0) to = 0;
          if (to >= items.length - 1) to = items.length - 2;
          items[index].orderChange = 0;
          this.arrayMove(items, index, to);
        }
      }
      for (const order in items) {
        items[order].order = parseInt(order) + 1;
      }
      this.battleItems.save();
    },

    getBattleItem(item) {
      return this.battleItems.values.value.items.find(v => v.target_id === item.values.id);
    },

    onOrderChange(change) {
      if (this.selectedItem === null) {
        this.$message.warning('Please select an item.');
      } else {
        this.selectedItem.orderChange = change;
        this.battleItems.save();
      }
    },

    arrayMove(array, from, to) {
      const element = array[from];
      array.splice(from, 1);
      array.splice(to, 0, element);
    },

  },
}
</script>
  
<style lang="sass">
.demo-control-battle
  display: grid
  grid-template-columns: 1fr 4fr 1.5fr
  width: 100vw
  height: 100vh
  overflow: hidden

  &__sidebar
    border-left: 2px solid white
    background: #333

  &__actions
    text-align: right

  &__middle
    background: #444
    min-height: 0

  &__form
    display: flex
    flex-wrap: wrap
    gap: 1em
    padding: 1em

  &__units
    display: grid
    grid-template-columns: 1fr
    gap: .5em
    border-top: 1px solid white
    padding: .5em

  &__list
    display: grid
    grid-template-columns: 1fr 1fr
    gap: 1em
    padding: 1em
    overflow: auto
    box-sizing: border-box
    max-height: 100%

  &__enemy
    display: grid
    grid-template-columns: 1fr min-content
    padding: 1em
    background: #555
    cursor: pointer
    transition: background .2s ease-in-out
    border: 1px solid transparent

    &:hover
      background: #777

  &__enemy--selected
    border: 1px solid red

  &__image
    width: 100px
    height: 100px

  &__players
    display: grid
    grid-template-columns: repeat(auto-fit, minmax(300px, 400px))
    justify-content: space-between
    gap: 1em

  &__player
    border: 1px solid black
    padding: .5em

  &__battle
    background: #333

  &__row
    display: grid
    grid-template-columns: repeat(auto-fit, 100px)
    gap: .5em

  &__title
    display: flex
    justify-content: space-between
    overflow-wrap: anywhere

  &__row-item
    padding: .5em
    border: 1px solid white
    cursor: pointer

  &__row-item:hover
    background: #555

  &__row-item--break
    height: 100%
    box-sizing: border-box

  &__row-item--selected
    border: 1px solid red

  &__break-image
    background-image: url('/media/demo/myz/system/environment.png')
    background-position: center center
    background-size: contain
    background-repeat: no-repeat
    width: 100%
    aspect-ratio: 1/1

  &__row-item--break &__title
    justify-content: center
    padding-bottom: 1em

  &__battle-row
    display: grid
    grid-template-columns: 1fr min-content

  &__battle-control
    border-top: 2px solid white

</style>