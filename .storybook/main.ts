import type { StorybookConfig } from '@storybook/nextjs-vite';
import path from 'path';

const config: StorybookConfig = {
  stories: [
    '../stories/**/*.mdx',
    '../stories/**/*.stories.@(js|jsx|mjs|ts|tsx)',
    '../components/**/*.stories.@(js|jsx|mjs|ts|tsx)',
    '../app/**/*.stories.@(js|jsx|mjs|ts|tsx)',
  ],
  addons: [
    '@chromatic-com/storybook',
    '@storybook/addon-vitest',
    '@storybook/addon-a11y',
    '@storybook/addon-docs',
    '@storybook/addon-onboarding',
    '@storybook/addon-themes',
  ],
  typescript: {
    reactDocgen: 'react-docgen-typescript',
  },
  framework: '@storybook/nextjs-vite',
  // framework: path.resolve(require.resolve('@storybook/nextjs-vite/preset'), '..'),
  staticDirs: ['..\\public'],
};

export default config;
