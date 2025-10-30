import CodeBlock from "../models/CodeBlock.js";

/* list of blocks for the lobby*/
export async function listBlocks(req, res, next) {
  try {
    const blocks = await CodeBlock.find({}, { title: 1 }).sort({ title: 1 });
    res.json(blocks);
  } catch (err) {
    next(err);
  }
}

/* details of one block */
export async function getBlock(req, res, next) {
  try {
    const { id } = req.params;
    const block = await CodeBlock.findById(id, { title: 1, initialCode: 1 });
    if (!block)
      return res.status(404).json({ message: "Code block not found" });
    res.json(block);
  } catch (err) {
    next(err);
  }
}
