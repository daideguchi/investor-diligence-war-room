# Submission Package — Investor Diligence War Room

## Project Name

Investor Diligence War Room

## Tagline

Evidence-aware investment memos from messy startup notes.

## Public Links

- Live app: https://daideguchi.github.io/investor-diligence-war-room/
- GitHub repo: https://github.com/daideguchi/investor-diligence-war-room
- Demo video asset: `media/investor-diligence-war-room-demo-narrated.mp4`

## 250-500 Word Project Description

Investor Diligence War Room helps investors, scouts, accelerators, and angels turn scattered startup notes into an evidence-aware first-pass diligence memo.

The problem is simple: early diligence is messy. A reviewer may have a company website, a founder claim, a market guess, and a few notes from a call. AI can draft a polished memo quickly, but polished is not the same as trustworthy. A confident AI paragraph can blur the line between evidence, assumption, and wishful thinking.

This product is built around that boundary.

The app takes a company name, website, stage, market, and raw notes. It produces an investability hypothesis, evidence receipts, assumptions to verify, red flags, next investor questions, and an exportable Markdown memo. The score is deliberately labeled as a working hypothesis, not an investment decision. Revenue, customers, and market claims stay unverified unless proof is attached.

The novel insight is that investor AI tooling should not only make memos faster. It should make uncertainty easier to see. The workflow is not a generic chatbot; it is a structured diligence room that turns the output into a call plan and review artifact.

The current build is a static web app so judges can inspect the workflow immediately. It also includes a sanitized Vertex AI Gemini proof showing that a real model-backed drafting path has been tested. The app displays the model, route, HTTP status, token count, and claim boundary without exposing credentials.

The business wedge is practical: scouts and investors already work in memos, and the painful job is turning messy notes into something reviewable. Investor Diligence War Room speeds that up while keeping human judgment in control.

## What It Does

The app produces:

- an investability hypothesis
- evidence receipts
- assumptions to verify
- red flags
- next investor questions
- an exportable Markdown memo

## How It Was Built

The current prototype is a static web app using HTML, CSS, and JavaScript. The workflow is deterministic for the public MVP so judges can inspect the claim boundary clearly.

The product is designed so a model API can draft deeper memos while preserving the same evidence / assumption / human-approval structure. A sanitized Vertex AI Gemini smoke proof is attached at `media/gemini-live-diligence-proof.json`.

## Claim Boundary

This prototype creates a diligence hypothesis from user-provided notes.

It does not claim:

- investment advice
- verified revenue
- verified customers
- live web extraction
- final investment decisions

## What's Next

- Add live web evidence extraction.
- Add model-backed memo drafting.
- Attach source citations.
- Add investor call transcript import.
- Turn accepted / rejected memo sections into learning signals.
