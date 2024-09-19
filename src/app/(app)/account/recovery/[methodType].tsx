// components/MethodType.tsx

import React, { useState } from 'react';
import { Text, View, Alert, ScrollView, StyleSheet } from "react-native";
import { Button, SymbolButton } from 'nobak-native-design-system';
import navigation from "@/src/utils/Navigation";
import { useRequiredParams } from "@/src/hooks/useRequiredParams";
import { usePasswordPrompt } from "@/src/hooks/usePasswordPrompt";
import { colors, texts, Form, RCIInput  } from 'nobak-native-design-system';

export default function MethodType() {
    const { methodType } = useRequiredParams<{ methodType: string }>(['methodType']) as { methodType: string };
    const { promptPassword } = usePasswordPrompt();
    const [showRCI, setShowRCI] = useState(false);
    const [contactInfo, setContactInfo] = useState('');

    console.log('methodType', methodType);

    // Determine the type based on methodType
    const isEmail = methodType === 'email';
    const isPhoneNumber = methodType === 'phone_number';

    // Dynamic texts based on methodType
    const title = isEmail ? 'Enter Your Email' : isPhoneNumber ? 'Enter Your Phone Number' : 'Enter Your Contact Info';
    const placeholder = isEmail ? 'example@email.com' : isPhoneNumber ? '+1234567890' : 'Enter contact info';
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
    // Handle form submission
    const sendContactInfo = async (formData: { [key: string]: any }) => {
        const info = isEmail ? formData.email : isPhoneNumber ? formData.phone_number : formData.contact_info;

        // TODO: Implement your email or phone number sending logic here
        // For demonstration, we'll assume it's successful
        setContactInfo(info);
        setShowRCI(true);
        Alert.alert('Success', alertMessage(info));
    };

    // Handle RCIInput code completion
    const handleCodeComplete = (code: string) => {
        // TODO: Implement your code verification logic here
        Alert.alert('Code Entered', `Your code is: ${code}`);
        // Navigate or perform other actions as needed
    };

    // Handle paste event if needed
    const handlePaste = (code: string) => {
        // Handle pasted code if needed
        console.log('Pasted code:', code);
    };

    return (
        <ScrollView contentContainerStyle={styles.container}>
            <SymbolButton type="Back" onPress={() => navigation.back()} />
            {!showRCI ? (
                <View style={styles.formContainer}>
                    <Text style={styles.title}>{title}</Text>
                    <Form
                        fields={fields}
                        onSubmit={sendContactInfo}
                    />
                </View>
            ) : (
                <View style={styles.rciContainer}>
                    <Text style={styles.title}>Enter Verification Code</Text>
                    <RCIInput
                        maxLength={6}
                        onCodeComplete={handleCodeComplete}
                        onPaste={handlePaste}
                        label="Verification Code"
                        placeholder="•"
                    />
                </View>
            )}
        </ScrollView>
    );
}

const styles = StyleSheet.create({
    container: {
        backgroundColor: colors.primary[2400],
        flexGrow: 1,
        padding: 20,
    },
    formContainer: {
        marginTop: 50,
    },
    rciContainer: {
        marginTop: 50,
    },
    title: {
        fontSize: 24,
        color: colors.white,
        marginBottom: 20,
        textAlign: 'center',
        ...texts.H2Bold,
    },
});