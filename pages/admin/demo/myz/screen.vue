<template lang="pug">
.demo-myz-screen(:class="classes", @click="onClick")
  .demo-myz-screen__background(:style="backgroundStyles")
  .demo-myz-screen__battle
    .demo-myz-screen__sidebar(@click.stop="onSidebar")
    DemoLayoutRowBounce.demo-myz-screen__row(ref="row", :items="items", :max="11")
      template(#default="props")
        .demo-myz-screen__row-item(:style="rowItemStyle(props)")
          | {{ props.item }}
</template>

<script>
import Request from '~/custom/frontend/Request';
import Socket from '~/custom/system/Socket';
import ActiveEntity from '~/custom/system/modules/controller/ActiveEntity';

export default {

  mounted() {
    Socket.get((socket) => {
      socket.subscribe(this, 'myz:screen', (event) => {
        console.log('socket', event);
      }); 
    });
  },

  beforeDestroy() {
    Socket.get().unsubscribe(this);
  },

  async fetch() {
    this.load();
  },

  data() {
    return {
      battleItems: null,
      background: 'https://c.wallhere.com/photos/1d/28/Auroa_ruins_drone_antenna_forest_mountains_concept_art_Tom_Clancy\'s_Ghost_Recon_Breakpoint-1663849.jpg!d',
      battle: false,
      items: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14],
    };
  },

  computed: {

    classes() {
      const classes = [];

      if (this.battle) classes.push('battle');
      return classes.map(v => 'demo-myz-screen--' + v);
    },

    backgroundStyles() {
      return {
        'background-image': 'url("' + this.background + '")',
      };
    },

  },

  methods: {

    async load() {
      const battleRows = await ActiveEntity.multi('Demo', {
        game: 'myz',
        type: 'battle.row',
      });
      if (battleRows.length) {
        this.battleItems = battleRows.shift();
      } else {
        this.battleItems = new ActiveEntity('Demo', {
          game: 'myz',
          type: 'battle.row',
          label: 'Battle Row',
          group: 'temp',
          value: {
            items: [],
          },
        });
        this.battleItems.save();
      }
    },

    rowItemStyle({ index }) {
      const styles = {};
      if (index > 7) {
        styles['--demo-myz-screen--row-item-index'] = index + 'vw';
      }
      return styles;
    },

    onClick() {
      if (this.battle) {
        const next = this.$refs.row.next();
        console.log(next);
        if (next === null) {
          this.$refs.row.intro();
        }
      } else {
        this.battle = true;
        this.$refs.row.intro();
      }
    },

    onSidebar() {
      this.battle = false;
    },

  },
}
</script>
  
<style lang="sass">
.demo-myz-screen
  --demo-myz-screen--row-item-size: 7vw
  width: 100vw
  height: 100vh
  overflow: hidden
  position: relative

  &__background
    position: absolute
    top: 0
    left: 0
    width: 100%
    height: 100%
    background-repeat: no-repeat
    background-size: cover
    background-position: center center
    transform: perspective(1000px) rotateX(0)
    transform-origin: bottom
    transition: all 1s ease-in-out

  &--battle &__background
    transform: perspective(1000px) rotateX(10deg) 
    left: 15vw
    width: calc(100% - 15vw)

  &__sidebar
    position: absolute
    top: 0
    left: -15vw
    width: 15vw
    height: 100%
    border-right: 2px solid white
    background: #222
    box-sizing: border-box
    transition: left 1s ease-in-out

  &--battle &__sidebar
    left: 0

  &__row
    position: relative
    left: calc(15vw + 2px)
    top: calc((var(--demo-myz-screen--row-item-size) - (var(--demo-myz-screen--row-item-index, 7vw) - 7vw)) * 4 / 3 * -1.1)
    transition: top 1s ease-in-out

  &--battle &__row
    top: 0

  &__row-item
    width: calc(var(--demo-myz-screen--row-item-size) - (var(--demo-myz-screen--row-item-index, 7vw) - 7vw))
    transition: width .2s ease-in-out
    aspect-ratio: 3/4
    background: #444
    border: 2px solid black

</style>