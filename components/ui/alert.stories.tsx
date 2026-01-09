import type { Meta, StoryObj } from '@storybook/nextjs-vite';

import { Alert } from './alert';

const meta = {
  title: 'Components/alert',
  component: Alert,
  tags: ['autodocs'],
  argTypes: {
    title: { control: 'text', description: 'Alert title' },
    description: { control: 'text', description: 'Alert message' },
  },
} satisfies Meta<typeof Alert>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    variant: 'default',
    title: 'Default Alert',
    description: 'This is a default alert message.',
  },
};

export const Success: Story = {
  args: {
    variant: 'success',
    title: 'Success Alert',
    description: 'Success alert message',
  },
};

export const Destructive: Story = {
  args: {
    variant: 'destructive',
    title: 'Destructive Alert',
    description: 'Destructive alert message',
  },
};
