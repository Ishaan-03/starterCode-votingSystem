import { WebSocketServer } from "ws";
import { Subscribe } from "./redisSubscriber";

export const initWebsocket = (server: any) => {
    const ws = new WebSocketServer({ server });

    // Listen for WebSocket client connections
    ws.on("connection", (socket) => {
        console.log("WebSocket client connected");

    });

    // Forward Redis messages to WebSocket clients
    Subscribe((message) => {
        ws.clients.forEach((client) => {
            if (client.readyState === client.OPEN) {
                client.send(message);
            }
        });
    });
};
