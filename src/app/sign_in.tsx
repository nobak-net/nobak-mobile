import { router } from 'expo-router';
import * as React from 'react';
import { View, StyleSheet, Keyboard, TouchableWithoutFeedback, Text, TouchableOpacity } from 'react-native';
import { encrypt } from '../utils/crypto';
import { useSession } from '../context/AuthContext';
import { runFetch } from '../utils/runFetch';
import { Form, Layout, Button, Symbol, colors, texts, Logo } from 'nobak-native-design-system';
import { useLocalization } from '../context';

export default function SignIn() {
  const { t } = useLocalization();

  const { emailChallenge } = useSession();

  const [email, setEmail] = React.useState('');

  const sendMail = async ({ email }: any) => {
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
      <Layout>
        <Logo type="LogoFull" />
        <View style={{ marginTop: 24 }}>
          <TouchableOpacity onPress={() => router.push('/')}>
            <Symbol type="Back" />
          </TouchableOpacity>
          <View style={{ marginTop: 24 }}>
            <Text style={{ color: colors.primary[2400], ...texts.H4Bold }}>Sign In</Text>
            <Text style={{ color: colors.primary[2000], ...texts.P2Medium }}>Enter your email, you will be receving a code to login into your account.</Text>
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
      </Layout>
    </TouchableWithoutFeedback>
  );
}