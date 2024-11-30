const RandomUtil = require('../RandomUtil');

module.exports = class JukeBox {

  constructor() {
    this.items = null;
    this.nextIndex = [];
    this.index = -1;
    this.loop = false;
    this.shuffle = false;
  }

  setItems(items) {
    this.items = items;
    this.index = -1;
    this.generateNext();
    return this;
  }

  setLoop(loop = true) {
    this.loop = loop;
    return this;
  }

  setShuffle(shuffle = true) {
    this.shuffle = shuffle;
    return this;
  }

  generateNext() {
    if (Array.isArray(this.items)) {
      this.nextIndex = Object.keys(this.items);
    } else {
      this.nextIndex = [];
      for (const key in this.items) {
        this.nextIndex.push(key);
      }
    }
    if (this.shuffle) {
      this.shuffleNext();
    }
    return this;
  }

  shuffleNext() {
    this.nextIndex = RandomUtil.shuffleArray(this.nextIndex, true);
    return this;
  }

  key() {
    if (this.index >= this.nextIndex.length) {
      return null;
    }
    return this.nextIndex[this.index];
  }

  current() {
    const key = this.key();
    return key === null ? null : (this.items[key] ?? null);
  }

  nextKey() {
    this.index = (this.index + 1);
    if (this.index >= this.nextIndex.length) {
      if (this.loop) {
        if (this.shuffle) this.shuffleNext();
        this.index = 0;
      }
    }
    return this.key();
  }

  next() {
    this.nextKey();
    return this.current();
  }

}