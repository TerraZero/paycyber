import { io } from 'socket.io-client';
import { v4 as UUID } from 'uuid';

/**
 * @typedef {function(import('./Socket').default)} socketCallback
 */

export default class Socket {

  /**
   * @param {socketCallback} factory 
   * @returns {Socket}
   */
  static get(factory = null) {
    if (this._instance === undefined) {
      this._instance = new Socket();
    }
    return this._instance.callback(factory);
  }

  constructor() {
    this._socket = null;
    this.register = [];
    this.listeners = {};
    this.callbacks = [];
    this.ready = false;
    this.init();
  }

  /** @returns {import('socket.io-client').Socket} */
  get socket() {
    if (this._socket === null) {
      this._socket = io(window.location.protocol + '//' + window.location.host);
    }
    return this._socket;
  }

  init() {
    this.socket.on('request', ({ uuid, channel, data }) => {
      for (const key in this.listeners) {
        if (this.listeners[key][channel]) {
          for (const listener of this.listeners[key][channel]) {
            listener(data, { uuid, channel, data });
          }
        }
      }
    });

    this.socket.on('response', ({ uuid, data }) => {
      this.doResolve(uuid, data);
    });

    this.socket.on('server:connect', () => {
      this.ready = true;
      for (const callback of this.callbacks) {
        callback(this);
      }
    });
  }

  callback(factory = null) {
    if (factory === null) return this;
    if (this.ready) {
      factory(this);
    } else {
      this.callbacks.push(factory);
    }
    return this;
  }

  call(method, parameters) {
    const uuid = UUID();
    const item = {};

    item.promise = new Promise((res, rej) => {
      item.uuid = uuid;
      item.res = res;
      item.rej = rej;
      parameters.uuid = uuid;
      this.socket.emit(method, parameters);
    });
    this.register.push(item);
    return item.promise;
  }

  doResolve(uuid, value) {
    const index = this.register.findIndex(v => v.uuid === uuid);
    if (index !== -1) {
      this.register[index].res(value);
      this.register.splice(index, 1);
    }
  }

  doReject(uuid, value) {
    const index = this.register.findIndex(v => v.uuid === uuid);
    if (index !== -1) {
      this.register[index].rej(value);
      this.register.splice(index, 1);2
    }
  }

  subscribe(comp, channel, listener) {
    this.listeners[comp.$vnode.data.key] ??= {};
    this.listeners[comp.$vnode.data.key][channel] ??= [];
    this.listeners[comp.$vnode.data.key][channel].push(listener);
    return this.call('subscribe', { channel });
  }

  unsubscribe(comp) {
    delete this.listeners[comp.$vnode.data.key];
  }

  request(channel, data) {
    return this.call('send', { channel, data });
  }

}