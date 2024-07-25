import React from 'react';
import { View, Button, StyleSheet } from 'react-native';
import { useNavigation, NavigationProp } from '@react-navigation/native';
import Header from '../../components/Header';

type RootStackParamList = {
  Home: undefined;
  FlightRecords: undefined;
  NewFlightLog: undefined; // 新規作成画面のためのルートを追加
};

function HomeScreen() {
  const navigation = useNavigation<NavigationProp<RootStackParamList>>();

  return (
    <View style={styles.container}>
      <Header title="Main Menu" />
      <View style={styles.menuContainer}>
        <Button
          title="OPEN FLIGHT LOG"
          onPress={() => navigation.navigate('FlightRecords')}
        />
        <Button
          title="NEW FLIGHT LOG"
          onPress={() => navigation.navigate('NewFlightLog')}
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  menuContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export default HomeScreen;
