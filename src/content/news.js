// src/content/news.js
// Engineering notes:
// - "detailsMd" uses Markdown for long-form details.
// - "cover" points to your local asset or a remote URL.

export const newsItems = [
  {
    id: 'bbc-demo-1',
    source: 'BBC News',
    date: '2025-06-11',
    title: 'Demo headline: research prototype showcased',
    excerpt:
      'A short summary that appears on the scrolling card. Keep it to 1–2 lines.',
    cover: '/md-assets/news/sample_cover.png',
    detailsMd: `
## Summary
This page displays the full details for the selected news item, similar to common media sites.

## What happened
- The prototype was presented to a broader audience.
- Feedback highlighted interaction clarity and responsiveness.

## Why it matters
This demonstrates how research artefacts can be communicated through a consistent, public-facing interface.

## Links
- [Example external link](https://example.com)
`,
  },

  {
    id: 'event-demo-1',
    source: 'Lab Event',
    date: '2025-07-02',
    title: 'Workshop: human-centered prototyping',
    excerpt:
      'A brief description of the event, its theme, and what visitors can expect.',
    cover: '/md-assets/news/sample_cover.png',
    detailsMd: `
## About the event
This workshop focuses on prototyping workflows and practical interface design.

## Agenda
1. Lightning talks
2. Prototype demos
3. Discussion & feedback

## Contact
- Email: [lei.shi@newcastle.ac.uk](mailto:lei.shi@newcastle.ac.uk)
`,
  },
]
