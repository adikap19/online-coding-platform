import mongoose from "mongoose";

const CodeBlockSchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    slug: { type: String, required: true, unique: true },
    initialCode: { type: String, default: "" },
    solution: { type: String, default: "" },
    hints: {
      type: [String],
      default: [],
    },
  },
  { timestamps: true }
);

export default mongoose.model("CodeBlock", CodeBlockSchema);
