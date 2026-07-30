import { createClient } from '@sanity/client';
import { NextRequest, NextResponse } from 'next/server';

/**
 * POST /api/subscribe
 *
 * Accepts { email, source? } and creates a subscriber document in Sanity.
 * Uses a server-only write token — never exposed to the browser.
 *
 * Duplicate emails are handled with Sanity's deterministic document IDs:
 * the same email always maps to the same document ID, so a second sign-up
 * is a no-op (createIfNotExists) rather than a duplicate insert.
 */

function slugifyEmail(email: string): string {
  return email.toLowerCase().replace(/[^a-z0-9]/g, '-');
}

export async function POST(req: NextRequest) {
  // ── parse body ──────────────────────────────────────────────────────────────
  let email: string;
  let source: string | undefined;

  try {
    const body = await req.json();
    email = (body.email ?? '').trim().toLowerCase();
    source = body.source ?? 'website';
  } catch {
    return NextResponse.json({ error: 'Invalid request body.' }, { status: 400 });
  }

  // ── validate ─────────────────────────────────────────────────────────────────
  if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    return NextResponse.json({ error: 'Please enter a valid email address.' }, { status: 422 });
  }

  // ── write to Sanity ──────────────────────────────────────────────────────────
  const writeToken = process.env.SANITY_API_WRITE_TOKEN;
  if (!writeToken) {
    console.error('SANITY_API_WRITE_TOKEN is not set.');
    return NextResponse.json({ error: 'Server configuration error.' }, { status: 500 });
  }

  const client = createClient({
    projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID ?? '',
    dataset: process.env.NEXT_PUBLIC_SANITY_DATASET ?? 'production',
    apiVersion: process.env.NEXT_PUBLIC_SANITY_API_VERSION ?? '2026-07-22',
    token: writeToken,
    useCdn: false,
  });

  // Deterministic document ID — same email always maps to same doc,
  // so re-submitting is safely idempotent.
  const docId = `subscriber-${slugifyEmail(email)}`;

  try {
    await client.createIfNotExists({
      _type: 'subscriber',
      _id: docId,
      email,
      subscribedAt: new Date().toISOString(),
      source: source ?? 'website',
      status: 'active',
    });

    return NextResponse.json({ ok: true }, { status: 200 });
  } catch (err) {
    console.error('Sanity write error:', err);
    return NextResponse.json({ error: 'Could not save your subscription. Try again.' }, { status: 500 });
  }
}
