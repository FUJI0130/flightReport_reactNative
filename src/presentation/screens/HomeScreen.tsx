import React from 'react';
import { View, Button, StyleSheet } from 'react-native';
import { useNavigation, NavigationProp } from '@react-navigation/native';
import Header from '../../components/Header';

type RootStackParamList = {
  Home: undefined;
  FlightRecords: undefined;
  // InspectionRecord: undefined; // 後で追加予定
  // MaintenanceRecord: undefined; // 後で追加予定
};

function HomeScreen() {
  const navigation = useNavigation<NavigationProp<RootStackParamList>>();

  return (
    <View style={styles.container}>
      <Header title="Main Menu" />
      <View style={styles.menuContainer}>
        <Button
          title="Flight Records"
          onPress={() => navigation.navigate('FlightRecords')}
        />
        {/* 後で追加予定 */}
        {/* <Button
          title="Inspection Record"
          onPress={() => navigation.navigate('InspectionRecord')}
        />
        <Button
          title="Maintenance Record"
          onPress={() => navigation.navigate('MaintenanceRecord')}
        /> */}
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
