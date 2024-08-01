import React from 'react';
import { View, Button, StyleSheet } from 'react-native';
import { useNavigation, NavigationProp } from '@react-navigation/native';
import { RootStackParamList } from '../../navigation/ParamList';
import Header from '../../components/Header';

type HomeScreenNavigationProp = NavigationProp<RootStackParamList, 'Home'>;

const HomeScreen: React.FC = () => {
  const navigation = useNavigation<HomeScreenNavigationProp>();

  return (
    <View style={styles.container}>
      <Header title="Main Menu" />
      <View style={styles.menuContainer}>
        <Button
          title="OPEN FLIGHT LOG"
          onPress={() => navigation.navigate('FlightRecords', { newFileName: undefined })}
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
