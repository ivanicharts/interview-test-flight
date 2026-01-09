import type { Meta, StoryObj } from '@storybook/nextjs-vite';

import { StreamingProgress } from './streaming-progress';

const meta = {
  title: 'Analysis/streaming-progress',
  component: StreamingProgress,
  tags: ['autodocs'],
  argTypes: {
    stage: { control: 'text', description: 'Stage description' },
    percent: { control: 'number', description: 'Completion percentage' },
  },
} satisfies Meta<typeof StreamingProgress>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    percent: 100,
    stage: 'Analyzing data...',
    partialResults: {
      overallScore: 80,
      summary:
        'Strong match on core frontend requirements: 9+ years experience, deep React + TypeScript expertise, experience migrating class components to hooks/TS, Agile practice, remote collaboration and leadership. Main gaps: no evidence of French language, no explicit Node.js / backend development experience, and no mention of the collaboration tools Gather/Notion or personal projects. With small CV edits to call out backend exposure (if present), timezone availability, and language status (or willingness to learn), the candidate would be an excellent fit.',
      strengths: [
        '9+ years of frontend experience with React & TypeScript',
        'Led end-to-end frontend architecture and feature delivery',
        'Experience migrating legacy code to React Hooks/TypeScript',
        'Worked remotely in distributed teams across EU/US time zones',
        'Familiar with Agile/Scrum practices',
        'Focus on performance, accessibility (WCAG), and design systems',
        'Mentored teammates and performed code reviews',
        'Experience with GraphQL, REST, Storybook, CI/CD and testing tools',
      ],
      gaps: [
        {
          title: 'No evidence of Node.js / backend development',
          priority: 'high',
          // whyItMatters: 'JD explicitly states "You will be using Node.js a lot." For a fullstack TypeScript role, hiring managers expect familiarity with Node.js, server-side patterns, and related tooling.',
          // suggestions: [
          //   'If you have Node.js experience, add a bullet under relevant jobs: e.g., "Built Node.js services / APIs (Express/Nest) for X feature" with brief tech stack and result.',
          //   "If limited Node experience, undertake a short Node.js project (Express + TypeScript) and add it as a line under 'Personal Projects' with a link.",
          //   'List backend-relevant tooling used (e.g., AWS, Docker, PostgreSQL, serverless) to show backend exposure.',
          // ],
        },
        {
          title: 'Missing French language proficiency',
          priority: 'high',
          // whyItMatters: 'JD requires "You speak French and English" — absence of French is a direct disqualifier or will require explanation.',
          // suggestions: [
          //   'If you speak French, add it to the Languages section with level (e.g., "French (B1, conversational)").',
          //   'If not fluent, add a line: "Willing to learn / currently learning French (classes started MM/YYYY)" or propose a plan to reach conversational level.',
          //   'Offer to interview partly in French or mention any French-language collaboration experience.',
          // ],
        },
        {
          title: 'Collaboration tool visibility (Gather / Notion)',
          priority: 'medium',
          // whyItMatters: 'JD names specific remote tools; showing familiarity reassures cultural fit for remote collaboration.',
          // suggestions: [
          //   "Add a short line under 'Tools' or 'Remote work' listing 'Slack, Notion, Zoom, (Gather if used)'.",
          //   "If not used Gather, state openness: 'Comfortable with Gather / Notion — can learn quickly.'",
          // ],
        },
      ],
    },
  },
};
