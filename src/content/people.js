// src/content/people.js
// Engineering notes:
// - Keep long intro as Markdown (bioMd).
// - Keep links optional; render only when provided.

export const people = [
  {
    id: 'fadel-adib',
    name: 'Fadel Adib',
    group: 'Project Lead', // 'Project Lead' | 'PhD Student'
    title: 'Associate Professor of Media',
    affiliation: 'Arts and Sciences',
    image: '/md-assets/people/sample_name.png',

    // Long-form personal intro (Markdown)
    bioMd: `
Fadel Adib is an Associate Professor at the Media Lab. His research focuses on designing interactive systems that bridge sensing, communication, and human-centered applications.

## Research interests
- Human–computer interaction
- Interactive sensing and ubiquitous systems
- Communication-aware AI systems

## Selected highlights
- Led interdisciplinary research prototypes and demos.
- Supervised student projects across design and engineering.
- Built systems for robust interaction in real-world settings.
`,

    links: {
      website: 'https://example.com',
      linkedin: 'https://www.linkedin.com/in/example',
      email: 'someone@example.com',
    },
  },

  {
    id: 'john-doe-1',
    name: 'Dr. John Doe',
    group: 'Project Lead',
    title: 'Project Lead',
    affiliation: 'Arts and Sciences',
    image: '/md-assets/people/sample_name.png',
    bioMd: `
## Overview
Short bio goes here.

- Topic A
- Topic B
`,
    links: {
      email: 'lei.shi@newcastle.ac.uk',
    },
  },

  {
    id: 'phd-1',
    name: 'Jane Student',
    group: 'PhD Student',
    title: 'PhD Student',
    affiliation: 'Arts and Sciences',
    image: '/md-assets/people/sample_name.png',
    bioMd: `
Jane is a PhD student working on interactive systems and design tools.

## Interests
- HCI
- Prototyping workflows
- Generative systems
`,
    links: {
      linkedin: 'https://www.linkedin.com/in/example',
      email: 'jane.student@newcastle.ac.uk',
    },
  },
]
