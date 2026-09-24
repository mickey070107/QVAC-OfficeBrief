import express from "express";
import {
  loadModel,
  completion,
  unloadModel,
  LLAMA_3_2_1B_INST_Q4_0
} from "@qvac/sdk";

const app = express();
app.use(express.json({ limit: "1mb" }));
app.use(express.static("public"));

let modelId = null;
let loading = null;

async function getModel() {
  if (modelId) return modelId;
  if (!loading) {
    loading = loadModel({
      modelSrc: LLAMA_3_2_1B_INST_Q4_0,
      onProgress: (p) => console.log("QVAC model:", p)
    }).then(id => {
      modelId = id;
      return id;
    }).finally(() => { loading = null; });
  }
  return loading;
}

app.post("/api/brief", async (req, res) => {
  try {
    const notes = String(req.body?.notes || "").trim();
    if (!notes) return res.status(400).json({ error: "Please enter meeting notes." });

    const id = await getModel();
    const prompt = `You are an office meeting assistant. Turn the following raw meeting notes into a concise professional meeting brief.

Return exactly these sections:
SUMMARY:
- 2 to 4 bullets

DECISIONS:
- bullets, or "None recorded"

ACTION ITEMS:
- Owner — action — deadline if stated
- If owner/deadline is not stated, write "Unassigned — ... — Not specified"

FOLLOW-UP:
- 1 to 3 bullets

Do not invent facts. Keep names, dates and numbers from the notes unchanged.

RAW NOTES:
${notes}`;

    const result = completion({
      modelId: id,
      history: [{ role: "user", content: prompt }],
      stream: true
    });

    let output = "";
    for await (const token of result.tokenStream) output += token;
    res.json({ output });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err?.message || "QVAC inference failed." });
  }
});

app.get("/api/status", (req, res) => {
  res.json({ modelLoaded: Boolean(modelId), localInference: true });
});

const server = app.listen(3000, () => {
  console.log("OfficeBrief running at http://localhost:3000");
  console.log("AI inference: local QVAC model; no cloud AI API is used.");
});

process.on("SIGINT", async () => {
  if (modelId) await unloadModel({ modelId }).catch(() => {});
  server.close(() => process.exit(0));
});
