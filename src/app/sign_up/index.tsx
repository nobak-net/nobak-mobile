import { router } from 'expo-router';
import * as React from 'react';
import { View, Keyboard, TouchableWithoutFeedback, Text, TouchableOpacity } from 'react-native';
import { Form, Layout, SymbolButton, colors, texts, Logo } from 'nobak-native-design-system';
import { useLocalization } from '../../context';
import SDK from '../../utils/SDK';
import navigation from '../../utils/Navigation';

export default function Index() {

    const sendEmail = async ({ email }: any) => {
        const response = await SDK.sendEmail({ email });
        if (response.status === 200) {
            router.push('/verify')
        }
    }

    return (
        <TouchableWithoutFeedback onPress={Keyboard.dismiss} accessible={false}>
            <Layout>
                <Logo type="LogoFull" />
                <View style={{ marginTop: 24 }}>
                    <SymbolButton type="Back" onPress={() => navigation.back()} />
                    <View style={{ marginTop: 24 }}>
                        <Text style={{ color: colors.primary[2400], ...texts.H4Bold }}>Sign Up</Text>
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
                            onSubmit={sendEmail} />
                    </View>
                </View>
            </Layout>
        </TouchableWithoutFeedback>
    )
};