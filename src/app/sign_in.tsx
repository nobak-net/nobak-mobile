import { router } from 'expo-router';
import * as React from 'react';
import { View, Keyboard, TouchableWithoutFeedback, Text, TouchableOpacity } from 'react-native';
import { Form, Layout, Symbol, colors, texts, Logo, SymbolButton } from 'nobak-native-design-system';
import { useLocalization, useAuth } from '@/src/context';
import SDK from '../utils/SDK';

export default function SignIn() {
  const { t } = useLocalization();
  const { setEmail } = useAuth()
  const sendEmail = async ({ email }: any) => {
    setEmail(email)
    console.log('email', email)
    const response = await SDK.sendEmail({ email });
    if (response.status === 200) {
      router.push('/verify')
    }
  }

  return (
    <TouchableWithoutFeedback onPress={Keyboard.dismiss} accessible={false}>
      <Layout style={{ backgroundColor: colors.primary[2400] }}>
        <Logo type="LogoFull" theme="dark" />
        <View style={{ marginTop: 24 }}>
          <SymbolButton type="Back" onPress={() => router.push('/')} />

          <View style={{ marginTop: 24 }}>
            <Text style={{ color: colors.primary[100], ...texts.H4Bold }}>Sign In</Text>
            <Text style={{ color: colors.primary[400], ...texts.P2Medium }}>Enter your email, you will be receving a code to login into your account.</Text>
            <Form
              theme="dark"
              fields={[
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
              onSubmit={sendEmail} />
          </View>
        </View>
      </Layout>
    </TouchableWithoutFeedback>
  );
}