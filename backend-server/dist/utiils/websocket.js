"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.initWebsocket = void 0;
const ws_1 = require("ws");
const redisSubscriber_1 = require("./redisSubscriber");
const initWebsocket = (server) => {
    const ws = new ws_1.WebSocketServer({ server });
    // Listen for WebSocket client connections
    ws.on("connection", (socket) => {
        console.log("WebSocket client connected");
    });
    // Forward Redis messages to WebSocket clients
    (0, redisSubscriber_1.Subscribe)((message) => {
        ws.clients.forEach((client) => {
            if (client.readyState === client.OPEN) {
                client.send(message);
            }
        });
    });
};
exports.initWebsocket = initWebsocket;
