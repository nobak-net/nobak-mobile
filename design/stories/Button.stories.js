// Button.stories.js
import React from 'react';
import { View } from 'react-native';
import Button from '../components/Button';

// Meta configuration for the story
const ButtonMeta = {
  title: 'Button',
  component: Button,
  argTypes: {
    onPress: { action: 'pressed the button' },
  },
  args: {
    title: 'Hello World',  // Default args for your stories
  },
  decorators: [
    (Story) => (
      <View style={{ alignItems: 'center', justifyContent: 'center', flex: 1 }}>
        <Story />
      </View>
    ),
  ],
};

export default ButtonMeta;

// Basic usage story
export const Basic = {};

// Another example with different props
export const AnotherExample = {
  args: {
    title: 'Another Example',
  },
};

