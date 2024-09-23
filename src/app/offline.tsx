import React from 'react';
import { View, Text } from 'react-native';
import { colors, texts, Logo } from 'nobak-native-design-system';

export default function Offline() {

  return (
    <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
      <Logo type="LogoFull" />
      <Text style={{ color: colors.primary[2700], ...texts.H4Bold }}>
        Offline
      </Text>
      <Text style={{ color: colors.primary[2000], ...texts.CaptionBold }}>
        Connection Lost
      </Text>
    </View>
  );
}
