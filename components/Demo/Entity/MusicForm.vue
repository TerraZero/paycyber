<template lang="pug">
DemoEntityFormBase.demo-entity-music-form(ref="base", title="Music", type="screen.music", @load="onLoad", @save="onSave", @close="onClose", @finish="onFinish")
  DemoFormInput(label="Label", v-model="label")
  DemoFormInput(label="ID", v-model="group", :disabled="entity && !entity.isNew")
  DemoFormSelect(label="Provider", v-model="provider", :options="providerOptions")
  .demo-entity-music-form__row
    DemoFormInput(label="Source", v-model="src")
    ElButton(icon="el-icon-refresh", @click="onLoadVideo")
    ExternalYoutubeProvider(ref="video", v-if="src", :id="src")
  DemoFormImage(label="Image", v-model="image")
  DemoFormInput(label="Start", v-model="start")
  DemoFormInput(label="End", v-model="end")
  DemoFormSlider(label="Volume", v-model="volume", :min="0", :max="100")
  template(#sidebar)
    DemoFormCheckboxes(label="Properties", v-model="properties", :options="propertiesOptions", mode="props")
</template>

<script>
import FormBase from './FormBase.mixin';

export default {
  mixins: [FormBase],

  data() {
    return {
      providerOptions: {
        youtube: 'Youtube',
        howler: 'Howler (File)',
      },
      propertiesOptions: {
        sound: 'Sound',
        loop: 'Loop',
        video: 'Video',
      },
      entity: null,
      label: '',
      group: '',
      provider: 'youtube',
      src: '',
      image: '',
      start: 0,
      end: 0,
      volume: 100,
      properties: {},
    };
  },

  methods: {

    validate(entity) {
      let reason = false;
      if (typeof (reason = FormBase.methods.validate(entity)) === 'string') {
        return reason;
      }
      if (entity.values.value.src.length === 0) {
        return 'The source is required.';
      }
      return true;
    },

    pack(entity) {
      entity.values.label = this.label;
      entity.values.group = this.group;
      entity.values.value.provider = this.provider;
      entity.values.value.src = this.src;
      entity.values.value.image = this.image;
      entity.values.value.start = this.start;
      entity.values.value.end = this.end;
      entity.values.value.volume = this.volume;
      entity.values.value.properties = this.properties;
    },

    unpack(entity) {
      this.label = entity.values.label ?? '';
      this.group = entity.values.group ?? '';
      this.provider = entity.values.value.provider ?? 'youtube';
      this.src = entity.values.value.src ?? '';
      this.image = entity.values.value.image ?? '';
      this.start = entity.values.value.start ?? 0;
      this.end = entity.values.value.end ?? 0;
      this.volume = entity.values.value.volume ?? 100;
      this.properties = entity.values.value.properties ?? {};
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
    display: grid
    grid-template-columns: 1fr min-content
    grid-template-areas: "a b" "c c"
    gap: 1em

</style>