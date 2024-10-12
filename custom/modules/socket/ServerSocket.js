export default class ServerSocket {

  /**
   * @param {import('socket.io')} socket 
   */
  constructor(socket) {
    this.socket = socket;
    this.clients = [];
  }

  init() {
    try {
      this.socket.on('connection', client => {
        const clientItem = {
          client,
          id: client.id,
          subscribed: [],
        }
        this.clients.push(clientItem);

        client.on('subscribe', async ({ uuid, channel }) => {
          if (!clientItem.subscribed.includes(channel)) {
            clientItem.subscribed.push(channel);
          }
          client.emit('response', {
            uuid,
            subscribed: clientItem.subscribed,
          });
        });

        client.on('unsubscribe', async ({ uuid, channel }) => {
          const index = clientItem.subscribed.findIndex(v => v === channel);
          if (index !== -1) {
            clientItem.subscribed.splice(index, 1);
          }
          client.emit('response', {
            uuid,
            data: {
              subscribed: clientItem.subscribed,
            },
          });
        });

        client.on('send', async ({ uuid, channel, data }) => {
          const list = [];
          for (const c of this.clients) {
            if (c.subscribed.includes(channel)) {
              c.client.emit('request', { uuid, channel, data });
              list.push(c.id);
            }
          }
          client.emit('response', {
            uuid,
            data: {
              clients: list,
            },
          });
        });

        client.on('disconnect', () => {
          const index = this.clients.findIndex(v => v.id === client.id);
          this.clients.splice(index, 1);
        });

        client.emit('server:connect', {
          id: clientItem.id,
        });
      });
    } catch (error) {
      console.log('[SERVER SOCKET]:', error);
    }
  }

}