import { router } from 'expo-router';
import React, { useRef, useState } from 'react';
import { Text, View, StyleSheet, TextInput, Dimensions, Keyboard, TouchableWithoutFeedback, TouchableOpacity } from 'react-native';
import { encrypt } from '../utils/crypto';
import { useSession } from '../context/AuthContext';
import { Layout, Symbol, colors, texts, Button } from 'nobak-native-design-system';


const Verify = () => {
    const { signIn } = useSession();

    const [code, setCode] = useState(new Array(6).fill(''));
    const inputRefs = useRef([]);

    const handleInput = (text: any, index: any) => {
        const newCode = [...code];
        newCode[index] = text;
        setCode(newCode);

        if (text && index < 5) {
            inputRefs.current[index + 1].focus();
        }
    };

    React.useEffect(() => {
        (async () => {
            const candidateCode = code.join('');
            if (candidateCode.length === 6) {
                await signIn(candidateCode);
            }
        })();
    }, [code]);

    const handlePaste = async () => {
        // const clipboardContent = await Clipboard.getString();
        // if (clipboardContent && clipboardContent.length === 6) {
        //   const newCode = clipboardContent.split('');
        //   setCode(newCode);
        //   inputRefs.current[5].focus();
        // }
    };

    return (
        <TouchableWithoutFeedback onPress={Keyboard.dismiss} accessible={false}>
            <Layout>
                <TouchableOpacity onPress={() => router.push('/sign_in')}>
                    <Symbol type="Back" />
                </TouchableOpacity>
                <View style={{ marginTop: 24 }}>
                    <Text style={{ color: colors.primary[2400], ...texts.H4Bold }}>Enter Code</Text>
                    <Text style={{ color: colors.primary[2000], ...texts.P2Medium }}>Check your email, we just sent you a code to complete the sign in process.</Text>
                </View>
                <View style={styles.container}>
                    <TextInput
                        style={styles.hiddenInput}
                        onContentSizeChange={handlePaste}
                        maxLength={6}
                    />
                    {code.map((digit, index) => (
                        <TextInput
                            key={index}
                            style={styles.input}
                            keyboardType="number-pad"
                            maxLength={1}
                            value={digit}
                            onChangeText={(text) => handleInput(text, index)}
                            ref={(ref) => inputRefs.current[index] = ref}
                        />
                    ))}
                </View>
                <View>
                    <Text style={{ color: colors.primary[2400], ...texts.CaptionBold }}>Having trouble receving your code?</Text>
                    <View style={{ marginTop: 8 }}>
                        <Button text="Resend code" onPress={() => router.push('/sign_in')} />
                    </View>
                </View>
            </Layout>
        </TouchableWithoutFeedback>
    );
};

const styles = StyleSheet.create({
    container: {
        flexDirection: 'row',
        justifyContent: 'space-around',
        padding: 20,
    },
    input: {
        width: 40,
        height: 60,
        borderBottomWidth: 1,
        borderWidth: 1,
        borderRadius: 8,
        textAlign: 'center',
        marginHorizontal: 5,
    },
    hiddenInput: {
        height: 0,
        width: 0,
        opacity: 0,
    },
});

export default Verify;
