<template lang="pug">
.demo-myz-simple(:class="classes")
  .demo-myz-simple__intro
    .demo-myz-simple__intro-video(ref="intro")
    .demo-myz-simple__intro-logo
      DemoPaycyberLogo(:subtitle="introText", :show="introShow", :alt="introAlt", :glitch="introGlitch", :hide="introHide")
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

    SoundSystem.get().events.on('change', ({ system, prop }) => {
      if (!this.currentIntro) return;
      if (prop === 'volume') {
        this.intro.setVolume(this.currentIntro.value.volume * system.volume());
      }
    });

    this.intro.on('ended', () => {
      if (!this.currentIntro) return;
      if (this.currentIntro.value.properties.loop) {
        this.intro.play();
      }
    });

    SoundSystem.initYoutube(this.$refs.video);
    Socket.get((socket) => {
      socket.subscribe(this, 'entity:state', ({ values, info }) => {
        this.log('entity:state', values, info);
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
        this.log('control:sound', action, sound);
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
        this.log('control:stop');
        this.stop();
      });
      socket.subscribe(this, 'control:sound:volume', ({ volume }) => {
        console.log('volume', volume);
        SoundSystem.get().volume(volume / 100);
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
      currentIntro: null,
      introText: 'Cyber Spire',
      introAlt: true,
      introLogo: false,
      introShow: false,
      introGlitch: false,
      introHide: false,
    };
  },

  computed: {

    slider() {
      return this.$refs.slider;
    },

    classes() {
      const classes = [];

      classes.push('focus-' + this.focus);
      if (this.introLogo) classes.push('logo');
      return classes.map(v => 'demo-myz-simple--' + v);
    },

  },

  methods: {

    log(...messages) {
      console.log('Control: ', ...messages);
    },

    setSlides(images) {
      if (this.focus === 'intro') {
        this.stop();
      }
      this.focus = 'slider';
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
      this.stop();
      this.intro.once('cued', () => {
        this.currentIntro = sound;
        this.intro.setPlaybackQuality('highres');
        this.intro.setVolume(sound.value.volume * SoundSystem.get().volume());
        this.introLogo = sound.value.properties.logo ?? false;
        this.introAlt = true;
        this.introGlitch = false;
        setTimeout(() => {
          this.introShow = true;
          this.intro.play();
        }, 1000);
        if (sound.group === 'intro') {
          this.introHide = true;
          setTimeout(() => {
            this.introShow = true;
            this.introGlitch = true;
            this.introAlt = false;
            this.introText = 'Nexus War';
            this.introLogo = true;
            this.introHide = false;
          }, 145000); // 145000
        }
      });
      this.intro.load(sound.value.src);
      this.focus = 'intro';
    },

    stop() {
      this.intro.stop();
      this.introLogo = false;
      this.currentIntro = null;
      SoundSystem.stop();
      this.focus = 'slider';
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
  &__intro-video,
  &__intro-logo,
  &__intro-logo:before,
  &__video
    position: absolute
    top: 0
    left: 0
    width: 100%
    height: 100%

  &--logo &__intro-video
    filter: contrast(106%) saturate(100%) brightness(300%) blur(1px) grayscale(30%) sepia(30%)

  &__intro-logo
    transition: opacity 1s ease-in-out
    opacity: 0

  &__intro-logo:before
    content: ''
    background: rgba(0, 0, 0, .6)

  &--logo &__intro-logo
    opacity: 1

  &--focus-intro &__intro
    z-index: 1000

  &--focus-slider &__slider
    z-index: 1000

</style>