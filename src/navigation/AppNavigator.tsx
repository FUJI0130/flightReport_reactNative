import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import HomeScreen from '../presentation/screens/HomeScreen';
import AddRecordScreen from '../presentation/screens/AddRecordScreen';
import DetailScreen from '../presentation/screens/DetailScreen';
import ExportScreen from '../presentation/screens/ExportScreen';
// import InspectionRecordScreen from '../presentation/screens/InspectionRecordScreen'; // 後で追加予定
// import MaintenanceRecordScreen from '../presentation/screens/MaintenanceRecordScreen'; // 後で追加予定

export type RootStackParamList = {
  Home: undefined;
  AddRecord: undefined;
  Detail: { record: any };
  Export: undefined;
  // InspectionRecord: undefined; // 後で追加予定
  // MaintenanceRecord: undefined; // 後で追加予定
};

const Stack = createStackNavigator<RootStackParamList>();

const AppNavigator = () => {
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="Home">
        <Stack.Screen name="Home" component={HomeScreen} />
        <Stack.Screen name="AddRecord" component={AddRecordScreen} />
        <Stack.Screen name="Detail" component={DetailScreen} />
        <Stack.Screen name="Export" component={ExportScreen} />
        {/* 後で追加予定 */}
        {/* <Stack.Screen name="InspectionRecord" component={InspectionRecordScreen} /> */}
        {/* <Stack.Screen name="MaintenanceRecord" component={MaintenanceRecordScreen} /> */}
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default AppNavigator;
