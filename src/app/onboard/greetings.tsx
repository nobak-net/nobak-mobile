import { View, Text, StyleSheet } from 'react-native';
import { colors, texts, Button } from 'nobak-native-design-system';
import AppConfig from '@/src/utils/AppConfig';
import { router } from 'expo-router'
import { WipeData } from '@/src/utils/WipeData';

function onTourComplete() {
    AppConfig.tour = true; // Set the tour as completed
    router.push('/sign_in')
    // Additional logic for after the tour is completed
}

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
const Greetings = () => (
    <View style={styles.container}>
        <Text style={styles.description}>
            Start securing your digital assets with us.
        </Text>
        <Button text="Get Started" onPress={() => onTourComplete()} />
        <Button text="Wipe Data" onPress={() => WipeData()} />

        {/* <Icon name="Analytics" /> */}
    </View>
);

export default Greetings;