/**
 * Guide content.
 *
 * Plain data rather than JSX so the guide's search box can flatten every block
 * to text. Field names and option labels are copied verbatim from the schema
 * files — if a field is renamed there, rename it here too or the guide starts
 * describing a Studio that no longer exists.
 *
 * Inline formatting: **bold** for anything visible on screen in the Studio,
 * `code` for exact values.
 */

export type GuideBlock =
  | { h: string }
  | { p: string }
  | { steps: string[] }
  | { fields: [string, string][] }
  | { faq: [string, string][] }
  | { callout: { tone: 'primary' | 'positive' | 'caution' | 'critical'; title: string; body: string } };

export type GuideSection = {
  id: string;
  emoji: string;
  title: string;
  blurb?: string;
  blocks: GuideBlock[];
};

export const GUIDE_SECTIONS: GuideSection[] = [
  {
    id: 'start',
    emoji: '👋',
    title: 'Start here',
    blurb: 'How the Studio is laid out, and the two rules worth knowing before you touch anything.',
    blocks: [
      {
        callout: {
          tone: 'primary',
          title: 'The one thing to remember',
          body: 'Your work saves itself as a **draft** as you type. Nothing you type is ever lost. But nothing reaches the public website until you press the **Publish** button at the bottom of the screen.',
        },
      },
      { h: 'What is in the sidebar' },
      {
        fields: [
          ['🎧 Episodes', 'Every episode. Opens into four views — **All episodes**, **By series**, **Pinned on homepage**, and **Scheduled for later**.'],
          ['📝 About page', 'The Our Story page. There is only one, so it opens straight into the editor.'],
          ['🏷 Series', 'The four strands the show is organised into. You will rarely change these.'],
          ['⚙️ Site settings', 'Everything global — show name, artwork, listen links, homepage wording, contact details.'],
          ['📬 Subscribers', 'Everyone who has signed up to the mailing list from the website.'],
        ],
      },
      { h: 'The two documents you cannot delete' },
      {
        p: '**About page** and **Site settings** are one-of-a-kind, so the Studio deliberately hides the delete and duplicate buttons for them. You can edit them freely — you just cannot accidentally destroy them.',
      },
      { h: 'Publishing, in one paragraph' },
      {
        p: 'Edit anything and a **Publish** button appears at the bottom. Grey means everything is live. Green means you have unpublished changes waiting. The live website picks up published changes within about a minute — you do not need to redeploy anything.',
      },
    ],
  },

  {
    id: 'new-episode',
    emoji: '🎧',
    title: 'Publish an episode',
    blurb: 'The full walkthrough, start to finish. This is the thing you will do most.',
    blocks: [
      {
        steps: [
          'In the sidebar click **Episodes → All episodes**, then the **+** button at the top of the list.',
          'Type the **Episode title**.',
          'Click **Generate** next to **Web address**. This builds the page address from the title. If you skip it the episode cannot go live.',
          'Pick a **Series**. This is required — an episode with no series will not appear on the website.',
          'Set the **Publish date**. Leave it as now to go live immediately, or set a future date and time to schedule it (see *Scheduling* below).',
          'Write the **Short description** — one or two sentences. It appears on episode cards and when the episode is shared on social media.',
          'Optionally upload **Episode artwork**. Leave it empty and the show artwork is used instead.',
          'Open the **Audio** tab and set up the player — see *Audio, players & links* for the detail.',
          'Optionally open **Show notes & guests** to add links, guests and a transcript.',
          'Press **Publish**.',
        ],
      },
      { h: 'Every field on the Episode tab' },
      {
        fields: [
          ['Episode title', 'Required.'],
          ['Web address', 'Required. Press **Generate** to fill it from the title. Lowercase letters, numbers and dashes only.'],
          ['Episode number', 'Optional. Shows as “Ep 12” on the cards.'],
          ['Series', 'Required. Which of the four strands this belongs to.'],
          ['Publish date', 'Required. Episodes are ordered newest first by this date. A future date keeps it hidden until then.'],
          ['Short description', 'Aim for under 300 characters. Longer descriptions get a gentle warning but still save.'],
          ['Episode artwork', 'Optional square image. Falls back to the show artwork.'],
          ['Pin to the top of the homepage', 'Off by default. See *The homepage* section.'],
        ],
      },
      {
        callout: {
          tone: 'caution',
          title: 'If a published episode is not showing on the website',
          body: 'Check these four things, in order: it has been **published** (not just saved as a draft), the **Publish date** is not in the future, the **Web address** is filled in, and a **Series** is selected. Missing any one of these hides it.',
        },
      },
    ],
  },

  {
    id: 'audio',
    emoji: '🔊',
    title: 'Audio, players & links',
    blurb: 'The Audio tab has three separate parts. This is the bit most people get stuck on.',
    blocks: [
      {
        p: 'They stack from top to bottom on the episode page: the **main player** first, then any **extra players**, then the **also available on** buttons. You only have to fill in the first one.',
      },

      { h: '1. Main player — required' },
      { p: 'Pick one of two options under **Main player**:' },
      {
        fields: [
          ['Upload the audio file (our own player)', 'You upload an MP3 or M4A and the site plays it in our own branded player. Best option — listeners stay on your site. Also reveals **Length in seconds**, used to show the running time on cards.'],
          ['Paste a link from another platform', 'Paste the ordinary share link — the same one you would text a friend. We work out the platform and build the player for you. You never need to touch embed code.'],
        ],
      },
      {
        p: 'Links we turn into a real inline player: **Spotify**, **Apple Podcasts**, **YouTube**, **SoundCloud** and **Deezer**. Amazon Music has no public player, so it becomes a tidy button instead. Anything we do not recognise also becomes a button — nothing breaks.',
      },

      { h: '2. Extra players — optional, add as many as you like' },
      {
        p: 'Use **Extra players** when one episode exists in more than one place — the audio on Spotify and the video on YouTube, for example. Press **Add item** for each one. Each has:',
      },
      {
        fields: [
          ['How are you adding this?', '**Paste a share link (easiest)** or **Paste embed code from the platform**.'],
          ['Share link', 'Shown when you chose the share link option. Same as the main player — just paste the normal link.'],
          ['Embed code', 'Shown when you chose embed code. Paste the whole `<iframe …>` block the platform gave you. We keep only the player address and throw the rest away.'],
          ['Which platform is this?', 'Only asked for embed code, and only used for the label.'],
          ['Heading above this player', 'Optional. Useful with more than one player, e.g. “Watch the video”.'],
          ['Player height in pixels', 'Optional. Leave empty and we choose a sensible height. Video always sizes itself.'],
        ],
      },
      {
        callout: {
          tone: 'caution',
          title: 'If embed code is rejected',
          body: 'For safety we only allow embeds from podcast and music platforms we recognise. If you get a message naming the site, that host is not on the list — add it under **Also available on** instead and it becomes a button. Nothing is lost.',
        },
      },

      { h: '3. Also available on — optional' },
      {
        p: 'Buttons linking out to every other place the episode lives. Most platforms cannot be embedded at all, so a button is the right answer for them. Choose the **Platform**, paste the **Link**, done. Around twenty platforms are in the list; if yours is missing pick **Somewhere else** and type the name yourself.',
      },
      {
        p: 'The Studio will warn you if you add the same platform twice. **Somewhere else** is exempt, since each one is a different site.',
      },
      {
        callout: {
          tone: 'primary',
          title: 'A note on the homepage',
          body: 'The homepage shows only the **main player** to keep the page tight. Extra players and the “also available on” buttons appear on the episode’s own page.',
        },
      },
    ],
  },

  {
    id: 'scheduling',
    emoji: '🕓',
    title: 'Scheduling & the homepage',
    blurb: 'Line episodes up in advance, and choose which one leads the site.',
    blocks: [
      { h: 'Scheduling an episode' },
      {
        p: 'Set **Publish date** to a date and time in the future, then press **Publish**. The episode is genuinely live in the Studio but stays completely hidden from the website until that moment arrives — then it appears on its own, with no action from you.',
      },
      {
        p: 'Everything waiting to go out is listed under **Episodes → Scheduled for later**, soonest first.',
      },
      {
        callout: {
          tone: 'caution',
          title: 'Scheduled still means published',
          body: 'You must press **Publish** for a scheduled episode to appear when its date arrives. A draft with a future date will simply never show up.',
        },
      },
      { h: 'Which episode leads the homepage' },
      {
        p: 'By default the homepage features the **newest published episode**. To override that, open any episode and turn on **Pin to the top of the homepage**.',
      },
      {
        p: 'Everything currently pinned is listed under **Episodes → Pinned on homepage**. If you pin more than one, the newest of the pinned ones wins — so to swap the featured episode, turn the old one off.',
      },
    ],
  },

  {
    id: 'notes-guests',
    emoji: '📝',
    title: 'Show notes & guests',
    blocks: [
      {
        fields: [
          ['Show notes', 'Rich text — links, timestamps, anything mentioned in the episode. Use the toolbar for bold, headings and links.'],
          ['Guests', 'Press **Add item** for each guest. Each has **Name** (required), **Who they are**, **Short bio**, **Photo** and **Their website or social link**. Leave the whole thing empty when it is just the two of you.'],
          ['Transcript', 'Optional, and can be added later. Appears on the episode page in a panel readers can expand.'],
        ],
      },
      {
        callout: {
          tone: 'primary',
          title: 'Transcripts are worth the effort',
          body: 'They make episodes findable on Google and usable by people who are deaf or hard of hearing. You can publish an episode first and add its transcript days later.',
        },
      },
    ],
  },

  {
    id: 'about',
    emoji: '📖',
    title: 'The About page',
    blurb: 'Built from stackable sections, so you can restructure it without anyone rebuilding the site.',
    blocks: [
      { h: 'Top of the page' },
      {
        fields: [
          ['Page heading', 'The large heading at the top.'],
          ['Mission statement', 'The short standfirst under it.'],
          ['Photo of Mike & Ros', 'Your portrait. **Describe the photo** is read aloud by screen readers — a plain sentence is perfect.'],
        ],
      },
      { h: 'Page sections' },
      {
        p: 'Press **Add item** and pick a block type. Drag the handle on the left of any block to reorder. Delete with the three-dot menu.',
      },
      {
        fields: [
          ['Text section', 'An optional **Section heading** plus rich body text.'],
          ['Pull quote', 'A large highlighted **Quote** with an optional **Who said it**.'],
          ['Image', 'A picture with an optional **Caption**.'],
          ['List of points', 'A heading plus a set of short titled points. Good for values or “what to expect”.'],
          ['Call to action', 'A heading, a line of text, and a button — **Button label** and **Button link**.'],
        ],
      },
      { h: 'Sharing' },
      {
        p: 'The **Sharing** tab sets the title and description search engines and social apps show for this page. Leave them empty and sensible defaults from the page itself are used.',
      },
    ],
  },

  {
    id: 'settings',
    emoji: '⚙️',
    title: 'Site settings',
    blurb: 'Global things. Grouped into five tabs across the top of the editor.',
    blocks: [
      { h: 'The show' },
      {
        fields: [
          ['Show name', 'Required.'],
          ['Tagline', 'One short line. Used in the footer and when the site is shared.'],
          ['Short show description', 'A couple of sentences. Used in the footer and as the description search engines display.'],
          ['Show artwork', 'The square podcast cover. Used as the fallback for episodes without their own artwork, and as the image shown when links are shared.'],
        ],
      },
      { h: 'Listen on' },
      {
        fields: [
          ['Listen on', 'Where the whole show lives. These become the row of buttons on the homepage. Same platform list as episodes, including **Somewhere else**.'],
          ['Show players', 'Optional follow players for the whole show — the Spotify show embed, a YouTube trailer. Works exactly like **Extra players** on an episode.'],
        ],
      },
      { h: 'Social links' },
      {
        p: 'Instagram, TikTok, Facebook, LinkedIn, YouTube and X. Each takes a **Handle** (shown as the link text) and a **Link**. These appear in the footer and on the contact page.',
      },
      { h: 'Homepage text' },
      {
        fields: [
          ['Homepage headline', 'The large heading at the top of the homepage.'],
          ['Homepage intro text', 'The paragraph underneath it.'],
          ['Email signup heading', 'Heading on the green signup band.'],
          ['Email signup text', 'The line of text under that heading.'],
        ],
      },
      { h: 'Contact page' },
      {
        fields: [
          ['Contact page heading', 'Heading at the top of the contact page.'],
          ['Contact page intro text', 'The paragraph under it.'],
          ['Contact email address', 'Where messages from the contact form are sent.'],
        ],
      },
      {
        callout: {
          tone: 'primary',
          title: 'Leaving a field empty is safe',
          body: 'Every one of these has a sensible default written into the site. Clearing a field falls back to that default rather than leaving a blank space.',
        },
      },
    ],
  },

  {
    id: 'series',
    emoji: '🏷',
    title: 'Series',
    blocks: [
      {
        p: 'The four strands episodes are filed under: **Trying In Marriage**, **The Financial Reality**, **Trying To Communicate** and **Sticking Together**. Each has a title, a web address, a description and an order number that controls where it sits in lists.',
      },
      {
        p: 'The homepage shows all four under “What we talk about”, with a live episode count. A series with no episodes yet shows **Coming soon** rather than looking broken — so it is fine to have them all in place from day one.',
      },
      {
        callout: {
          tone: 'caution',
          title: 'Renaming versus re-addressing',
          body: 'Changing a series **title** is safe at any time. Changing its **web address** breaks any link anyone has already shared to that filtered view. Rename freely; re-address rarely.',
        },
      },
    ],
  },

  {
    id: 'subscribers',
    emoji: '📬',
    title: 'Subscribers',
    blurb: 'Everyone who signed up through the website.',
    blocks: [
      {
        p: 'Sign-ups from the site land here automatically. Each record holds the **Email**, **Subscribed at**, **Source** (which page they signed up from) and a **Status** of either **Active** or **Unsubscribed**.',
      },
      {
        p: 'If somebody asks to be removed, open their record and set **Status** to **Unsubscribed** rather than deleting it — that way a future re-import will not silently add them back.',
      },
      { h: 'Exporting the list' },
      {
        steps: [
          'Go to **sanity.io/manage** and open the Trying Together project.',
          'Open the **Datasets** tab.',
          'Choose **Export** on the `production` dataset.',
          'Open the downloaded file and pull out the subscriber records for Mailchimp, ConvertKit or whatever you use.',
        ],
      },
      {
        callout: {
          tone: 'positive',
          title: 'These addresses are private',
          body: 'The website can only ever write to this list, never read it. Nobody visiting the site can retrieve the addresses — they are visible only to signed-in Studio members.',
        },
      },
    ],
  },

  {
    id: 'access',
    emoji: '🔑',
    title: 'Who can get in',
    blocks: [
      {
        p: 'The Studio address is reachable by anyone, but it shows a login wall. Only people invited to the Sanity project can read or change anything.',
      },
      { h: 'Adding someone' },
      {
        steps: [
          'Go to **sanity.io/manage** and open the Trying Together project.',
          'Open the **Members** tab.',
          'Press **Invite members** and enter their email address.',
          'Choose a role — **Editor** lets them manage content, **Administrator** also lets them change project settings and invite others.',
        ],
      },
      {
        callout: {
          tone: 'caution',
          title: 'Give out Editor, not Administrator',
          body: 'Editor covers everything in this guide. Reserve Administrator for the one or two people who should be able to change billing, invite others, or delete the dataset.',
        },
      },
    ],
  },

  {
    id: 'help',
    emoji: '🆘',
    title: 'When something looks wrong',
    blurb: 'The handful of things that actually come up.',
    blocks: [
      {
        faq: [
          [
            'I published an episode and it is not on the website.',
            'Four usual causes: it is still a **draft**, its **Publish date** is in the future, its **Web address** is empty, or it has no **Series**. Check them in that order.',
          ],
          [
            'I changed something and the site still shows the old version.',
            'Press **Publish** — saving alone is not enough. After publishing, give it about a minute; the site refreshes its cache on a timer rather than instantly.',
          ],
          [
            'The wrong episode is featured on the homepage.',
            'Something is pinned. Look under **Episodes → Pinned on homepage** and turn off **Pin to the top of the homepage** on anything that should not be there.',
          ],
          [
            'My embed code was rejected.',
            'That platform is not on our allowed list. Add the episode under **Also available on** instead — it becomes a button rather than a player.',
          ],
          [
            'The player says “This episode is coming soon”.',
            'The **Audio** tab has no usable source — either no file uploaded, or the pasted link is empty or malformed.',
          ],
          [
            'I deleted something by mistake.',
            'Open the document and use the **⋯** menu at the bottom of the editor. Sanity keeps a full history and you can restore any earlier version.',
          ],
          [
            'I cannot find the delete button on the About page.',
            'That is deliberate. **About page** and **Site settings** are one-of-a-kind, so deleting and duplicating are switched off to prevent accidents.',
          ],
          [
            'Can I work on a big rewrite without it going live?',
            'Yes. Edit away — everything stays a draft until you press **Publish**. You can leave a draft sitting for as long as you like.',
          ],
        ],
      },
    ],
  },
];
