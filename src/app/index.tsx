import { router } from 'expo-router';
import * as React from 'react';
import { View, StyleSheet, Keyboard, TouchableWithoutFeedback, Text } from 'react-native';
import { encrypt } from '../utils/crypto';
import { useSession } from '../context/AuthContext';
import { runFetch } from '../utils/runFetch';
import { Button, Layout, Header, colors, texts, Logo } from 'nobak-native-design-system';
import { useLocalization } from '../context';


function signUp() {
    router.push('/onboard/greetings')
}

function signIn() {
    router.push('/sign_in')
}

export default function Index() {
    const { t } = useLocalization();
    return (
        <TouchableWithoutFeedback onPress={Keyboard.dismiss} accessible={false}>
            <View>
                <Logo type="LogoFull" />
                <Text style={{ color: colors.primary[1700], ...texts.displayBold }}>{t.index.welcome}</Text>
                <View style={{ gap: 10 }}>
                    <Button type="caption" text={t.index.sign_in.text} description={t.index.sign_in.description} buttonStyle={{ variant: 'primary', full: true, size: 'medium' }} onPress={signUp} />
                    <Button type="caption" text={t.index.sign_up.text} description={t.index.sign_up.description} buttonStyle={{ variant: 'primary', full: true, size: 'medium' }} onPress={signIn} />
                </View>
            </View>
        </TouchableWithoutFeedback>
    );
}