import React from 'react';
import { View, Text, StyleSheet, TextInput, Button } from 'react-native';

// Shared Styles
const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        padding: 20,
    },
    title: {
        fontSize: 24,
        fontWeight: 'bold',
        marginBottom: 10,
    },
    description: {
        fontSize: 16,
        textAlign: 'center',
        marginBottom: 20,
    },
    input: {
        width: '100%',
        borderWidth: 1,
        borderColor: 'gray',
        borderRadius: 5,
        padding: 10,
        marginBottom: 15,
    },
    button: {
        width: '100%',
        padding: 10,
    },
});

// Screen 1: Greetings
export const GreetingsScreen = () => (
    <View style={styles.container}>
        <Text style={styles.title}>Welcome to [Wallet Name]!</Text>
        <Text style={styles.description}>
            Start securing your digital assets with us.
        </Text>
        <Button title="Get Started" onPress={() => { }} />
    </View>
);

// Screen 2: Terms of Service
export const TermsOfServiceScreen = () => (
    <View style={styles.container}>
        <Text style={styles.title}>Terms of Service</Text>
        <Text style={styles.description}>
            Please read and agree to the terms of service to continue.
        </Text>
        <Button title="I Agree" onPress={() => { }} />
    </View>
);

// Screen 3: Recovery Strategy
export const RecoveryStrategyScreen = () => (
    <View style={styles.container}>
        <Text style={styles.title}>Recovery Strategy</Text>
        <Text style={styles.description}>
            Choose a recovery method for your account.
        </Text>
        <Button title="Use Email" onPress={() => { }} />
        <Button title="Use Phone Number" onPress={() => { }} />
    </View>
);

// Screen 4: Email Challenge
export const EmailChallengeScreen = () => (
    <View style={styles.container}>
        <Text style={styles.title}>Email Verification</Text>
        <TextInput style={styles.input} placeholder="Enter your email" />
        <Button title="Send Verification Code" onPress={() => { }} />
    </View>
);

// Screen 5: Email Verify
export const EmailVerifyScreen = () => (
    <View style={styles.container}>
        <Text style={styles.title}>Enter Verification Code</Text>
        <TextInput style={styles.input} placeholder="Verification Code" />
        <Button title="Verify" onPress={() => { }} />
    </View>
);

// Screen 6: Phone Challenge
export const PhoneChallengeScreen = () => (
    <View style={styles.container}>
        <Text style={styles.title}>Phone Verification</Text>
        <TextInput style={styles.input} placeholder="Enter your phone number" />
        <Button title="Send Verification Code" onPress={() => { }} />
    </View>
);

// Screen 7: Phone Verify
export const PhoneVerifyScreen = () => (
    <View style={styles.container}>
        <Text style={styles.title}>Enter Verification Code</Text>
        <TextInput style={styles.input} placeholder="Verification Code" />
        <Button title="Verify" onPress={() => { }} />
    </View>
);

// Screen 8: Auth Strategy
export const AuthStrategyScreen = () => (
    <View style={styles.container}>
        <Text style={styles.title}>Authentication Strategy</Text>
        <Text style={styles.description}>
            Choose your preferred method of authentication.
        </Text>
        <Button title="Use Password" onPress={() => { }} />
        <Button title="Use Biometric" onPress={() => { }} />
    </View>
);

// Screen 9: Password Setup
export const PasswordSetupScreen = () => (
    <View style={styles.container}>
        <Text style={styles.title}>Set Up Your Password</Text>
        <TextInput style={styles.input} secureTextEntry placeholder="Password" />
        <TextInput style={styles.input} secureTextEntry placeholder="Confirm Password" />
        <Button title="Set Password" onPress={() => { }} />
    </View>
);

// Screen 10: Biometric Setup
export const BiometricSetupScreen = () => (
    <View style={styles.container}>
        <Text style={styles.title}>Biometric Setup</Text>
        <Text style={styles.description}>
            Set up your biometric authentication.
        </Text>
        <Button title="Set Up Biometric" onPress={() => { }} />
    </View>
);

// Screen 11: Congratulations
export const CongratulationsScreen = () => (
    <View style={styles.container}>
        <Text style={styles.title}>Congratulations!</Text>
        <Text style={styles.description}>
            You've successfully set up your wallet.
        </Text>
        <Button title="Go to Dashboard" onPress={() => { }} />
    </View>
);

// Export all screens
export default {
    GreetingsScreen,
    TermsOfServiceScreen,
    RecoveryStrategyScreen,
    EmailChallengeScreen,
    EmailVerifyScreen,
    PhoneChallengeScreen,
    PhoneVerifyScreen,
    AuthStrategyScreen,
    PasswordSetupScreen,
    BiometricSetupScreen,
    CongratulationsScreen,
};

