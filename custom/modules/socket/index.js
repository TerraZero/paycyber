import sio from 'socket.io';
import ServerSocket from './ServerSocket';

export default function () {
  this.nuxt.hook('listen', (server) => {
    const socket = sio(server, {
      cors: {
        origin: '*',
      },
    });

    const serversocket = new ServerSocket(socket);
    serversocket.init();
  });
}