# OfficeBrief — Local AI Meeting Assistant

OfficeBrief turns raw meeting notes into a concise professional brief containing a summary, decisions, action items and follow-up points.

## Why QVAC?

The AI inference is performed locally with Tether's QVAC SDK. This demo does not call OpenAI, Gemini, Claude or another cloud AI service.

## QVAC requirement

- Package: `@qvac/sdk`
- Version: `0.19.1`
- Required APIs used: `loadModel()` and `completion()`
- Local model: `LLAMA_3_2_1B_INST_Q4_0`

## Run

Requirements: Node.js 22+ and npm.

```bash
npm install
npm start
```

Open http://localhost:3000.

The first inference can take longer because QVAC may download the model. Later runs reuse the loaded model.

## How it works

1. Browser sends the meeting notes to the local Node process.
2. The server calls QVAC `loadModel()`.
3. QVAC runs `completion()` against the local model.
4. The generated meeting brief is returned to the browser.
5. No cloud AI API key is configured or required.

## Demo

Click **Load sample**, then **Create meeting brief**. The result should contain SUMMARY, DECISIONS, ACTION ITEMS and FOLLOW-UP.

## License

Apache License 2.0. See `LICENSE`.
