import type { AboutPage, SeriesSummary, SiteSettings } from '@/sanity/lib/types';

/**
 * The approved copy from the brief, used until the client replaces it in the
 * Studio. Anything they enter there wins; this only fills the gaps so the site
 * never renders empty.
 */

export const DEFAULT_SETTINGS: SiteSettings = {
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
  listenLinks: [],
  socialLinks: [],
};

export const DEFAULT_SERIES: SeriesSummary[] = [
  {
    _id: 'default-trying-in-marriage',
    title: 'Trying In Marriage',
    slug: 'trying-in-marriage',
    description: 'What the journey does to a marriage, and how you hold it together.',
    episodeCount: 0,
  },
  {
    _id: 'default-financial-reality',
    title: 'The Financial Reality',
    slug: 'the-financial-reality',
    description: 'The cost of treatment, honestly discussed.',
    episodeCount: 0,
  },
  {
    _id: 'default-trying-to-communicate',
    title: 'Trying To Communicate',
    slug: 'trying-to-communicate',
    description: 'The conversations that are hardest to start.',
    episodeCount: 0,
  },
  {
    _id: 'default-sticking-together',
    title: 'Sticking Together',
    slug: 'sticking-together',
    description: 'Faith, endurance, and finding joy in the waiting.',
    episodeCount: 0,
  },
];

/** Turns plain paragraphs into the Portable Text shape the renderer expects. */
function paragraphs(key: string, lines: string[]) {
  return lines.map((text, index) => ({
    _type: 'block' as const,
    _key: `${key}-${index}`,
    style: 'normal' as const,
    markDefs: [],
    children: [{ _type: 'span' as const, _key: `${key}-${index}-0`, text, marks: [] }],
  }));
}

export const DEFAULT_ABOUT: AboutPage = {
  heading: 'Our Story',
  missionStatement:
    'Trying Together is a fertility podcast for anyone on the journey — single or partnered, male or female, faith-rooted or just beginning to find it. Both voices. No shame. One conversation that should have started years ago.',
  sections: [
    {
      _key: 'default-story',
      _type: 'textSection',
      body: paragraphs('story', [
        'We’re Mike and Ros, and Trying Together is our story — told out loud, together, for everyone who’s living something similar in silence.',
        'Like so many couples, we found ourselves on a fertility journey we never expected to be on this long. The waiting. The appointments. The conversations we didn’t know how to have with each other, with our families, with our faith. We searched for a show that spoke to both of us — husband and wife, man and woman — and we couldn’t find one. So we made it.',
        'Trying Together follows our journey in real time — the marriage, the financial reality of treatment, learning to communicate when we were both exhausted, and the faith that has kept us standing. We believe faith is a thread through this conversation, not a barrier to it — this show is for you whether you’re deep in faith, just exploring it, or not religious at all.',
        'If you’re trying — in any sense of the word — we made this for you. Welcome. There’s no shame here.',
      ]),
    },
  ],
};
