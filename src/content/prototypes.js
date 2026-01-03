// src/content/prototypes.js
// Centralised content store for prototypes.
// Engineering notes:
// - Keep long-form details as Markdown strings (detailsMd).
// - Use stable ids and consistent field names.

export const prototypes = [
  {
    id: 1,
    name: 'Prototype 1',
    image: '/md-assets/prototypes/Images.png',
    date: 'Jun, 11/5/2025',
    abstract:
      'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed eiusmod tempor ullamco laboris test.',
    detailsMd: `
## Overview
This prototype explores a modular, research-oriented web platform that supports both public-facing communication and internal iteration. The goal is to present work in a structured yet flexible format, where projects, people, and prototypes can be expanded over time without breaking visual consistency.

## Key features
- **Responsive layout** across desktop and mobile
- **Drawer navigation** with scroll lock and click-outside close
- **Content modularisation** to keep UI and content maintainable
- **Clear hierarchy** for title, date, abstract, and details

## Implementation notes
- Vue component structure is kept minimal and composable.
- Long-form descriptions are written in Markdown and rendered at runtime.
- Styling is controlled via scoped CSS + \`:deep()\` selectors for Markdown HTML.

## Links
- Contact: [lei.shi@newcastle.ac.uk](mailto:lei.shi@newcastle.ac.uk)
`,
  },

  {
    id: 2,
    name: 'Prototype 2',
    image: '/md-assets/prototypes/Images.png',
    date: 'Jun, 11/5/2025',
    abstract:
      'A second prototype focusing on refined interaction patterns and content presentation.',
    detailsMd: `
## Summary
This prototype refines interaction feedback, spacing, and typography.

## Planned improvements
- Stronger content hierarchy
- Better mobile spacing for touch targets
- Visual polish and transition animations
`,
  },

  {
    id: 3,
    name: 'Prototype 3',
    image: '/md-assets/prototypes/Images.png',
    date: 'Jun, 11/5/2025',
    abstract:
      'A third prototype used for exploratory layout experiments and system scaling.',
    detailsMd: `
## Notes
Details coming soon.
`,
  },

  {
    id: 4,
    name: 'Prototype 4',
    image: '/md-assets/prototypes/Images.png',
    date: 'Jun, 11/5/2025',
    abstract:
      'A fourth prototype exploring alternative visual directions and navigation patterns.',
    detailsMd: `
## Notes
Details coming soon.
`,
  },
]
