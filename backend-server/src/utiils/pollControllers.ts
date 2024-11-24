import { Request, Response } from "express";
import { PrismaClient } from "@prisma/client";
import publish from "./redisPublisher";

const prisma = new PrismaClient();

export const createPoll = async (req: Request, res: Response): Promise<void> => {
   try {
       const { questions, options } = req.body;

       // Validate input
       if (!questions || !options || !Array.isArray(options) || options.length < 2) {
           res.status(400).json({
               error: "A question and at least two options are required.",
           });
           return;
       }

       // Create the poll and associated options in the database
       const poll = await prisma.poll.create({
           data: {
               questions,
               options: {
                   create: options.map((option: string) => ({ text: option })),
               },
           },
           include: { options: true },
       });

       // Publish the new poll to Redis
       await publish("poll_created", JSON.stringify(poll));

       // Respond with the created poll
       res.status(201).json(poll);
   } catch (error) {
       console.error("Error creating poll:", error);
       res.status(500).json({ error: "Failed to create poll" });
   }
};

export const getPollById = async (req: Request, res: Response): Promise<void> => {
   try {
       const { id } = req.params;

       // Fetch the poll by ID including its options
       const poll = await prisma.poll.findUnique({
           where: { id },
           include: { options: true },
       });

       if (!poll) {
           res.status(404).json({ error: "Poll not found." });
           return;
       }

       res.json(poll);
   } catch (error) {
       console.error("Error fetching poll:", error);
       res.status(500).json({ error: "Failed to fetch poll" });
   }
};

export const voteOnOption = async (req: Request, res: Response): Promise<void> => {
   try {
       const { id } = req.params; // Poll ID
       const { optionId } = req.body; // Option ID to vote for

       // Validate inputs
       if (!id || !optionId) {
           res.status(400).json({ error: "Poll ID and Option ID are required." });
           return;
       }

       // Check if the option exists and belongs to the specified poll
       const option = await prisma.option.findFirst({
           where:{ 
               id : optionId,
               pollid : id 
           },
       });

       if (!option) {
           res.status(404).json({ error:"Option not found or does not belong to the specified poll." });
           return;
       }

       // Increment the votes for the specified option
       await prisma.option.update({
           where:{ id : optionId },
           data:{ votes:{ increment :1 }},
       });

       // Fetch the updated poll with its options
       const updatedPoll = await prisma.poll.findUnique({
           where:{ id },
           include:{ options:true },
       });

       if (!updatedPoll) {
           res.status(404).json({ error:"Poll not found." });
           return;
       }

       // Publish the updated poll to Redis for real-time updates
       await publish("vote_updates", JSON.stringify(updatedPoll));

       // Respond with the updated poll data
       res.json({ message:"Vote recorded successfully", updatedPoll });
   } catch (error) {
       console.error("Error voting on poll option:", error);
       res.status(500).json({ error:"Failed to vote on poll option" });
   }
};

export const getAllPolls = async (req : Request , res : Response ): Promise<void> =>{
   try{
     // Fetch all polls including their options 
     const polls=await prisma.poll.findMany({
         include:{
             options:true,
         },
     });

     res.json(polls); 
   }
   catch(error){
     console.error("Error fetching all polls:", error); 
     res.status(500).json({ error:"Failed to fetch polls" }); 
   }
};