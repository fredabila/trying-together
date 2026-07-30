/**
 * One-off seed for the Trying Together dataset.
 *
 * Creates the two singletons (About page, Site settings), the four series from
 * the brief, and uploads the Mike & Ros portrait. Safe to re-run: it patches
 * rather than duplicating, and never overwrites text the client has since
 * edited unless you pass --force.
 *
 *   node scripts/seed-sanity.mjs [--force]
 */

import { createClient } from '@sanity/client';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';

const PROJECT_ID = process.env.NEXT_PUBLIC_SANITY_PROJECT_ID || 'tbv4159o';
const DATASET = process.env.NEXT_PUBLIC_SANITY_DATASET || 'production';
const FORCE = process.argv.includes('--force');
const PORTRAIT = path.join(process.cwd(), 'public', 'images', 'mike-and-ros.jpg');

function readToken() {
  if (process.env.SANITY_API_WRITE_TOKEN) return process.env.SANITY_API_WRITE_TOKEN;
  try {
    const configPath = path.join(os.homedir(), '.config', 'sanity', 'config.json');
    return JSON.parse(fs.readFileSync(configPath, 'utf8')).authToken;
  } catch {
    return undefined;
  }
}

const token = readToken();
if (!token) {
  console.error('No Sanity token found. Run `npx sanity login`, or set SANITY_API_WRITE_TOKEN.');
  process.exit(1);
}

const client = createClient({
  projectId: PROJECT_ID,
  dataset: DATASET,
  apiVersion: '2026-07-22',
  token,
  useCdn: false,
});

const SERIES = [
  {
    _id: 'series-trying-in-marriage',
    title: 'Trying In Marriage',
    slug: 'trying-in-marriage',
    description: 'What the journey does to a marriage, and how you hold it together.',
    order: 1,
  },
  {
    _id: 'series-the-financial-reality',
    title: 'The Financial Reality',
    slug: 'the-financial-reality',
    description: 'The cost of treatment, honestly discussed.',
    order: 2,
  },
  {
    _id: 'series-trying-to-communicate',
    title: 'Trying To Communicate',
    slug: 'trying-to-communicate',
    description: 'The conversations that are hardest to start.',
    order: 3,
  },
  {
    _id: 'series-sticking-together',
    title: 'Sticking Together',
    slug: 'sticking-together',
    description: 'Faith, endurance, and finding joy in the waiting.',
    order: 4,
  },
];

const ABOUT_PARAGRAPHS = [
  'We’re Mike and Ros, and Trying Together is our story — told out loud, together, for everyone who’s living something similar in silence.',
  'Like so many couples, we found ourselves on a fertility journey we never expected to be on this long. The waiting. The appointments. The conversations we didn’t know how to have with each other, with our families, with our faith. We searched for a show that spoke to both of us — husband and wife, man and woman — and we couldn’t find one. So we made it.',
  'Trying Together follows our journey in real time — the marriage, the financial reality of treatment, learning to communicate when we were both exhausted, and the faith that has kept us standing. We believe faith is a thread through this conversation, not a barrier to it — this show is for you whether you’re deep in faith, just exploring it, or not religious at all.',
  'If you’re trying — in any sense of the word — we made this for you. Welcome. There’s no shame here.',
];

function blocks(prefix, lines) {
  return lines.map((text, index) => ({
    _type: 'block',
    _key: `${prefix}${index}`,
    style: 'normal',
    markDefs: [],
    children: [{ _type: 'span', _key: `${prefix}${index}s`, text, marks: [] }],
  }));
}

async function uploadPortrait() {
  if (!fs.existsSync(PORTRAIT)) {
    console.warn(`! Portrait not found at ${PORTRAIT} — skipping image upload.`);
    return undefined;
  }

  // Reuse the asset if this exact file was already uploaded.
  const existing = await client.fetch(
    '*[_type == "sanity.imageAsset" && originalFilename == $name][0]._id',
    { name: 'mike-and-ros.jpg' },
  );
  if (existing && !FORCE) {
    console.log('· Portrait already uploaded, reusing it.');
    return existing;
  }

  const asset = await client.assets.upload('image', fs.createReadStream(PORTRAIT), {
    filename: 'mike-and-ros.jpg',
    title: 'Mike and Ros',
  });
  console.log('✓ Uploaded portrait');
  return asset._id;
}

async function seedSeries() {
  const tx = client.transaction();
  for (const item of SERIES) {
    tx.createOrReplace({
      _id: item._id,
      _type: 'series',
      title: item.title,
      slug: { _type: 'slug', current: item.slug },
      description: item.description,
      order: item.order,
    });
  }
  await tx.commit();
  console.log(`✓ ${SERIES.length} series ready`);
}

