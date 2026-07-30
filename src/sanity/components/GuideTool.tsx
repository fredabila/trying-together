import React from 'react';
import { Card, Container, Heading, Text, Stack, Box } from '@sanity/ui';

export default function GuideTool() {
  return (
    <Container width={2} padding={4}>
      <Card padding={4} radius={3} shadow={1} style={{ backgroundColor: 'white' }}>
        <Stack space={5}>
          <Box>
            <Heading as="h1" size={4}>Trying Together: Studio Guide</Heading>
            <Box marginTop={3}>
              <Text size={2} muted>
                Welcome! This guide explains how to manage your website content using Sanity Studio.
              </Text>
            </Box>
          </Box>

          <Stack space={4}>
            <Heading as="h2" size={3}>🎧 Managing Episodes</Heading>
            <Text size={2}>
              This is where you will spend most of your time—adding new podcast episodes or editing existing ones.
            </Text>
            
            <Heading as="h3" size={2}>Adding a New Episode</Heading>
            <Stack space={3}>
              <Text size={2}>
                <strong>1. Create:</strong> Click the pencil icon (Create new document) in the top left, or navigate into the Episodes list and click + New.
              </Text>
              <Text size={2}>
                <strong>2. Main Tab:</strong> Fill in the Title, click Generate to create the Web Address, and select the Series. You can set the Publish Date to the future to hide it until launch. Upload artwork and a short description.
              </Text>
              <Text size={2}>
                <strong>3. Audio Tab:</strong> Choose how the episode plays (Audio File, Spotify Embed, YouTube Embed, or Apple Podcasts Embed).
              </Text>
              <Text size={2}>
                <strong>4. Show notes & guests Tab:</strong> Add links, resources, guest details, and an optional transcript.
              </Text>
            </Stack>
          </Stack>

          <Stack space={4}>
            <Heading as="h2" size={3}>📝 Editing the "About" Page</Heading>
            <Text size={2}>
              Your About page is modular. Click <strong>About page</strong> in the left sidebar to edit it.
            </Text>
            <Stack space={3}>
              <Text size={2}>
                <strong>Top of the page:</strong> Set the main heading, mission statement, and upload a photo of yourselves.
              </Text>
              <Text size={2}>
                <strong>Page sections:</strong> Click <strong>Add item</strong> to add different blocks (Text, Pull quote, Image, List of points, Call to action). You can drag and drop these sections to reorder them at any time!
              </Text>
            </Stack>
          </Stack>

          <Stack space={4}>
            <Heading as="h2" size={3}>⚙️ Site Settings</Heading>
            <Text size={2}>
              This section controls global elements of your website.
            </Text>
            <Stack space={3}>
              <Text size={2}>
                <strong>The Show:</strong> Update the main show name, tagline, description, and main podcast artwork.
              </Text>
              <Text size={2}>
                <strong>Listen on & Show players:</strong> Add links to platforms (Spotify, Apple, etc.) which turn into buttons. Add embed players for the homepage.
              </Text>
              <Text size={2}>
                <strong>Social links:</strong> Manage your Instagram, TikTok, etc. (appears in footer and Contact page).
              </Text>
              <Text size={2}>
                <strong>Homepage text & Contact:</strong> Change the big hero text on the homepage and the contact page intro.
              </Text>
            </Stack>
          </Stack>

          <Stack space={4}>
            <Heading as="h2" size={3}>📬 Subscribers</Heading>
            <Text size={2}>
              When visitors sign up for your mailing list, they appear here.
            </Text>
            <Text size={2}>
              You will see a list of everyone who has signed up. To export this list for Mailchimp/ConvertKit, go to <strong>sanity.io/manage</strong> → Select your project → <strong>Datasets</strong> → <strong>Export</strong>.
            </Text>
          </Stack>

          <Card padding={4} radius={2} tone="primary">
            <Stack space={3}>
              <Heading as="h3" size={2}>💡 General Tips</Heading>
              <Text size={2}>
                <strong>Drafts save automatically:</strong> You don't need to manually save. Sanity saves your work instantly.
              </Text>
              <Text size={2}>
                <strong>Publish when ready:</strong> Changes to existing pages (like the About page) won't show up on the live website until you click the green <strong>Publish</strong> button in the bottom right corner.
              </Text>
            </Stack>
          </Card>
        </Stack>
      </Card>
    </Container>
  );
}
