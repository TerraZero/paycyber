<template lang="pug">
.demo-control-simple
  .demo-control-simple__content
    .demo-control-simple__top
    .demo-control-simple__bottom
      .demo-control-simple__left
        .demo-control-simple__image(v-for="image in sliders", :key="image.values.group")
          ElImage.demo-control-simple__preview(v-if="image.states.teaser", :src="image.states.teaser.values.value.src", fit="cover")
          .demo-control-simple__text
            | {{ image.values.label }}
            .demo-control-simple__music(v-if="image.states.automusic")
              | Autostart: {{ image.states.automusic.values.label }}
            ElButtonGroup.demo-control-simple__controls
              ElButton.demo-control-simple__icon(icon="el-icon-video-play", size="mini", type="primary", @click="onPlayImage(image)")
              ElButton.demo-control-simple__icon(icon="el-icon-lock", size="mini", @click="onPlayImage(image, true)")
      .demo-control-simple__right
        .demo-control-simple__music(v-for="music in playlists", :key="music.values.group")
          ElImage.demo-control-simple__preview(v-if="music.states.teaser", :src="music.states.teaser.values.value.src", fit="cover")
          .demo-control-simple__text
            | {{ music.values.label }}
            ElButtonGroup.demo-control-simple__controls
              ElButton.demo-control-simple__icon(icon="el-icon-video-play", size="mini", type="primary", @click="onPlayPlaylist(music)")
    .demo-control-simple__sounds
      .demo-control-simple__sound
        .demo-control-simple__fake
        | STOP
        .demo-control-simple__sound-controls
          .demo-control-simple__sound-play.el-icon-video-play(@click="onStop")
      .demo-control-simple__sound(v-for="sound in soundsFiltered")
        ElImage.demo-control-simple__sound-image(:src="sound.values.value.image", fit="contain")
        | {{ sound.values.label }}
        .demo-control-simple__sound-controls
          .demo-control-simple__sound-play.el-icon-video-play(@click="onSoundClick(sound)")
</template>

<script>
import Socket from '~/custom/system/Socket';
import ActiveEntity from '~/custom/system/modules/controller/ActiveEntity';
import StateEntity from '~/custom/system/modules/controller/StateEntity';

export default {

  mounted() {
    Socket.get((socket) => {
      socket.subscribe(this, 'entity:state', (event) => {
        console.log('socket', event);
      });
    });
  },

  beforeDestroy() {
    Socket.get().unsubscribe(this);
  },

  async fetch() {
    this.state = await StateEntity.load('myz', 'screen.config.simple', 'Screen Config - Simple', {
      musics: [],
      images: [],
    }, this);

    this.playlists = await ActiveEntity.multi('Demo', {
      game: 'myz',
      type: 'screen.music.collection',
    });
    this.sounds = await ActiveEntity.multi('Demo', {
      game: 'myz',
      type: 'screen.music',
    });
    this.sliders = await ActiveEntity.multi('Demo', {
      game: 'myz',
      type: 'screen.image.collection',
    });

    for (const playlist of this.playlists) {
      await this.loadRef(playlist, 'teaser');
    }
    for (const slider of this.sliders) {
      await this.loadRef(slider, 'teaser');
      await this.loadRef(slider, 'automusic');
    }
    this.$forceUpdate();
  },

  data() {
    return {
      state: null,
      sounds: null,
      musics: null,
      images: null,
      sliders: null,
      playlists: null,
    };
  },

  computed: {

    classes() {
      const classes = [];

      return classes;
    },

    soundsFiltered() {
      if (Array.isArray(this.sounds)) {
        return this.sounds.filter(v => v.values.value.properties.sound || v.values.value.properties.video);
      }
      return [];
    },

  },

  methods: {

    async loadRef(entity, field) {
      if (!entity.states[field] && entity.values.value[field].length) {
        entity.states[field] = await ActiveEntity.single('Demo', entity.values.value[field][0]);
      }
    },

    async onPlayImage(image, automusic = false) {
      const images = [];
      for (const value of image.values.value.images) {
        images.push({
          value,
          entity: (await ActiveEntity.single('Demo', {
            game: value.game,
            group: value.group,
            type: value.type,
          })).values,
        });
      }
      this.images = images;
      this.state.up('images');
    },

    async onPlayPlaylist(playlist) {
      const items = [];
      const config = playlist.values.value.properties;

      for (const value of playlist.values.value.musics) {
        items.push({
          value, 
          entity: (await ActiveEntity.single('Demo', {
            game: value.game,
            group: value.group,
            type: value.type,
          })).values,
        });
      }
      this.musics = {
        config,
        items,
      };
      this.state.up('musics');
    },

    onSoundClick(sound) {
      Socket.get().request('control:sound', {
        action: 'toggle',
        sound: sound.values,
      });
    },

    onStop() {
      Socket.get().request('control:stop', {
        target: 'all',
      });
    },

  },

}
</script>
  
<style lang="sass">
.demo-control-simple
  width: 100vw
  height: 100vh
  overflow: hidden

  &__content
    height: 100%
    display: grid
    grid-template-rows: min-content 1fr 150px

  &__top
    height: 5vh

  &__bottom
    display: grid
    grid-template-columns: 1fr 1fr
    height: 100%
    
  &__music,
  &__image
    display: flex
    background: #222

  &__preview
    width: 25%
    height: 15vh

  &__text
    padding: .5em
    position: relative
    width: 100%

  &__controls
    position: absolute
    right: 0
    bottom: 0
    padding: .5em
    background: #444

  &__icon
    font-size: 1.2em

  &__sounds
    display: grid
    grid-template-columns: var(--element-grid--items)
    grid-template-rows: 1fr 1fr
    gap: 1em
    
  &__sound
    background: #222
    display: grid
    grid-template-columns: 20% 1fr min-content
    align-items: center
    width: 100%

  &__sound-image
    height: 100%
    padding: .3em
    box-sizing: border-box

  &__sound-controls
    height: 100%

  &__sound-play
    display: flex
    justify-content: center
    align-items: center
    font-size: 1.8em
    height: 100%
    width: 100%
    background: #444
    padding: 0 .1em
    transition: background .2s ease-in-out
    cursor: pointer

  &__sound-play:hover
    background: #666

</style>