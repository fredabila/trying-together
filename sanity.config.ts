import { defineConfig } from 'sanity';
import { structureTool } from 'sanity/structure';
import { visionTool } from '@sanity/vision';
import { schema } from './src/sanity/schemaTypes';
import { projectId, dataset, apiVersion } from './src/sanity/env';
import { structure, singletonTypes } from './src/sanity/structure';
import GuideTool from './src/sanity/components/GuideTool';

export default defineConfig({
  name: 'trying-together',
  title: 'Trying Together',
  basePath: '/studio',
  projectId,
  dataset,
  schema: {
    ...schema,
    // Keep the "create new" menu to the things an editor should actually create.
    // This belongs under `schema` — at the top level it is silently ignored.
    templates: (prev) => prev.filter((template) => !singletonTypes.has(template.schemaType)),
  },
  plugins: [structureTool({ structure }), visionTool({ defaultApiVersion: apiVersion })],
  document: {
    // The About page and Site settings are one-of-a-kind documents, so hide the
    // actions that would let an editor duplicate or delete them by accident.
    actions: (prev, { schemaType }) =>
      singletonTypes.has(schemaType)
        ? prev.filter(({ action }) => action && !['duplicate', 'delete', 'unpublish'].includes(action))
        : prev,
  },
  tools: (prev) => {
    return [
      ...prev,
      {
        name: 'guide',
        title: 'Guide',
        component: GuideTool,
      },
    ];
  },
});
