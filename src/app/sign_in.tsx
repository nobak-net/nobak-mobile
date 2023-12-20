import { router } from 'expo-router';
import * as React from 'react';
import { Text, View, StyleSheet, TextInput, Button, Dimensions, Keyboard, TouchableWithoutFeedback } from 'react-native';
import { encrypt } from '../utils/crypto';
import { useSession } from '../context/AuthContext';
import { runFetch } from '../utils/runFetch';

// const sendEmailToAPI = async (email: string) => {
//   try {
//     const { response, isLoading } =await  useFetch('http://192.168.1.106:8781/auth/email', 'POST', JSON.stringify({ payload: email, type: 'OBJECT' }))

//     console.log('response', response)
//     // const response = await fetch('http://192.168.1.106:8781/auth/email', {
//     //   method: 'POST',
//     //   headers: {
//     //     'Content-Type': 'application/json',
//     //   },
//     //   body: JSON.stringify({ payload: email, type: 'OBJECT' }),
//     // });

//     // if (response !== null) {
//     //   // const jsonResponse = await response.json();
//     //   // Handle response here
//     //   // console.log('jsonResponse', jsonResponse)
//     //   router.replace('/verify');
//     // } else {
//     //   // Handle HTTP errors
//     //   alert('Error sending email');
//     // }
//   } catch (error) {
//     // Handle network errors
//     alert('Network error');
//   }
// };

export default function SignIn() { 
  const { emailChallenge } = useSession();

  // const fetchData = async () => {
  //   const resp = await fetch("http://192.168.1.106:8781/info");
  //   const data = await resp.json();
  // };

  const [email, setEmail] = React.useState('');

  const handleSendEmail = async () => {
    if (email) {
      const payload = encrypt({ email: email }, 'ThisIs32BytesLongSecretForAES!!!')
      const response = await runFetch('http://192.168.1.106:8782/auth/email', 'POST', JSON.stringify({ payload, type: 'OBJECT' }));
      // console.log('response', response)
      if (response.status === 200) {
        router.replace('/verify');
      }
    } else {
      // handle empty email field, maybe show an alert
      alert('Please enter an email');
    }
  };

  return (
    <TouchableWithoutFeedback onPress={Keyboard.dismiss} accessible={false}>
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <View style={styles.container}>
          <View>
            <TextInput
              style={styles.input}
              placeholder="Enter your email"
              inputMode="email"
              value={email}
              onChangeText={setEmail}
            />
          </View>
          <Button title="Send Email" onPress={handleSendEmail} />
        </View>
        {/* <Text
        onPress={() => {
          signIn();
          // Navigate after signing in. You may want to tweak this to ensure sign-in is
          // successful before navigating.
          router.replace('/');
        }}>
        Sign In
      </Text> */}
      </View>
    </TouchableWithoutFeedback>

  );
}

const halfWindowsWidth = Dimensions.get('window').width / 1.2

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 10,
  },
  input: {
    width: halfWindowsWidth,
    borderWidth: 1,
    borderColor: 'gray',
    padding: 10,
    marginBottom: 10,
  },
});
