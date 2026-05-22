# Devpost Draft — Investor Diligence War Room

Live app: https://daideguchi.github.io/investor-diligence-war-room/

Source code: https://github.com/daideguchi/investor-diligence-war-room

Demo video: https://github.com/daideguchi/investor-diligence-war-room/releases/download/v0.1-submission/investor-diligence-war-room-demo-narrated.mp4

## Inspiration

Early diligence is messy. A reviewer may have a company website, a founder claim, a market guess, and a few notes from a call. AI can draft a polished memo quickly, but polished is not the same as trustworthy. A confident AI paragraph can blur the line between evidence, assumption, and wishful thinking.

Investor Diligence War Room is built around that boundary. It helps investors move faster without pretending that weak notes are verified proof.

## What It Does

The app turns company notes into an investor-ready diligence packet:

- investability hypothesis
- evidence receipts
- assumptions to verify
- red flags
- next investor questions
- exportable Markdown memo

The score is deliberately labeled as a working hypothesis. It is not investment advice and not a final decision. Revenue, customers, and market claims stay unverified unless proof is attached.

## How I Built It

I built the first version as a static web app with HTML, CSS, and JavaScript so the workflow is inspectable and easy to run. The public MVP uses deterministic logic to make the evidence boundary clear, and a sanitized Vertex AI Gemini smoke proof shows the model-backed memo drafting path. The app displays the model, route, HTTP status, token count, and claim boundary without exposing credentials.

## Challenges

The biggest challenge was avoiding a generic AI chatbot. The useful product is not "ask AI about a startup." The useful product is a structured room where a human investor can see what is evidence, what is assumption, and what still needs to be asked.

## Accomplishments

- Built a working diligence workflow.
- Made evidence and assumptions visible.
- Added red flags and next questions.
- Added exportable memo output.
- Added a sanitized Gemini live-call proof.
- Added a two-minute narrated demo asset.
- Kept the claim boundary explicit.

## What's Next

- Add source-cited web research.
- Add model-backed memo drafting.
- Add investor call transcript import.
- Add collaboration and review history.
- Measure how much time it saves in a real diligence workflow.
