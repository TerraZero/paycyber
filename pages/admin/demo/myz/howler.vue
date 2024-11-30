<template lang="pug">
.demo-myz-howler(@click="onClick")
  .demo-myz-howler__video(ref="video")
</template>

<script>
import SoundSystem from '~/custom/frontend/SoundSystem';

  const howlerItem = {
          plugin: 'howler',
          path: 'sfx/helicopter-fly.wav',
          config: {
            end: 1000,
          },
        };

export default {

  mounted() {
    SoundSystem.initYoutube(this.$refs.video);
  },

  data() {
    return {
      times: 0,
    };
  },

  methods: {

    onClick() {
      switch (this.times++) {
        case 0:
          SoundSystem.playlist([
            {
              plugin: 'youtube',
              path: 'mlsjnDc60gE',
              config: {
                end: 2000,
              },
            },
            {
              plugin: 'youtube',
              path: 'oVIPdAFJnEc',
              config: {
                end: 2000,
              },
            },
            {
              plugin: 'howler',
              path: 'sfx/helicopter-fly.wav',
              config: {
                end: 2000,
              },
              id: 'playlist',
            },
            {
              plugin: 'youtube',
              path: 'fiaCzxjp2IE',
              config: {
                end: 2000,
              },
            },
          ], {
            loop: true,
            shuffle: true,
          });
          break;
        case 1:
          SoundSystem.play(howlerItem);
          break;
      }
    },

  },

}
</script>
  
<style lang="sass">
.demo-myz-howler
  width: 100vw
  height: 100vh
  overflow: hidden
  position: relative
  background: green
</style>