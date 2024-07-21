import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import HomeScreen from '../presentation/screens/HomeScreen';
import AddRecordScreen from '../presentation/screens/AddRecordScreen';
import DetailScreen from '../presentation/screens/DetailScreen';
import ExportScreen from '../presentation/screens/ExportScreen';

export type RootStackParamList = {
  Home: undefined;
  AddRecord: undefined;
  Detail: { record: any };
  Export: undefined;
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
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default AppNavigator;
