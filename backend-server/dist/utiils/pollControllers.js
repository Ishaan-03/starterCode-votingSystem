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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getAllPolls = exports.voteOnOption = exports.getPollById = exports.createPoll = void 0;
const client_1 = require("@prisma/client");
const redisPublisher_1 = __importDefault(require("./redisPublisher"));
const prisma = new client_1.PrismaClient();
const createPoll = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
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
        const poll = yield prisma.poll.create({
            data: {
                questions,
                options: {
                    create: options.map((option) => ({ text: option })),
                },
            },
            include: { options: true },
        });
        // Publish the new poll to Redis
        yield (0, redisPublisher_1.default)("poll_created", JSON.stringify(poll));
        // Respond with the created poll
        res.status(201).json(poll);
    }
    catch (error) {
        console.error("Error creating poll:", error);
        res.status(500).json({ error: "Failed to create poll" });
    }
});
exports.createPoll = createPoll;
const getPollById = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { id } = req.params;
        // Fetch the poll by ID including its options
        const poll = yield prisma.poll.findUnique({
            where: { id },
            include: { options: true },
        });
        if (!poll) {
            res.status(404).json({ error: "Poll not found." });
            return;
        }
        res.json(poll);
    }
    catch (error) {
        console.error("Error fetching poll:", error);
        res.status(500).json({ error: "Failed to fetch poll" });
    }
});
exports.getPollById = getPollById;
const voteOnOption = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { id } = req.params; // Poll ID
        const { optionId } = req.body; // Option ID to vote for
        // Validate inputs
        if (!id || !optionId) {
            res.status(400).json({ error: "Poll ID and Option ID are required." });
            return;
        }
        // Check if the option exists and belongs to the specified poll
        const option = yield prisma.option.findFirst({
            where: {
                id: optionId,
                pollid: id
            },
        });
        if (!option) {
            res.status(404).json({ error: "Option not found or does not belong to the specified poll." });
            return;
        }
        // Increment the votes for the specified option
        yield prisma.option.update({
            where: { id: optionId },
            data: { votes: { increment: 1 } },
        });
        // Fetch the updated poll with its options
        const updatedPoll = yield prisma.poll.findUnique({
            where: { id },
            include: { options: true },
        });
        if (!updatedPoll) {
            res.status(404).json({ error: "Poll not found." });
            return;
        }
        // Publish the updated poll to Redis for real-time updates
        yield (0, redisPublisher_1.default)("vote_updates", JSON.stringify(updatedPoll));
        // Respond with the updated poll data
        res.json({ message: "Vote recorded successfully", updatedPoll });
    }
    catch (error) {
        console.error("Error voting on poll option:", error);
        res.status(500).json({ error: "Failed to vote on poll option" });
    }
});
exports.voteOnOption = voteOnOption;
const getAllPolls = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        // Fetch all polls including their options 
        const polls = yield prisma.poll.findMany({
            include: {
                options: true,
            },
        });
        res.json(polls);
    }
    catch (error) {
        console.error("Error fetching all polls:", error);
        res.status(500).json({ error: "Failed to fetch polls" });
    }
});
exports.getAllPolls = getAllPolls;
