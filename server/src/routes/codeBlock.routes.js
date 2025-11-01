import { Router } from "express";
import { listBlocks, getBlock } from "../controllers/codeBlock.controller.js";

// defines routes for fetching all code blocks and a single code block by ID

const router = Router();

router.get("/codeblocks", listBlocks);
router.get("/codeblocks/:id", getBlock);

export default router;
