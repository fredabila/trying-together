import { createImageUrlBuilder } from '@sanity/image-url';
import type { Image } from 'sanity';

import { dataset, projectId } from '../env';

const builder = createImageUrlBuilder({ projectId, dataset });

export function urlForImage(source: Image | undefined | null) {
  if (!source || !(source as { asset?: unknown }).asset) return undefined;
  return builder.image(source).auto('format').fit('max');
}
