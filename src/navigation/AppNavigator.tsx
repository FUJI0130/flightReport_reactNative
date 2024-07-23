import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import HomeScreen from '../presentation/screens/HomeScreen';
import AddRecordScreen from '../presentation/screens/AddRecordScreen';
import DetailScreen from '../presentation/screens/DetailScreen';
import ExportScreen from '../presentation/screens/ExportScreen';
import FlightRecordsScreen from '../presentation/screens/FlightRecordsScreen'; // 追加
// import InspectionRecordScreen from '../presentation/screens/InspectionRecordScreen'; // 後で追加予定
// import MaintenanceRecordScreen from '../presentation/screens/MaintenanceRecordScreen'; // 後で追加予定

export type RootStackParamList = {
  Home: undefined;
  AddRecord: undefined;
  Detail: { record: any };
  Export: undefined;
  FlightRecords: undefined;
  // InspectionRecord: undefined; // 後で追加予定
  // MaintenanceRecord: undefined; // 後で追加予定
};

const Stack = createStackNavigator<RootStackParamList>();

const AppNavigator = () => {
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="Home">
        <Stack.Screen name="Home" component={HomeScreen} />
        <Stack.Screen name="FlightRecords" component={FlightRecordsScreen} /> 
        <Stack.Screen name="AddRecord" component={AddRecordScreen} />
        <Stack.Screen name="Detail" component={DetailScreen} />
        <Stack.Screen name="Export" component={ExportScreen} />
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default AppNavigator;
