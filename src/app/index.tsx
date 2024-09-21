import { router } from 'expo-router';
import * as React from 'react';
import { View, StyleSheet, Keyboard, TouchableWithoutFeedback, Text } from 'react-native';
import { encrypt } from '@/src/utils/crypto';
import { useAuth } from '@/src/context/AuthContext';
import { runFetch } from '@/src/utils/runFetch';
import { Button, Layout, Header, colors, texts, Logo } from 'nobak-native-design-system';
import { useLocalization } from '@/src/context';
// import { WipeData } from '@/utils/WipeData';


function signUp() {
    router.push('/sign_up')
}

function signIn() {
    router.push('/sign_in')
}

export default function Index() {
    const { t } = useLocalization();
    return (
        <TouchableWithoutFeedback onPress={Keyboard.dismiss} accessible={false}>
            <Layout>
            <Logo type="LogoFull" theme="dark" />
                <View style={{ marginTop: 24}}>
                    <Text style={{ color: colors.primary[100], ...texts.H4Bold }}>Welcome!</Text>
                    <Text style={{ color: colors.primary[200], ...texts.P1Medium }}>Choose one of the following options to continue</Text>

                    <View style={{ gap: 12, marginTop: 24 }}>
                        <Button type="caption" text={t.index.sign_in.text} description={t.index.sign_in.description} icon="Explore" buttonStyle={{ variant: 'primary', full: true, size: 'medium' }} onPress={signIn} />
                        <Button type="caption" text={t.index.sign_up.text} description={t.index.sign_up.description} icon="World" buttonStyle={{ variant: 'primary', full: true, size: 'medium' }} onPress={signUp} />
                        {/* <Button type="caption" text={"Reset"} description={"Reset everything"} icon="World" buttonStyle={{ variant: 'secondary', full: true, size: 'medium' }} onPress={() => WipeData()} /> */}
                    </View>
                </View>
            </Layout>
        </TouchableWithoutFeedback>
    );
}