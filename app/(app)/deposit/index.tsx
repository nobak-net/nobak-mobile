import React, { useState, useEffect } from 'react';
import { Text, View } from 'react-native';
import { Button, Layout, colors, texts, QR } from 'nobak-native-design-system';
import { router } from 'expo-router'

function Index() {
  return (
    <Layout style={{ backgroundColor: colors.primary[2400], gap: 12 }}>
      <View>
        <Text style={{ color: colors.primary[200], ...texts.H4Bold }}>Deposit:</Text>
          <QR value="https://funskill.cc" size={300} bgColor={colors.primary[1900]} fgColor={colors.primary[100]} />


        <Button buttonStyle={{ variant: 'secondary', size: 'large', full: true }} size="small" text="By crypto network" onPress={() => router.push('/(app)/deposit/networks/')} />
      </View>
    </Layout>
  );
}


export default Index;