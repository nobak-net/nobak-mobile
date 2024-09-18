import { useState } from 'react';
import { Alert, Platform } from 'react-native';
import PromptAndroid from 'react-native-prompt-android';

export function usePasswordPrompt() {
  const promptPassword = (): Promise<string> => {
    return new Promise((resolve, reject) => {
      if (Platform.OS === 'ios') {
        Alert.prompt(
          'Enter Password',
          'Please enter your password to sign the transaction.',
          [
            {
              text: 'Cancel',
              onPress: () => reject(new Error('User cancelled password prompt')),
              style: 'cancel',
            },
            {
              text: 'OK',
              onPress: (password) => {
                if (password) {
                  resolve(password);
                } else {
                  reject(new Error('Password is required'));
                }
              },
            },
          ],
          'secure-text'
        );
      } else if (Platform.OS === 'android') {
        PromptAndroid(
          'Enter Password',
          'Please enter your password to sign the transaction.',
          [
            {
              text: 'Cancel',
              onPress: () => reject(new Error('User cancelled password prompt')),
              style: 'cancel',
            },
            {
              text: 'OK',
              onPress: (password) => {
                if (password) {
                  resolve(password);
                } else {
                  reject(new Error('Password is required'));
                }
              },
            },
          ],
          {
            type: 'secure-text',
            cancelable: false,
          }
        );
      } else {
        // Fallback for other platforms or environments
        reject(new Error('Unsupported platform'));
      }
    });
  };

  return { promptPassword };
}