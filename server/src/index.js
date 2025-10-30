import express from "express";
import cors from "cors";

const app = express();
app.use(cors());
app.get("/", (req, res) => res.send("Server is up"));

const PORT = process.env.PORT || 4000;
app.listen(PORT, () => console.log(`🚀 Server on :${PORT}`));
