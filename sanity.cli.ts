import { defineCliConfig } from 'sanity/cli';

export default defineCliConfig({
  api: {
    projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID || 'tbv4159o',
    dataset: process.env.NEXT_PUBLIC_SANITY_DATASET || 'production',
  },
  /**
   * Opt-in to automatically accepting the Sanity.io license agreement.
   * Required for non-interactive deploys (CI, scripts).
   */
  studioHost: 'trying-together',
});
