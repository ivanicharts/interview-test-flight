import type { Meta, StoryObj } from '@storybook/nextjs-vite';

import { ErrorAlert } from './error-alert';

const meta = {
  title: 'Components/error-alert',
  component: ErrorAlert,
  tags: ['autodocs'],
  argTypes: {
    message: { control: 'text', description: 'Alert message' },
  },
} satisfies Meta<typeof ErrorAlert>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    message: 'This is a default alert message.',
  },
};
