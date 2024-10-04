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

function nonCustodial() {
    router.push('/(app)')
}


export default function Index() {
    const { t } = useLocalization();
    return (
        <TouchableWithoutFeedback onPress={Keyboard.dismiss} accessible={false}>
            <Layout style={{ backgroundColor: colors.primary[2700]}}>
            <Logo type="LogoFull" theme="dark" />
                <View style={{ marginTop: 24}}>
                    <Text style={{ color: colors.primary[100], ...texts.H4Bold }}>Welcome!</Text>
                    <Text style={{ color: colors.primary[200], ...texts.P1Medium }}>Choose one of the following options to continue</Text>

                    <View style={{ gap: 12, marginTop: 24 }}>
                        <Button type="caption" text={t.index.non_custodial.text} description={t.index.non_custodial.description} icon="Blackhole" buttonStyle={{ variant: 'primary', full: true, size: 'medium' }} theme="dark" onPress={nonCustodial} />
                        <Button type="caption" text={t.index.sign_in.text} description={t.index.sign_in.description} icon="Explore" buttonStyle={{ variant: 'primary', full: true, size: 'medium' }} theme="dark" onPress={signIn} />
                        <Button type="caption" text={t.index.sign_up.text} description={t.index.sign_up.description} icon="World" buttonStyle={{ variant: 'primary', full: true, size: 'medium' }} theme="dark" onPress={signUp} />
                    </View>
                </View>
            </Layout>
        </TouchableWithoutFeedback>
    );
}