# Devpost Draft — Investor Diligence War Room

## Inspiration

Most investor memos fail in one of two ways: they take too long to write, or they sound too confident too early. AI can help with speed, but it can also blur the line between a real signal and a guess.

Investor Diligence War Room is my answer to that problem. It is not just an AI memo writer. It is a diligence workspace that separates evidence, assumptions, red flags, and next questions before a human investor decides what to believe.

## What It Does

The app turns company notes into an investor-ready diligence packet:

- investability hypothesis
- evidence receipts
- assumptions to verify
- red flags
- next investor questions
- exportable Markdown memo

The score is deliberately labeled as a working hypothesis. It is not investment advice and not a final decision.

## How I Built It

I built the first version as a static web app with HTML, CSS, and JavaScript so the workflow is inspectable and easy to run. The current public MVP uses deterministic logic to make the evidence boundary clear, and a sanitized Vertex AI Gemini smoke proof shows the model-backed memo drafting path. The next version can add source-cited live web extraction while preserving the same human-approval structure.

## Challenges

The biggest challenge was avoiding a generic AI chatbot. The useful product is not "ask AI about a startup." The useful product is a structured room where a human investor can see what is evidence, what is assumption, and what still needs to be asked.

## Accomplishments

- Built a working diligence workflow.
- Made evidence and assumptions visible.
- Added red flags and next questions.
- Added exportable memo output.
- Kept the claim boundary explicit.

## What's Next

- Add source-cited web research.
- Add model-backed memo drafting.
- Add investor call transcript import.
- Add collaboration and review history.
- Measure how much time it saves in a real diligence workflow.
