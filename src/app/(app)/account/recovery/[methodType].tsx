// components/MethodType.tsx

import React, { useState } from 'react';
import { Text, View, Alert, ScrollView, StyleSheet } from "react-native";
import { Button, SymbolButton } from 'nobak-native-design-system';
import navigation from "@/src/utils/Navigation";
import { useRequiredParams } from "@/src/hooks/useRequiredParams";
import { usePasswordPrompt } from "@/src/hooks/usePasswordPrompt";
import { colors, texts, Form, RCIInput } from 'nobak-native-design-system';
import recovery from '@/src/utils/Recovery'

export default function MethodType() {
    const { methodType } = useRequiredParams<{ methodType: string }>(['methodType']) as { methodType: string };
    // const { promptPassword } = usePasswordPrompt();
    const [showRCI, setShowRCI] = useState(false);
    const [challenge, setChallenge] = useState('');

    // Determine the type based on methodType
    const isEmail = methodType === 'email';
    const isPhoneNumber = methodType === 'phone_number';

    // Dynamic texts based on methodType
    const title = isEmail ? 'Verify your email' : isPhoneNumber && 'Verify your mobile'
    const placeholder = isEmail ? 'example@email.com' : isPhoneNumber && '+1234567890'
    const alertMessage = isEmail
        ? (info: string) => `Verification code sent to ${info}`
        : isPhoneNumber
            ? (info: string) => `Verification code sent to ${info}`
            : (info: string) => `Verification code sent to ${info}`;

    // Define form fields based on methodType
    const fields = isEmail
        ? [{
            field: {
                type: 'text',
                id: 'email',
                label: 'Email',
                placeholder: 'example@email.com',
                keyboardType: 'email-address',
            }
        }]
        : [{
            field: {
                type: 'text',
                id: 'phone_number',
                label: 'Phone Number',
                placeholder: '+1234567890',
                keyboardType: 'phone-pad',
            }
        }]
    

    const registerMethod = async (formData: { [key: string]: any }) => {
        try {
            const value = isEmail ? formData.email : isPhoneNumber && formData.phone_number;
            setChallenge(value)
            const initResponse = await recovery.registerMethod(value, methodType);
            console.log("initResponse", initResponse)

            // Update the profile state with the fetched profile
            setShowRCI(true);

            Alert.alert('Success', 'successfully registered a method for verification');
        } catch (error: any) {
            console.error(error);
            Alert.alert('Error', error.message);
        }
    };

    // Handle RCIInput code completion
    const handleCodeComplete = async (code: string) => {
        // TODO: Implement your code verification logic here
        const initResponse = await recovery.verifyMethod(challenge, code)
        console.log("initResponse", initResponse)

        Alert.alert('Code Entered', `Your code is: ${code}`);
        setShowRCI(false);
        // Navigate or perform other actions as needed
    };

    // Handle paste event if needed
    const handlePaste = (code: string) => {
        // Handle pasted code if needed
        console.log('Pasted code:', code);
    };

    return (
        <ScrollView contentContainerStyle={{
            backgroundColor: colors.primary[2400],
            flexGrow: 1,
            padding: 20,
        }} >
            <SymbolButton type="Back" onPress={() => navigation.back()} />
            {!showRCI ? (
                <View style={{
                    marginTop: 50,
                }}>
                    <Text style={{
                        color: colors.primary[100],
                        marginBottom: 20,
                        ...texts.H4Bold,
                    }}>{title}</Text>
                    <Form
                        fields={fields}
                        onSubmit={registerMethod}
                    />
                </View>
            ) : (
                <View style={{
                    marginTop: 50,
                }}>
                    <Text style={{
                        color: colors.primary[100],
                        marginBottom: 20,
                        ...texts.H4Bold
                    }}>Enter Verification Code</Text>
                    <RCIInput
                        maxLength={6}
                        onCodeComplete={handleCodeComplete}
                        onPaste={handlePaste}
                        label="Verification Code"
                        placeholder="•"
                    />
                    <Button text="Re send" onPress={() =>setShowRCI(false)}/>
                </View>
            )}
        </ ScrollView>
    );
}