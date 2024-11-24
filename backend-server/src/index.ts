import express from "express";
import cors from "cors";
import { PrismaClient } from "@prisma/client";
import pollRoutes from "./routes/pollRoutes";
import http from "http";
import dotenv from "dotenv";
import { initWebsocket } from "./utiils/websocket";
import { Subscribe } from "./utiils/redisSubscriber";

dotenv.config();

const prisma = new PrismaClient();
const app = express();
const server = http.createServer(app);

app.use(express.json());
app.use(cors());

app.use("/polls", pollRoutes);

// Initialize WebSocket server
initWebsocket(server);

// Subscribe to Redis channels for real-time updates
Subscribe((message: string) => {
   console.log("Message received from Redis:", message);
});

// Define PORT (default to port specified in environment variables or fallback to port 8080)
const PORT = process.env.PORT || '8080';

// Use the `server.listen` instead of `app.listen`
server.listen(PORT, () => {
   console.log(`Server is running on port ${PORT}`);
});