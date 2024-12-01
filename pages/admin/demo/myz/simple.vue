<template lang="pug">
.demo-myz-simple(:class="classes")
  .demo-myz-simple__intro(ref="intro")
  ToolPersistentSlider.demo-myz-simple__slider(ref="slider")
  .demo-myz-simple__video(ref="video")
</template>

<script>
import Socket from '~/custom/system/Socket';
import SoundSystem from '~/custom/frontend/SoundSystem';
import YTPlayer from 'yt-player';

function getSoundItem(musicItem, id = 'base') {
  return {
    plugin: musicItem.value.provider,
    path: musicItem.value.src,
    id: id,
    config: {
      start: musicItem.value.start === 0 ? null : musicItem.value.start,
      end: musicItem.value.end === 0 ? null : musicItem.value.end,
      volume: musicItem.value.volume / 100,
      loop: musicItem.value.properties?.loop,
    },
  };
}

export default {

  mounted() {
    this.intro = new YTPlayer(this.$refs.intro);
    SoundSystem.initYoutube(this.$refs.video);
    Socket.get((socket) => {
      socket.subscribe(this, 'entity:state', ({ values, info }) => {
        if (values.type === 'screen.config.simple') {
          if (info.fields.includes('images')) {
            this.setSlides(values.value.images);
          }
          if (info.fields.includes('musics')) {
            this.setPlaylist(values.value.musics);
          }
        }
      });
      socket.subscribe(this, 'control:sound', ({ action, sound }) => {
        if (sound.value.properties.video) {
          this.setIntro(sound);
        } else {
          const item = getSoundItem(sound, 'sound');

          if (SoundSystem.isPlaying(item)) {
            SoundSystem.stop(item);
          } else {
            SoundSystem.play(item);
          }
        }
      });
      socket.subscribe(this, 'control:stop', () => {
        this.intro.stop();
        SoundSystem.stop();
        this.focus = 'slider';
      });
    });
  },

  beforeDestroy() {
    Socket.get().unsubscribe(this);
  },

  data() {
    return {
      focus: 'slider',
      intro: null,
    };
  },

  computed: {

    slider() {
      return this.$refs.slider;
    },

    classes() {
      const classes = [];

      classes.push('focus-' + this.focus);
      return classes.map(v => 'demo-myz-simple--' + v);
    },

  },

  methods: {

    setSlides(images) {
      const slides = [];
      
      for (const image of images) {
        slides.push({
          src: image.entity.value.src,
          time: image.value.time,
        });
      }
      this.slider.setSlides(slides);
    },

    setPlaylist(musics) {
      const playlist = [];
      
      for (const item of musics.items) {
        playlist.push(getSoundItem(item.entity));
      }
      SoundSystem.playlist(playlist, musics.config);
    },  

    setIntro(sound) {
      this.intro.once('cued', () => {
        this.intro.play();
      });
      this.intro.load(sound.value.src);
      this.focus = 'intro';
    },

  },

}
</script>
  
<style lang="sass">
.demo-myz-simple
  width: 100vw
  height: 100vh
  overflow: hidden
  position: relative

  &__slider
    background: black

  &__intro,
  &__video
    position: absolute
    top: 0
    left: 0
    width: 100%
    height: 100%

  &--focus-intro &__intro
    z-index: 1000

  &--focus-slider &__slider
    z-index: 1000

</style>