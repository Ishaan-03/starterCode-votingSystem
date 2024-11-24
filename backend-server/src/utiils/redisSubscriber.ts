import { createClient } from "redis";

let redisSubscriber: any; 

const getRedisSubscriber = async () => {
  if (!redisSubscriber) {
    redisSubscriber = createClient();
    try {
      await redisSubscriber.connect();
      console.log("Redis subscriber connected successfully.");
    } catch (error) {
      console.error("Error connecting to Redis:", error);
      throw error; 
    }
  }
  return redisSubscriber;
};

const Subscribe = async (onMessage: (message: string) => void) => {
  try {
    const client = await getRedisSubscriber();
    await client.subscribe("vote_updates", (message: string) => {
      onMessage(message);
    });
    console.log("Subscribed to Redis channel: vote_updates");
  } catch (error) {
    console.error("Error subscribing to Redis channel:", error);
  }
};

export { Subscribe };
