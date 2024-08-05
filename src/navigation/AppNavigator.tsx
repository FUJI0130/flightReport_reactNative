import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import HomeScreen from '../presentation/screens/HomeScreen';
import AddRecordScreen from '../presentation/screens/AddRecordScreen';
import DetailScreen from '../presentation/screens/DetailScreen';
import FlightRecordsScreen from '../presentation/screens/FlightRecordsScreen';
import NewFlightLogScreen from '../presentation/screens/NewFlightLogScreen'; // 新規作成画面を追加
import FlightTimerScreen from '../presentation/screens/FlightTimerScreen';

import { RootStackParamList } from './ParamList';


const Stack = createStackNavigator<RootStackParamList>();

const AppNavigator = () => {
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="Home">
        <Stack.Screen name="Home" component={HomeScreen} />
        <Stack.Screen name="FlightRecords" component={FlightRecordsScreen} />
        <Stack.Screen name="AddRecord" component={AddRecordScreen} />
        <Stack.Screen name="Detail" component={DetailScreen} />
        <Stack.Screen name="NewFlightLog" component={NewFlightLogScreen} />
        <Stack.Screen name="FlightTimer" component={FlightTimerScreen} />
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default AppNavigator;
