import React, { useMemo, useState } from 'react';
import {
  Badge,
  Box,
  Button,
  Card,
  Flex,
  Heading,
  Stack,
  Text,
  TextInput,
} from '@sanity/ui';

import { GUIDE_SECTIONS, type GuideBlock, type GuideSection } from './guideContent';

/**
 * The in-Studio handbook for Mike and Ros.
 *
 * Content lives in guideContent.ts as plain data rather than JSX, which is what
 * makes the search box possible — every block flattens to text we can match
 * against. Field names here are copied from the schema files verbatim, so what
 * the guide calls a field is what the editor actually sees on screen.
 */
export default function GuideTool() {
  const [activeId, setActiveId] = useState(GUIDE_SECTIONS[0].id);
  const [query, setQuery] = useState('');

  const trimmed = query.trim().toLowerCase();

  const matches = useMemo(() => {
    if (!trimmed) return null;
    return GUIDE_SECTIONS.filter((section) =>
      sectionText(section).toLowerCase().includes(trimmed),
    );
  }, [trimmed]);

  const active = GUIDE_SECTIONS.find((s) => s.id === activeId) ?? GUIDE_SECTIONS[0];
  const shown = matches ?? [active];

  return (
    <Flex height="fill" style={{ minHeight: 0 }}>
      {/* Sidebar */}
      <Card
        borderRight
        tone="transparent"
        style={{ width: 260, flex: 'none', overflowY: 'auto' }}
        padding={3}
      >
        <Stack space={3}>
          <Box paddingX={2} paddingTop={2}>
            <Text size={1} weight="semibold" muted>
              STUDIO GUIDE
            </Text>
          </Box>

          <TextInput
            value={query}
            onChange={(e) => setQuery(e.currentTarget.value)}
            placeholder="Search the guide…"
            clearButton={Boolean(query)}
            onClear={() => setQuery('')}
            fontSize={1}
          />

          <Stack space={1}>
            {GUIDE_SECTIONS.map((section) => {
              const isMatch = !matches || matches.some((m) => m.id === section.id);
              return (
                <Button
                  key={section.id}
                  mode="bleed"
                  tone={section.id === activeId && !matches ? 'primary' : 'default'}
                  selected={section.id === activeId && !matches}
                  disabled={!isMatch}
                  justify="flex-start"
                  padding={3}
                  fontSize={1}
                  text={`${section.emoji}  ${section.title}`}
                  onClick={() => {
                    setActiveId(section.id);
                    setQuery('');
                  }}
                />
              );
            })}
          </Stack>
        </Stack>
      </Card>

      {/* Content */}
      <Box flex={1} overflow="auto" padding={5}>
        <Box style={{ maxWidth: 760, margin: '0 auto' }}>
          {matches && (
            <Box marginBottom={4}>
              <Text size={1} muted>
                {matches.length === 0
                  ? `Nothing matches “${query}”.`
                  : `${matches.length} section${matches.length === 1 ? '' : 's'} matching “${query}”`}
              </Text>
            </Box>
          )}

          <Stack space={6}>
            {shown.map((section) => (
              <Stack key={section.id} space={4}>
                <Box>
                  <Heading as="h1" size={4}>
                    {section.emoji} {section.title}
                  </Heading>
                  {section.blurb && (
                    <Box marginTop={3}>
                      <Text size={2} muted>
                        {section.blurb}
                      </Text>
                    </Box>
                  )}
                </Box>

                {section.blocks.map((block, i) => (
                  <BlockView key={i} block={block} />
                ))}
              </Stack>
            ))}
          </Stack>
        </Box>
      </Box>
    </Flex>
  );
}

function BlockView({ block }: { block: GuideBlock }) {
  if ('h' in block) {
    return (
      <Box paddingTop={2}>
        <Heading as="h2" size={2}>
          {block.h}
        </Heading>
      </Box>
    );
  }

  if ('p' in block) {
    return (
      <Text size={2}>
        <Rich text={block.p} />
      </Text>
    );
  }

  if ('steps' in block) {
    return (
      <Stack space={3} as="ol" style={{ paddingLeft: 0, listStyle: 'none', margin: 0 }}>
        {block.steps.map((step, i) => (
          <Flex key={i} gap={3} align="flex-start">
            <Badge tone="primary" mode="outline" radius="full" style={{ flex: 'none' }}>
              {i + 1}
            </Badge>
            <Text size={2}>
              <Rich text={step} />
            </Text>
          </Flex>
        ))}
      </Stack>
    );
  }

  if ('fields' in block) {
    return (
      <Card border radius={2} padding={0} tone="transparent">
        <Stack space={0}>
          {block.fields.map(([label, desc], i) => (
            <Box key={i} padding={3} style={i > 0 ? { borderTop: '1px solid var(--card-border-color)' } : undefined}>
              <Stack space={2}>
                <Text size={1} weight="semibold">
                  {label}
                </Text>
                <Text size={1} muted>
                  <Rich text={desc} />
                </Text>
              </Stack>
            </Box>
          ))}
        </Stack>
      </Card>
    );
  }

  if ('faq' in block) {
    return (
      <Stack space={4}>
        {block.faq.map(([q, a], i) => (
          <Stack key={i} space={2}>
            <Text size={2} weight="semibold">
              {q}
            </Text>
            <Text size={2} muted>
              <Rich text={a} />
            </Text>
          </Stack>
        ))}
      </Stack>
    );
  }

  // callout
  return (
    <Card padding={4} radius={2} tone={block.callout.tone} border>
      <Stack space={3}>
        <Text size={1} weight="semibold">
          {block.callout.title}
        </Text>
        <Text size={2}>
          <Rich text={block.callout.body} />
        </Text>
      </Stack>
    </Card>
  );
}

/**
 * Minimal inline formatting so the content stays plain, searchable strings:
 * **bold** for anything the editor will see on screen, `code` for exact values.
 */
function Rich({ text }: { text: string }) {
  const parts = text.split(/(\*\*[^*]+\*\*|`[^`]+`)/g).filter(Boolean);
  return (
    <>
      {parts.map((part, i) => {
        if (part.startsWith('**') && part.endsWith('**')) {
          return <strong key={i}>{part.slice(2, -2)}</strong>;
        }
        if (part.startsWith('`') && part.endsWith('`')) {
          return (
            <code
              key={i}
              style={{
                fontFamily: 'var(--font-family-mono, monospace)',
                fontSize: '0.9em',
                padding: '0.1em 0.35em',
                borderRadius: 3,
                background: 'var(--card-code-bg-color, rgba(127,127,127,0.15))',
              }}
            >
              {part.slice(1, -1)}
            </code>
          );
        }
        return <React.Fragment key={i}>{part}</React.Fragment>;
      })}
    </>
  );
}

/** Everything in a section as one searchable string. */
function sectionText(section: GuideSection): string {
  const parts: string[] = [section.title, section.blurb ?? ''];
  for (const block of section.blocks) {
    if ('h' in block) parts.push(block.h);
    else if ('p' in block) parts.push(block.p);
    else if ('steps' in block) parts.push(...block.steps);
    else if ('fields' in block) parts.push(...block.fields.flat());
    else if ('faq' in block) parts.push(...block.faq.flat());
    else parts.push(block.callout.title, block.callout.body);
  }
  return parts.join(' ');
}
