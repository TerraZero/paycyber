<template lang="pug">
DemoEntityFormBase.demo-entity-music-form(ref="base", title="Music", type="screen.music", @load="onLoad", @save="onSave", @close="onClose", @finish="onFinish")
  DemoFormInput(label="Label", v-model="label")
  DemoFormInput(label="ID", v-model="group", :disabled="entity && !entity.isNew")
  DemoFormSelect(label="Provider", v-model="provider", :options="providerOptions")
  .demo-entity-music-form__row
    DemoFormInput(label="Source", v-model="src")
    ElButton(icon="el-icon-refresh", @click="onLoadVideo")
  ExternalYoutubeProvider(ref="video", v-if="src", :id="src")
  DemoFormInput(label="Start", v-model="start")
  DemoFormInput(label="End", v-model="end")
  DemoFormSlider(label="Volume", v-model="volume", :min="0", :max="100")
</template>

<script>
import FormBase from './FormBase.mixin';

export default {
  mixins: [FormBase],

  data() {
    return {
      providerOptions: {
        'youtube': 'Youtube',
        'file': 'File',
      },
      entity: null,
      label: '',
      group: '',
      provider: 'youtube',
      src: '',
      start: 0,
      end: 0,
      volume: 100,
    };
  },

  methods: {

    pack(entity) {
      entity.values.label = this.label;
      entity.values.group = this.group;
      entity.values.value.provider = this.provider;
      entity.values.value.src = this.src;
      entity.values.value.start = this.start;
      entity.values.value.end = this.end;
      entity.values.value.volume = this.volume;
    },

    unpack(entity) {
      this.label = entity.values.label ?? '';
      this.group = entity.values.group ?? '';
      this.provider = entity.values.value.provider ?? 'youtube';
      this.src = entity.values.value.src ?? '';
      this.start = entity.values.value.start ?? 0;
      this.end = entity.values.value.end ?? 0;
      this.volume = entity.values.value.volume ?? 100;
    },

    onLoadVideo() {
      if (this.src) {
        this.$refs.video.load();
      } else {
        this.$message.error('To load the video you need a source.');
      }
    },

  },
}
</script>
  
<style lang="sass">
.demo-entity-music-form

  &__row
    display: flex
    gap: 1em
</style>