import { type SchemaTypeDefinition } from 'sanity';
import { aboutPage } from './aboutPage';
import { audioSource } from './audioSource';
import { episode } from './episode';
import { mediaEmbed } from './mediaEmbed';
import { platformLink } from './platformLink';
import { series } from './series';
import { siteSettings } from './siteSettings';
import { subscriber } from './subscriber';

export const schema: { types: SchemaTypeDefinition[] } = {
  types: [episode, series, aboutPage, siteSettings, audioSource, mediaEmbed, platformLink, subscriber],
};
