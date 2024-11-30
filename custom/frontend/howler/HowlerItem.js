const Path = require('path');
const { Howl } = require('howler');

module.exports = class HowlerItem {

  /**
   * @param {import('../SoundSystem').T_SoundItem} item 
   * @returns {string}
   */
  static id(item) {
    return item.path + '::' + (item.id ?? '#');
  }
  
  /**
   * @param {import('./HowlerSystem')} howler 
   * @param {import('../SoundSystem').T_SoundItem} item 
   */
  constructor(howler, item) {
    this.howler = howler;
    this.item = item;
    this.ready = false;

    this._id = null;
    this._path = null;
    this._howl = null;
    this._timeouts = {};
  }

  /**
   * @param {string} prop 
   */
  onChange(prop) {
    const sound = this.load();

    if (prop === 'volume') {
      const itemVolume = this.item?.config?.volume ?? 1;
      sound.volume(itemVolume * this.howler.system.volume());
    }
  }

  id() {
    if (this._id === null) {
      this._id = this.constructor.id(this.item);
    }
    return this._id;
  }

  path() {
    if (this._path === null) {
      if (this.item.path.startsWith('/media/audio/')) {
        this._path = item.path;
      } else {
        this._path = Path.join('/media/audio/', this.item.path);
      }
    }
    return this._path;
  }

  load(ready) {
    if (this._howl === null) {
      this._howl = new Howl({
        src: [this.path()],
      });
      this._howl.once('load', () => {
        this.ready = true;
      });
      const callback = () => {
        this.howler.system.events.emit('end', {
          trigger: 'end',
          item: this.item,
          plugin: 'howler',
          sound: this,
        });
      };
      this._howl.on('stop', callback)
      this._howl.on('end', callback); 
    }
    if (ready) {
      if (this.ready) {
        ready(this);
      } else {
        this._howl.once('load', () => {
          ready(this);
        });
      }
    }
    return this._howl;
  }

  play(config = null) {
    const sound = this.load();

    if (sound.playing()) {
      if (config !== null) {
        this.item.config = config;
        this.loadConfig();
      }
    } else {
      this.loadConfig();
      this.attachEvents();
      sound.play();
    }
    return this;
  }

  stop() {
    const sound = this.load();
    if (sound.playing()) {
      sound.stop();
    } 
    this.clearEvents();
    return this;
  }

  loadConfig() {
    if (this.item.config) {
      if (!this.isPlaying()) {
        const sound = this.load();

        if (this.item.config.loop !== undefined) {
          sound.loop(this.item.config.loop);
        }
        if (this.item.config.end) {
          setTimeout(() => {
            sound.stop();
          }, this.item.config.end);
        }
      }
      this.onChange('volume');
    }
    return this;
  }

  clearEvents() {
    for (const time in this._timeouts) {
      clearTimeout(this._timeouts[time]);
      delete this._timeouts[time];
    }
    return this;
  }

  attachEvents() {
    if (this.item.on) {
      const sound = this.load();

      sound.once('play', () => {
        for (const time in this.item.on) {
          this._timeouts[time] = setTimeout(() => {
            this.item.on[time](this);
            delete this._timeouts[time];
          }, time);
        }
      });
    }
    return this;
  }

  fade(to, duration) {
    if (this.isPlaying()) {
      const sound = this.load();
      sound.fade(sound.volume(), to * this.howler.system.volume(), duration);
    }
  }

  isPlaying() {
    return this.load().playing();
  }

}