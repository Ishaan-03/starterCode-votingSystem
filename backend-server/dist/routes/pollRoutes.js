"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const pollControllers_1 = require("../utiils/pollControllers");
const router = (0, express_1.Router)();
// POST /polls - create a new poll
router.post("/", pollControllers_1.createPoll);
// GET /polls/:id - fetch a poll by ID
router.get("/:id", pollControllers_1.getPollById);
// GET /polls - fetch all polls
router.get("/", pollControllers_1.getAllPolls);
// POST /polls/:id/vote - cast a vote on a poll option
router.post("/:id/vote", pollControllers_1.voteOnOption);
exports.default = router;
