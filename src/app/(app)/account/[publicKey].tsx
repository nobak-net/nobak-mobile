import { Text, View } from "react-native";
import { Button } from 'nobak-native-design-system';
import { useLocalSearchParams, router } from 'expo-router';
import { useEffect } from 'react';
import { formatPublicKey } from '../../../utils/StellarUtils';

export default function AccountDetails() {
    const { publicKey } = useLocalSearchParams();

    useEffect(() => {
        // If publicKey is undefined, go back
        if (!publicKey) {
            router.back();
        }
    }, [publicKey]);

    return (
        <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
            <Text>Account Details for: {formatPublicKey(publicKey as string)}</Text>
            
            {/* Button to go back */}
            <Button text="Go Back" onPress={() => router.back()} />
        </View>
    );
}