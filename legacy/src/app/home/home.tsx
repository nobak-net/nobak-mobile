import React from 'react';
import { Link, Stack } from 'expo-router';
import { Image, Text, View } from 'react-native';

interface LogoTitleProps {
    tintColor?: string;
    children?: React.ReactNode
  }
  
  const LogoTitle: React.FC<LogoTitleProps> = ({ tintColor }) => {
      return (
          <Image
              style={{ width: 50, height: 50, tintColor }}
              source={{ uri: 'https://reactnative.dev/img/tiny_logo.png' }}
          />
      );
  };

const Home: React.FC = () => {
    return (
        <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
            <Stack.Screen
                options={{
                    title: 'My home',
                    headerStyle: { backgroundColor: '#f4511e' },
                    headerTintColor: '#fff',
                    headerTitleStyle: {
                        fontWeight: 'bold',
                    },
                    headerTitle: props => <LogoTitle {...props} />,
                }}
            />
            <Text>Home Screen</Text>
            <Link href={{ pathname: 'details', params: { name: 'Bacon' } }}>Go to Details</Link>
        </View>
    );
};

export default Home;
