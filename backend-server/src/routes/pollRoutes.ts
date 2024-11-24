import { Router } from "express";
import { createPoll, getPollById, getAllPolls, voteOnOption } from "../utiils/pollControllers";

const router = Router();

// POST /polls - create a new poll
router.post("/", createPoll);

// GET /polls/:id - fetch a poll by ID
router.get("/:id", getPollById);

// GET /polls - fetch all polls
router.get("/", getAllPolls);

// POST /polls/:id/vote - cast a vote on a poll option
router.post("/:id/vote", voteOnOption);

export default router;