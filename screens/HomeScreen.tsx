import React from 'react';
import { View, Text, Button } from 'react-native';

function HomeScreen({ navigation }) {
  return (
    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
      <Text>Home Screen</Text>
      <Button
        title="Go to Details"
        onPress={() => navigation.navigate('Detail')} // 修正: 'Details' -> 'Detail'
      />
      <Button
        title="Add New Record"
        onPress={() => navigation.navigate('AddRecord')}
      />
    </View>
  );
}

export default HomeScreen;
