import type { Meta, StoryObj } from '@storybook/nextjs-vite';
import { fn } from 'storybook/test';
import { de } from 'zod/v4/locales';

import { Button } from './button';

// More on how to set up stories at: https://storybook.js.org/docs/writing-stories#default-export
const meta = {
  title: 'Components/button',
  component: Button,
  parameters: {
    // Optional parameter to center the component in the Canvas. More info: https://storybook.js.org/docs/configure/story-layout
    layout: 'centered',
  },
  // This component will have an automatically generated Autodocs entry: https://storybook.js.org/docs/writing-docs/autodocs
  tags: ['autodocs'],
  // More on argTypes: https://storybook.js.org/docs/api/argtypes
  argTypes: {
    children: { control: 'text', defaultValue: 'Button', description: 'Button label' },
  },
  // Use `fn` to spy on the onClick arg, which will appear in the actions panel once invoked: https://storybook.js.org/docs/essentials/actions#story-args
  args: { onClick: fn() },
} satisfies Meta<typeof Button>;

export default meta;
type Story = StoryObj<typeof meta>;

// More on writing stories with args: https://storybook.js.org/docs/writing-stories/args
export const Default: Story = {
  args: {
    variant: 'default',
    size: 'default',
    children: 'Button',
  },
};

// export const Secondary: Story = {
//   args: {
//     label: 'Button',
//   },
// };

// export const Large: Story = {
//   args: {
//     size: 'large',
//     label: 'Button',
//   },
// };

// export const Small: Story = {
//   args: {
//     size: 'small',
//     label: 'Button',
//   },
// };

// export const SuccessAlert: Story = {
//   args: {
//     primary: false,
//     label: 'Button',
//   },
// };
