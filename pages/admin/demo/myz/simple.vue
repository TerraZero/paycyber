<template lang="pug">
.demo-myz-simple(:class="classes")
  .demo-myz-simple__intro
    .demo-myz-simple__intro-video(ref="intro")
    .demo-myz-simple__intro-logo
      DemoPaycyberLogo(:subtitle="introText", :show="introShow", :alt="introAlt", :glitch="introGlitch", :hide="introHide")
  ToolPersistentSlider.demo-myz-simple__slider(ref="slider")
  .demo-myz-simple__video(ref="video")
  .demo-myz-simple__quests
    .demo-myz-simple__quests-content
      .demo-myz-simple__quest(v-for="quest in questFilter", :key="quest") {{ quest }}
  .demo-myz-simple__level
    | {{ level }}
</template>

<script>
import Socket from '~/custom/system/Socket';
import SoundSystem from '~/custom/frontend/SoundSystem';
import YTPlayer from 'yt-player';
import StateEntity from '~/custom/system/modules/controller/StateEntity';

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
      } else {
        this.introHideVideo = true;
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
          if (info.fields.includes('quests')) {
            this.setQuests(values.value.quests);
          }
          if (info.fields.includes('questShow')) {
            this.questShow = values.value.questShow;
          }
          if (info.fields.includes('level')) {
            this.levelHighlight = false;
            this.levelIntense = values.value.level;
            setTimeout(() => {
              this.levelHighlight = true;
            }, 100);
            setTimeout(() => {
              this.level = values.value.level;
            }, 600);
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

    StateEntity.load('myz', 'screen.config.simple', 'Screen Config - Simple', {
      musics: [],
      images: [],
      quests: ['', '', '', '', ''],
      questShow: false,
      level: 0,
    }, this).then(() => {
      this.levelIntense = this.level;
    });
  },

  beforeDestroy() {
    Socket.get().unsubscribe(this);
  },

  data() {
    return {
      quests: [],
      questShow: false,
      level: 0,
      levelIntense: 0,
      levelHighlight: false,
      focus: 'slider',
      intro: null,
      currentIntro: null,
      introText: 'Cyber Spire',
      introAlt: true,
      introLogo: false,
      introShow: false,
      introGlitch: false,
      introHide: false,
      introHideVideo: false,
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
      if (this.introHideVideo) classes.push('hide-video');
      if (this.questShow) classes.push('quests');
      if (this.levelIntense > 0) classes.push('level', 'level-' + this.levelIntense);
      if (this.levelHighlight) classes.push('level-highlight');
      return classes.map(v => 'demo-myz-simple--' + v);
    },

    questFilter() {
      const filtered = [];
      for (const quest of this.quests) {
        if (!quest) continue;
        filtered.push(quest);
      }
      return filtered;
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

    setQuests(quests) {
      this.quests = quests;
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
        this.introHideVideo = false;
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

  &__intro-video
    opacity: 1
    transition: opacity .3s ease-in-out

  &--hide-video &__intro-video
    opacity: 0

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

  &__quests
    position: absolute
    top: 4vw
    right: calc(8vw - 100vw)
    color: #ffef02
    z-index: 1000
    font: var(--font--sdd)
    font-size: 2vw
    perspective: 300px
    transition: right .3s ease-in-out

  &--quests &__quests
    right: 8vw
  
  &__quests-content
    border: 2px solid #4bbbe1
    padding: 1em
    transform: rotateY(-11deg) skewY(14deg)
    transform-origin: center
    background: repeating-linear-gradient(to bottom, #4bbbe120 0, #4bbbe120 5px, #0002 8px)

  &__quest
    background: repeating-linear-gradient(to bottom, #4bbbe1 0, #4bbbe1 5px, #000 8px)
    -webkit-background-clip: text
    -webkit-text-fill-color: transparent
    text-shadow: 0 0 2px #4bbbe150

  &__level
    position: absolute
    top: 1vw
    left: 1vw
    width: 6vw
    height: 6vw
    display: flex
    justify-content: center
    align-items: center
    border: 3px solid red
    font: var(--font--blazed)
    font-size: 3vw
    color: var(--level--color)
    border-color: var(--level--color)
    text-shadow: -1px -1px black, 1px 1px black, 0 0 10px var(--level--color)
    z-index: 1000
    opacity: 0
    transition: all 1s ease-in-out
    animation: demo-myz-simple__level-pulse 2s infinite
    --level--intense: 1

  &--level-1 &__level
    opacity: 1
    --level--color: #4bbbe1
    --level--intense: 1

  &--level-2 &__level
    opacity: 1
    --level--color: #a5d571
    --level--intense: 2

  &--level-3 &__level
    opacity: 1
    --level--color: #ffef02
    --level--intense: 3

  &--level-4 &__level
    opacity: 1
    --level--color: #f58013
    --level--intense: 4

  &--level-5 &__level
    opacity: 1
    --level--color: #ed1f24
    --level--intense: 5

  &--level-highlight &__level
    animation: demo-myz-simple__level-pulse 2s infinite, demo-myz-simple__level-highlight 1s forwards
    

@keyframes demo-myz-simple__level-pulse
  0% 
    text-shadow: -1px -1px black, 1px 1px black, 0 0 calc(var(--level--intense) * 5px) var(--level--color), 0 0 calc(var(--level--intense) * 10px) var(--level--color), 0 0 calc(var(--level--intense) * 20px) var(--level--color)
  50% 
    text-shadow: -1px -1px black, 1px 1px black, 0 0 calc(var(--level--intense) * 10px) var(--level--color), 0 0 calc(var(--level--intense) * 20px) var(--level--color), 0 0 calc(var(--level--intense) * 40px) var(--level--color)
  100% 
    text-shadow: -1px -1px black, 1px 1px black, 0 0 calc(var(--level--intense) * 5px) var(--level--color), 0 0 calc(var(--level--intense) * 10px) var(--level--color), 0 0 calc(var(--level--intense) * 20px) var(--level--color)

@keyframes demo-myz-simple__level-highlight
  0%, 100%
    transform: scale(1)
  50% 
    transform: scale(1.2)

</style>