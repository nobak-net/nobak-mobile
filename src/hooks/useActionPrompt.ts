import { Alert, Platform } from 'react-native';
import PromptAndroid from 'react-native-prompt-android';

export function useActionPrompt({ title, description, onOK, onCancel }: { title: string, description: string, onOK: () => void, onCancel?: () => void }) {
  const actionPrompt = (): Promise<void> => {
    return new Promise((resolve, reject) => {
      if (Platform.OS === 'ios') {
        Alert.alert(
          title,
          description,
          [
            {
              text: 'Cancel',
              onPress: () => {
                onCancel && onCancel();
                reject(new Error('User cancelled prompt'));
              },
              style: 'cancel',
            },
            {
              text: 'OK',
              onPress: () => {
                onOK();
                resolve();
              },
            },
          ]
        );
      } else if (Platform.OS === 'android') {
        PromptAndroid(
          title,
          description,
          [
            {
              text: 'Cancel',
              onPress: () => {
                onCancel && onCancel();
                reject(new Error('User cancelled prompt'));
              },
              style: 'cancel',
            },
            {
              text: 'OK',
              onPress: () => {
                onOK();
                resolve();
              },
            },
          ],
          {
            cancelable: false,
          }
        );
      } else {
        // Fallback for other platforms or environments
        reject(new Error('Unsupported platform'));
      }
    });
  };

  return { actionPrompt };
}