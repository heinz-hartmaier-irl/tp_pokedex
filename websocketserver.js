const WebSocket = require('ws');
// Lancement du serveur Web socket sur le port 8181
const wss = new WebSocket.Server({ port: 8181 });

wss.on('connection', function connection(client) {

    client.on('message', function incoming(message) {
        console.log('received: %s', message);
        wss.clients.forEach((c) =>{
            if (c !== client && c.readyState === WebSocket.OPEN){
                client.send(`S: ${message}`);
            }
        });
    });
    
    client.send('This is a message');
    });

exports.module = wss;