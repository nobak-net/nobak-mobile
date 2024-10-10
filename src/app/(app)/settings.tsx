import React from 'react';
import { View, Text, Alert } from 'react-native';
import { useAuth } from '@/src/context/AuthContext';
import { Layout, colors, texts, Button, PromoCard } from 'nobak-native-design-system'
import { useLocalization, useDevMode } from '@/src/context';
import { router } from 'expo-router';
import { WipeData } from '@/src/utils/WipeData';
import { useActionPrompt } from '@/src/hooks/useActionPrompt';


function signUp() {
    router.push('/sign_up')
}

function signIn() {
    router.push('/sign_in')
}

function devMode() {
    router.push('/sign_in')
}


const Settings = () => {
    const { t } = useLocalization();
    const { isDevMode, toggleDevMode } = useDevMode()
    const { actionPrompt } = useActionPrompt({ title: "Are you sure?", description: "This action can't be undone", onOK: () => destroy() })

    const { signOut, session } = useAuth();
    
    const devMode = () => {
        toggleDevMode()
        router.push('/(app)')
    }

    const destroy = async () => {
        await WipeData()
        router.push('/')
    }
    return (
        <Layout style={{ backgroundColor: colors.primary[2400], gap: 12 }}>
            <View>
                {session ?
                    <View>
                        <Text style={{ color: colors.primary[100], ...texts.H3Bold }}>Settings</Text>
                        <Text style={{ color: colors.primary[100], ...texts.P2Bold }}>Email</Text>
                        <Text style={{ color: colors.primary[100], ...texts.P3Medium }}>{session.email}</Text>
                        {/* <Text style={{ color: colors.primary[100], ...texts.P2Bold }}>Account ID</Text> */}
                        {/* <Text style={{ color: colors.primary[100], ...texts.P3Medium }}>{session.accountId}</Text> */}

                        <Text style={{ color: colors.primary[100], ...texts.P2Bold }}>Account:</Text>
                        {/* <Text style={{ color: colors.primary[100], ...texts.P3Medium }} selectable={true}>{session.ledger_accounts[0].address}</Text> */}
                        <Button buttonStyle={{ variant: 'secondary', size: 'tiny', full: true }} type="iconText" icon="Exit" text='Sign Out' onPress={() => {
                        // The `app/(app)/_layout.tsx` will redirect to the sign-in screen.
                        signOut();
                        }} />
                    </View>
                    :
                    !isDevMode && <View>
                        <Text style={{ color: colors.primary[100], ...texts.H3Bold }}>Become a Member</Text>
                        <PromoCard title="Sign Up" description="Enjoy account recovery"/>
                        <View style={{ gap: 12, marginTop: 24 }}>
                        <Button type="caption" text={t.index.sign_in.text} description={t.index.sign_in.description} icon="Explore" buttonStyle={{ variant: 'primary', full: true, size: 'medium' }} theme="dark" onPress={signIn} />
                        {/* <Button type="caption" text={t.index.sign_up.text} description={t.index.sign_up.description} icon="World" buttonStyle={{ variant: 'primary', full: true, size: 'medium' }} theme="dark" onPress={signUp} /> */}
                        </View>
                    </View>
                }
                <View style={{ gap: 12, marginTop: 24 }}>
                    <Text style={{ color: colors.primary[100], ...texts.H3Bold }}>Advanced</Text>
                    {/* <Button type="captio" text={"Theme"} description={"Change theme"} icon="Extension" buttonStyle={{ variant: !isDevMode ? 'primary' : 'secondary', full: true, size: 'medium' }} theme="dark" onPress={devMode} /> */}
                    <Button type="caption" text={"Developer Mode"} description={"Switch to the testnet"} icon="Clockwork" buttonStyle={{ variant: !isDevMode ? 'primary' : 'secondary', full: true, size: 'medium' }} theme="dark" onPress={devMode} />
                    <Button type="caption" text={"Destroy Everything"} description={"Start from scratch"} icon="Cross" buttonStyle={{ variant: 'primary', full: true, size: 'medium' }} theme="dark" onPress={actionPrompt} />
                </View>
            </View>
        </Layout>
    );
};

// const styles = StyleSheet.create({
//     container: {
//         flex: 1,
//         padding: 20,
//         justifyContent: 'center',
//         alignItems: 'center',
//     },
//     title: {
//         fontSize: 20,
//         fontWeight: 'bold',
//         marginBottom: 20,
//     },
//     label: {
//         fontSize: 16,
//         fontWeight: 'bold',
//     },
//     value: {
//         fontSize: 16,
//         marginTop: 5,
//     },
// });

export default Settings;