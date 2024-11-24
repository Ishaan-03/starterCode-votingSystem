import { createClient } from "redis";

const redisPublisher = createClient() 

redisPublisher.connect() ;

const publish = async(channel:string, message: string)=>{
    await redisPublisher.publish(channel, message)
}
export default publish ; 
