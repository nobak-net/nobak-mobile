import React from 'react';
import { View, Text, StyleSheet, TextInput, Button } from 'react-native';
import { Link, Stack, withLayoutContext, router } from 'expo-router';

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

export default function Index() {
    return (
        <View>
            <Text style={styles.title}>Welcome</Text>
            <Text style={styles.description}>
                Start securing your digital assets with us.
            </Text>
            <Button title="Back" onPress={() => router.push('/')} />
            <Button title="Get Started" onPress={() => { }} />
        </View>
    )
};