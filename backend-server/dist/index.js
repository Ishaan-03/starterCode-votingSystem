"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const client_1 = require("@prisma/client");
const pollRoutes_1 = __importDefault(require("./routes/pollRoutes"));
const http_1 = __importDefault(require("http"));
const dotenv_1 = __importDefault(require("dotenv"));
const websocket_1 = require("./utiils/websocket");
const redisSubscriber_1 = require("./utiils/redisSubscriber");
dotenv_1.default.config();
const prisma = new client_1.PrismaClient();
const app = (0, express_1.default)();
const server = http_1.default.createServer(app);
app.use(express_1.default.json());
app.use((0, cors_1.default)());
app.use("/polls", pollRoutes_1.default);
// Initialize WebSocket server
(0, websocket_1.initWebsocket)(server);
// Subscribe to Redis channels for real-time updates
(0, redisSubscriber_1.Subscribe)((message) => {
    console.log("Message received from Redis:", message);
});
// Define PORT (default to port specified in environment variables or fallback to port 8080)
const PORT = process.env.PORT || '8080';
// Use the `server.listen` instead of `app.listen`
server.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
