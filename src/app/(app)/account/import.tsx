// app/account/import.tsx
import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import navigation from '@/src/utils/Navigation';

const ImportAccount: React.FC = () => {
  const handleBack = () => {
    navigation.back();
  };

  return (
    <View style={styles.container}>
      <Text style={styles.text}>Import Account </Text>
      {/* Add your import account logic here */}
      {/* Include a back button if needed */}
      {/* <Button title="Back" onPress={handleBack} /> */}
    </View>
  );
};

export default ImportAccount;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center', // Center vertically
    alignItems: 'center',     // Center horizontally
  },
  text: {
    fontSize: 18,
  },
});