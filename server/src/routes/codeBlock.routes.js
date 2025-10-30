import { Router } from "express";
import { listBlocks, getBlock } from "../controllers/codeBlock.controller.js";

const router = Router();

router.get("/codeblocks", listBlocks);
router.get("/codeblocks/:id", getBlock);

export default router;
