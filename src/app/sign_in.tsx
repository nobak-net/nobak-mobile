import { router } from 'expo-router';
import * as React from 'react';
import { View, StyleSheet, Keyboard, TouchableWithoutFeedback } from 'react-native';
import { encrypt } from '../utils/crypto';
import { useSession } from '../context/AuthContext';
import { runFetch } from '../utils/runFetch';
import { Form } from 'nobak-native-design-system';

export default function SignIn() {
  const { emailChallenge } = useSession();

  const [email, setEmail] = React.useState('');

  const sendMail = async ({email}: any) => {
    console.log('email', email)
    if (email) {
      const payload = encrypt({ email: email }, 'ThisIs32BytesLongSecretForAES!!!')
      const response = await runFetch('http://192.168.1.103:8782/auth/email', 'POST', JSON.stringify({ payload, type: 'OBJECT' }));
      // console.log('response', response)
      if (response.status === 200) {
        router.replace('/verify');
      }
    } else {
      // handle empty email field, maybe show an alert
      alert('Please enter an email');
    }
  }

  return (
    <TouchableWithoutFeedback onPress={Keyboard.dismiss} accessible={false}>
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <View style={styles.container}>
          <Form fields={[
            {
              field: {
                type: 'text',
                id: 'email',
                label: 'Email',
                placeholder: 'example@email.com',
              }
            },
          ]
          }
            onSubmit={sendMail} />
        </View>
      </View>
    </TouchableWithoutFeedback>

  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 10,
  },
});
