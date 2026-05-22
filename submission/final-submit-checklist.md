# Final Submit Checklist — Investor Diligence War Room

## Raylu Requirements

- Demo video, 2-3 minutes: done
- 250-500 word project description: done
- Live link: done
- Runnable GitHub repo: done
- Team info: DD / solo builder

## Public Links

- Live app: https://daideguchi.github.io/investor-diligence-war-room/
- GitHub repo: https://github.com/daideguchi/investor-diligence-war-room
- Demo video asset: `media/investor-diligence-war-room-demo-narrated.mp4`
- Thumbnail: `media/investor-diligence-war-room-demo-thumb.png`

## Verification

```text
npm run verify
investor_diligence_verify_ok
investor_diligence_claim_boundary_ok
investor_diligence_demo_assets_ok
investor_diligence_no_secrets_ok
```

Demo asset:

```text
duration: 124.77s
size: 5,988,416 bytes
streams: audio, subtitle, video
mean_volume: -19.1 dB
max_volume: -4.1 dB
```

Gemini proof:

```text
model: gemini-2.5-flash
route: vertex_ai_generate_content
diligence_memo_live_proof: true
contains_secret: false
```

## Claim Boundary

Do not claim:

- investment advice
- final investment decision
- verified revenue
- verified customers
- live web extraction
- real investor/customer validation

## Submit Copy

Use `submission/devpost-draft.md` and `SUBMISSION_PACKAGE.md`.

