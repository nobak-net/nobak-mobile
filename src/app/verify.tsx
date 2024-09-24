import { router } from 'expo-router';
import React, { useState } from 'react';
import { Text, View, StyleSheet, Keyboard, TouchableWithoutFeedback, Alert } from 'react-native';
import { useAuth } from '@/src/context/AuthContext';
import { Layout, SymbolButton, Button, Logo, colors, texts, RCIInput } from 'nobak-native-design-system';

const Verify = () => {
    const { signIn, email } = useAuth();
    const [code, setCode] = useState('');

    const handleCodeComplete = async (enteredCode) => {
        setCode(enteredCode);
        try {
            await signIn(enteredCode);
        } catch (error) {
            Alert.alert('Error', 'Invalid verification code. Please try again.');
        }
    };

    const handlePaste = async (pastedCode) => {
        if (pastedCode.length === 6 && /^\d+$/.test(pastedCode)) {
            setCode(pastedCode);
            try {
                await signIn(pastedCode);
            } catch (error) {
                Alert.alert('Error', 'Invalid verification code. Please try again.');
            }
        } else {
            Alert.alert('Invalid Code', 'The pasted code is not valid.');
        }
    };

    return (
        <TouchableWithoutFeedback onPress={Keyboard.dismiss} accessible={false}>
            <Layout style={{backgroundColor: colors.primary[2700]}}>
                <Logo type="LogoFull" theme="dark" />
                <View style={styles.contentContainer}>
                    <SymbolButton onPress={() => router.push('/')} type="Back" />

                    <View style={styles.textContainer}>
                        <Text style={styles.title}>Enter Code</Text>
                        <Text style={styles.subtitle}>
                            Check your email {email}, we just sent you a code to complete the sign-in process.
                        </Text>
                    </View>

                    <View style={styles.inputContainer}>
                        <RCIInput
                            maxLength={6}
                            onCodeComplete={handleCodeComplete}
                            onPaste={handlePaste}
                            placeholder="•"
                            keyboardType="number-pad"
                            autoFocus
                        />
                    </View>

                    <View style={styles.footer}>
                        <Text style={styles.helpText}>Having trouble receiving your code?</Text>
                        <View style={styles.resendButton}>
                            <Button text="Resend code" onPress={() => router.push('/sign_in')} />
                        </View>
                    </View>
                </View>
            </Layout>
        </TouchableWithoutFeedback>
    );
};

const styles = StyleSheet.create({
    contentContainer: {
        marginTop: 24,
        
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-between',
    },
    textContainer: {
        marginTop: 24,
    },
    title: {
        color: colors.primary[100],
        ...texts.H4Bold,
    },
    subtitle: {
        color: colors.primary[400],
        ...texts.P2Medium,
        marginTop: 8,
    },
    inputContainer: {
        marginTop: 40,
        
    },
    footer: {
        marginTop: 20,
    },
    helpText: {
        color: colors.primary[400],
        ...texts.CaptionBold,
    },
    resendButton: {
        marginTop: 8,
    },
});

export default Verify;