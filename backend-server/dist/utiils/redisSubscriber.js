"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Subscribe = void 0;
const redis_1 = require("redis");
let redisSubscriber;
const getRedisSubscriber = () => __awaiter(void 0, void 0, void 0, function* () {
    if (!redisSubscriber) {
        redisSubscriber = (0, redis_1.createClient)();
        try {
            yield redisSubscriber.connect();
            console.log("Redis subscriber connected successfully.");
        }
        catch (error) {
            console.error("Error connecting to Redis:", error);
            throw error;
        }
    }
    return redisSubscriber;
});
const Subscribe = (onMessage) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const client = yield getRedisSubscriber();
        yield client.subscribe("vote_updates", (message) => {
            onMessage(message);
        });
        console.log("Subscribed to Redis channel: vote_updates");
    }
    catch (error) {
        console.error("Error subscribing to Redis channel:", error);
    }
});
exports.Subscribe = Subscribe;
