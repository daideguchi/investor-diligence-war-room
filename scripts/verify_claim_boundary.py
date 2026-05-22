from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]

checks = {
    "README.md": [
        "It is not investment advice.",
        "It does not claim verified revenue or customer validation.",
        "It does not claim live web extraction yet.",
        "It does not replace investor judgment.",
    ],
    "SUBMISSION_PACKAGE.md": [
        "investment advice",
        "verified revenue",
        "verified customers",
        "live web extraction",
        "final investment decisions",
    ],
    "index.html": [
        "working hypothesis",
        "It does not claim verified revenue",
        "Claim boundary",
    ],
}

for rel, markers in checks.items():
    text = (ROOT / rel).read_text()
    missing = [marker for marker in markers if marker not in text]
    if missing:
        raise SystemExit(f"{rel} missing markers: {missing}")

print("investor_diligence_claim_boundary_ok")

