import { createSign } from 'node:crypto';
import { mkdir, readFile, writeFile } from 'node:fs/promises';
import path from 'node:path';

const keyPath = process.env.GOOGLE_VERTEX_SERVICE_ACCOUNT_JSON;
const project = process.env.GOOGLE_VERTEX_PROJECT || 'pj260519';
const location = process.env.GOOGLE_VERTEX_LOCATION || 'us-central1';
const model = process.env.GOOGLE_VERTEX_MODEL || 'gemini-2.5-flash';
const proofPath = process.env.GEMINI_PROOF_PATH || 'media/gemini-live-diligence-proof.json';

function base64url(input) {
  return Buffer.from(input)
    .toString('base64')
    .replaceAll('+', '-')
    .replaceAll('/', '_')
    .replaceAll('=', '');
}

function signJwt(serviceAccount) {
  const now = Math.floor(Date.now() / 1000);
  const header = { alg: 'RS256', typ: 'JWT' };
  const claim = {
    iss: serviceAccount.client_email,
    sub: serviceAccount.client_email,
    aud: 'https://oauth2.googleapis.com/token',
    scope: 'https://www.googleapis.com/auth/cloud-platform',
    iat: now,
    exp: now + 3600,
  };
  const unsigned = `${base64url(JSON.stringify(header))}.${base64url(JSON.stringify(claim))}`;
  const signer = createSign('RSA-SHA256');
  signer.update(unsigned);
  signer.end();
  return `${unsigned}.${signer.sign(serviceAccount.private_key, 'base64url')}`;
}

async function getAccessToken(serviceAccount) {
  const body = new URLSearchParams({
    grant_type: 'urn:ietf:params:oauth:grant-type:jwt-bearer',
    assertion: signJwt(serviceAccount),
  });
  const res = await fetch('https://oauth2.googleapis.com/token', {
    method: 'POST',
    headers: { 'content-type': 'application/x-www-form-urlencoded' },
    body,
  });
  const data = await res.json().catch(() => ({}));
  if (!res.ok || !data.access_token) {
    throw new Error(`OAuth token exchange failed: HTTP ${res.status} ${data.error || ''}`.trim());
  }
  return data.access_token;
}

function sanitizeExcerpt(text) {
  return String(text || '').replace(/\s+/g, ' ').trim().slice(0, 700);
}

async function callGemini({ token, url, prompt, purpose, maxOutputTokens = 260 }) {
  const res = await fetch(url, {
    method: 'POST',
    headers: {
      authorization: `Bearer ${token}`,
      'content-type': 'application/json',
    },
    body: JSON.stringify({
      contents: [{ role: 'user', parts: [{ text: prompt }] }],
      generationConfig: {
        temperature: 0.2,
        maxOutputTokens,
      },
    }),
  });
  const data = await res.json().catch(() => ({}));
  const text = data?.candidates?.[0]?.content?.parts?.map((part) => part.text || '').join('\n').trim() || '';
  if (!res.ok || !text) {
    throw new Error(`Vertex Gemini ${purpose} call failed: HTTP ${res.status} ${data?.error?.status || ''} ${data?.error?.message || ''}`.trim());
  }
  return {
    prompt_purpose: purpose,
    http_status: res.status,
    traffic_type: data?.usageMetadata?.trafficType || null,
    prompt_token_count: data?.usageMetadata?.promptTokenCount || null,
    candidates_token_count: data?.usageMetadata?.candidatesTokenCount || null,
    total_token_count: data?.usageMetadata?.totalTokenCount || null,
    sample_excerpt: sanitizeExcerpt(text),
  };
}

async function main() {
  if (!keyPath) {
    throw new Error('Set GOOGLE_VERTEX_SERVICE_ACCOUNT_JSON to a local service account JSON path.');
  }
  const serviceAccount = JSON.parse(await readFile(keyPath, 'utf8'));
  if (serviceAccount.project_id !== project) {
    throw new Error(`Service account project mismatch: expected ${project}, got ${serviceAccount.project_id}`);
  }

  const diligencePrompt = `You are helping a VC analyst draft a first-pass diligence memo.

Company: ExampleCo
Market: AI workflow governance
Raw notes: Team sells an AI operations console for companies that need evidence-aware workflows, human approval gates, and audit-ready launch decisions. Early users are small AI teams and solo founders. Main risk is whether teams pay before compliance pressure becomes urgent.

Return exactly six short bullets:
1. investment thesis
2. evidence receipts
3. assumptions to verify
4. red flags
5. next investor questions
6. claim boundary

Rules:
- Do not give investment advice.
- Do not claim verified revenue or customers.
- Separate evidence from assumptions.
- Keep human investor approval required.`;

  const token = await getAccessToken(serviceAccount);
  const url = `https://${location}-aiplatform.googleapis.com/v1/projects/${project}/locations/${location}/publishers/google/models/${model}:generateContent`;
  const checks = [
    await callGemini({ token, url, prompt: diligencePrompt, purpose: 'investor diligence memo draft' }),
  ];
  const totalTokenCount = checks.reduce((sum, check) => sum + Number(check.total_token_count || 0), 0);

  const proof = {
    provider: 'google_gemini',
    route: 'vertex_ai_generate_content',
    model,
    project,
    location,
    ran_at_utc: new Date().toISOString(),
    prompt_purpose: 'investor diligence memo draft',
    contains_secret: false,
    http_status: 200,
    live_call_count: checks.length,
    diligence_memo_live_proof: true,
    total_token_count: totalTokenCount || null,
    sample_excerpt: checks.map((check) => `${check.prompt_purpose}: ${check.sample_excerpt}`).join(' | '),
    checks,
    claim_boundary: 'This proves one live Gemini call for investor memo drafting only. It does not prove investment advice, verified revenue, verified customers, customer adoption, or live web extraction.',
  };

  await mkdir(path.dirname(proofPath), { recursive: true });
  await writeFile(proofPath, `${JSON.stringify(proof, null, 2)}\n`, 'utf8');
  console.log('vertex_gemini_smoke_ok');
  console.log(`proof=${proofPath}`);
  console.log(`model=${model}`);
  console.log(`total_token_count=${proof.total_token_count}`);
  console.log('diligence_memo_live_proof=true');
}

main().catch((error) => {
  console.error('vertex_gemini_smoke_failed');
  console.error(error instanceof Error ? error.message : String(error));
  process.exitCode = 1;
});

