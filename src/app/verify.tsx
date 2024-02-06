import { router } from 'expo-router';
import React, { useRef, useState } from 'react';
import { Text, View, StyleSheet, TextInput, Dimensions, Keyboard, TouchableWithoutFeedback, TouchableOpacity } from 'react-native';
import { encrypt } from '../utils/crypto';
import { useAuth } from '../context/AuthContext';
import { Layout, Symbol, colors, texts, Button, Logo } from 'nobak-native-design-system';


const Verify = () => {
    const { signIn, email } = useAuth();

    const [code, setCode] = useState(new Array(6).fill(''));
    const inputRefs = useRef([]);

    const handleInput = (text, index) => {
        const newCode = [...code];
    
        if (text) {
            // User is typing
            newCode[index] = text;
            setCode(newCode);
            if (index < 5) {
                inputRefs.current[index + 1].focus();
            }
        } else {
            // User hits backspace
            
            if (index > 0) {
                // If it's not the first field, erase and move to the previous field
                newCode[index] = '';
                setCode(newCode);
                inputRefs.current[index - 1].focus();
            } else {
                // If it's the first field, just erase
                newCode[index] = '';
                setCode(newCode);
            }
        }
    };
    
    
    const handleKeyPress = ({ nativeEvent: { key } }, index) => {
        if (key === 'Backspace' && index > 0 && code[index] === '') {
            // If backspace is pressed on an empty field, move to the previous field
            inputRefs.current[index - 1].focus();
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
                <Logo type="LogoFull" />
                <View style={{ marginTop: 24 }}>
                    <TouchableOpacity onPress={() => router.push('/sign_in')}>
                        <Symbol type="Back" />
                    </TouchableOpacity>
                    <View style={{ marginTop: 24 }}>
                        <Text style={{ color: colors.primary[2400], ...texts.H4Bold }}>Enter Code</Text>
                        <Text style={{ color: colors.primary[2000], ...texts.P2Medium }}>Check your email {email}, we just sent you a code to complete the sign in process.</Text>
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
                                onKeyPress={(e) => handleKeyPress(e, index)}
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