async function seedAbout(assetId) {
  const existing = await client.fetch('*[_id == "aboutPage"][0]{ _id, sections }');

  const portrait = assetId
    ? {
        _type: 'image',
        asset: { _type: 'reference', _ref: assetId },
        alt: 'Mike and Ros, hosts of Trying Together',
      }
    : undefined;

  if (existing && !FORCE) {
    // Don't touch copy the client may have edited — only fill what's missing.
    const patch = client.patch('aboutPage').setIfMissing({
      heading: 'Our Story',
      missionStatement:
        'Trying Together is a fertility podcast for anyone on the journey — single or partnered, male or female, faith-rooted or just beginning to find it. Both voices. No shame. One conversation that should have started years ago.',
      sections: [
        { _type: 'textSection', _key: 'story', body: blocks('a', ABOUT_PARAGRAPHS) },
      ],
    });
    if (portrait) patch.setIfMissing({ portrait });
    await patch.commit();
    console.log('✓ About page kept (filled any empty fields)');
    return;
  }

  await client.createOrReplace({
    _id: 'aboutPage',
    _type: 'aboutPage',
    heading: 'Our Story',
    missionStatement:
      'Trying Together is a fertility podcast for anyone on the journey — single or partnered, male or female, faith-rooted or just beginning to find it. Both voices. No shame. One conversation that should have started years ago.',
    ...(portrait ? { portrait } : {}),
    sections: [{ _type: 'textSection', _key: 'story', body: blocks('a', ABOUT_PARAGRAPHS) }],
  });
  console.log('✓ About page created');
}

async function seedSettings() {
  const existing = await client.fetch('*[_id == "siteSettings"][0]._id');
  const defaults = {
    _id: 'siteSettings',
    _type: 'siteSettings',
    showName: 'Trying Together',
    tagline: 'Both voices. No shame.',
    shortDescription:
      'A fertility podcast for anyone on the journey — single or partnered, male or female, faith-rooted or just beginning to find it. Both voices. No shame. One conversation that should have started years ago.',
    heroHeading: 'One conversation that should have started years ago.',
    heroSubheading:
      'Trying Together is a fertility podcast for anyone on the journey — single or partnered, male or female, faith-rooted or just beginning to find it. Both voices. No shame.',
    newsletterHeading: 'Join the Community',
    newsletterBody:
      'Get notified when new episodes drop and receive resources from our guests. We are building this outside the algorithm.',
    contactHeading: 'Get in Touch',
    contactIntro:
      'Want to share your story or apply as a guest? Send us a message and we will get back to you.',
  };

  if (existing && !FORCE) {
    const { _id, _type, ...fields } = defaults;
    await client.patch('siteSettings').setIfMissing(fields).commit();
    console.log('✓ Site settings kept (filled any empty fields)');
    return;
  }

  await client.createOrReplace(defaults);
  console.log('✓ Site settings created');
}

/** The old schema stored series as a plain string; move those onto references. */
async function migrateLegacyEpisodes() {
  const legacy = await client.fetch(
    '*[_type == "episode" && defined(series) && !defined(series._ref)]{ _id, series, embedUrl, audio }',
  );
  if (!legacy.length) return;

  const byTitle = new Map(SERIES.map((s) => [s.title, s._id]));
  const tx = client.transaction();

  for (const doc of legacy) {
    const patch = {};
    const ref = typeof doc.series === 'string' ? byTitle.get(doc.series) : undefined;
    if (ref) patch.series = { _type: 'reference', _ref: ref };

    // Old embedUrl held raw iframe HTML; keep it as a platform link if we can
    // pull a URL out of it, otherwise leave the field for a human to sort out.
    if (!doc.audio && typeof doc.embedUrl === 'string') {
      const src = doc.embedUrl.match(/src=["']([^"']+)["']/i)?.[1];
      const bare = /^https?:\/\//i.test(doc.embedUrl.trim()) ? doc.embedUrl.trim() : undefined;
      const url = src || bare;
      if (url) patch.audio = { _type: 'audioSource', mode: 'platform', url };
    }

    if (Object.keys(patch).length) tx.patch(doc._id, { set: patch });
  }

  await tx.commit();
  console.log(`✓ Migrated ${legacy.length} episode(s) from the old schema`);
}

async function main() {
  console.log(`Seeding ${PROJECT_ID}/${DATASET}${FORCE ? ' (force)' : ''}\n`);
  const assetId = await uploadPortrait();
  await seedSeries();
  await seedAbout(assetId);
  await seedSettings();
  await migrateLegacyEpisodes();
  console.log('\nDone. Open /studio to review.');
}

main().catch((error) => {
  console.error('\nSeed failed:', error.message);
  process.exit(1);
});
