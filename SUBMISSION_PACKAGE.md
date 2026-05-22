# Submission Package — Investor Diligence War Room

## Project Name

Investor Diligence War Room

## Tagline

Evidence-aware investment memos from messy startup notes.

## Short Pitch

Investor Diligence War Room helps investors turn scattered startup notes into an evidence-aware memo. It separates evidence, assumptions, red flags, and next diligence questions so AI speeds up the work without hiding uncertainty.

## Inspiration

AI can write a polished investment memo in seconds. That is useful, but also risky. A memo can sound confident even when it is built on weak notes.

I wanted to build the missing layer: a diligence room that makes the difference between evidence and assumption visible.

## What It Does

The app takes a company name, website, stage, market, and raw notes. It produces:

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
