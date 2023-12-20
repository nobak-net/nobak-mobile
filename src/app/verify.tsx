import { router } from 'expo-router';
import React, { useRef, useState } from 'react';
import { Text, View, StyleSheet, TextInput, Button, Dimensions, Keyboard, TouchableWithoutFeedback } from 'react-native';
import { encrypt } from '../utils/crypto';
import { useSession } from '../context/AuthContext';


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

            <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
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
            </View>
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
