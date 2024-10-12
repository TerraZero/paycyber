<template lang="pug">
DemoEntityFormBase.demo-entity-enemy-form(ref="base", title="Enemy", type="battle.enemy", @load="onLoad", @save="onSave", @close="onClose", @finish="onFinish")
  DemoFormInput(label="Label", v-model="label")
  DemoFormInput(label="ID", v-model="group", :disabled="entity && !entity.isNew")
  .demo-entity-enemy-form__flex
    DemoFormSelect(label="Type", :options="typeOptions", v-model="type")
    ElButton(type="primary", icon="el-icon-refresh", :disabled="!type", @click="onGenerate")
  DemoFormInput(label="ID", v-model="group", :disabled="entity && !entity.isNew")
  .demo-entity-player-form__attrs
    DemoFormInput(label="Stärke", v-model="str")
    DemoFormInput(label="T. Stärke", v-model="t_str")
    DemoFormInput(label="Geschicklichkeit", v-model="dex")
    DemoFormInput(label="T. Geschicklichkeit", v-model="t_dex")
    DemoFormInput(label="Verstand", v-model="wit")
    DemoFormInput(label="T. Verstand", v-model="t_wit")
    DemoFormInput(label="Empathie", v-model="emp")
    DemoFormInput(label="T. Empathie", v-model="t_emp")
</template>

<script>
import FormBase from './FormBase.mixin';
import ActiveEntity from '~/custom/system/modules/controller/ActiveEntity';
import Util from '~/custom/system/modules/utils/Util';
import RandomUtil from '~/custom/frontend/RandomUtil';

export default {
  mixins: [FormBase],

  async fetch() {
    this.types = (await ActiveEntity.multi('Demo', {
      game: 'myz',
      type: 'battle.enemy.type',
    })).map(v => v.values);
  },

  data() {
    return {
      entity: null,
      label: '',
      group: '',
      str: 0,
      t_str: 0,
      dex: 0,
      t_dex: 0,
      wit: 0,
      t_wit: 0,
      emp: 0,
      t_emp: 0,
      type: '',
      types: [],
    };
  },

  computed: {

    typeOptions() {
      return Util.omap(this.types, (v) => {
        return [v.group, v.label];
      });
    },

  },

  methods: {

    pack(entity) {
      entity.values.label = this.label;
      entity.values.group = this.group;
      entity.values.value.str = this.str;
      entity.values.value.t_str = this.t_str;
      entity.values.value.dex = this.dex;
      entity.values.value.t_dex = this.t_dex;
      entity.values.value.wit = this.wit;
      entity.values.value.t_wit = this.t_wit;
      entity.values.value.emp = this.emp;
      entity.values.value.t_emp = this.t_emp;
      entity.values.value.type = this.type;
    },

    unpack(entity) {
      this.label = entity.values.label ?? '';
      this.group = entity.values.group ?? '';
      this.str = entity.values.value.str ?? 0;
      this.t_str = entity.values.value.t_str ?? 0;
      this.dex = entity.values.value.dex ?? 0;
      this.t_dex = entity.values.value.t_dex ?? 0;
      this.wit = entity.values.value.wit ?? 0;
      this.t_wit = entity.values.value.t_wit ?? 0;
      this.emp = entity.values.value.emp ?? 0;
      this.t_emp = entity.values.value.t_emp ?? 0;
      this.type = entity.values.value.type ?? '';
    },

    onGenerate() {
      const attrs = ['str', 'dex', 'wit', 'emp'];
      const type = this.types.find(v => v.group === this.type);
      for (const attr of attrs) {
        const split = type.value[attr].split('-');
        if (split.length === 1) {
          split.push(split[0]);
        }
        this[attr] = RandomUtil.getRandomInt(split[0], split[1]);
        this['t_' + attr] = this[attr];
      }
    },

  },
}
</script>
  
<style lang="sass">
.demo-entity-enemy-form
  --demo-form--label-min-width: 150px

  &__attrs
    display: grid
    grid-template-columns: 1fr 1fr
    gap: 1em

  &__flex
    display: grid
    grid-template-columns: 1fr min-content
    gap: 1em
</style>