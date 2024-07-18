import React from 'react';
import { View, Text } from 'react-native';
import { RouteProp, useRoute } from '@react-navigation/native';

type Record = {
  key: string;
  details: string | null;
};

type RootStackParamList = {
  Home: undefined;
  Detail: { record: Record };
  AddRecord: undefined;
};

type DetailScreenRouteProp = RouteProp<RootStackParamList, 'Detail'>;

const DetailScreen: React.FC = () => {
  const route = useRoute<DetailScreenRouteProp>();
  const { record } = route.params;

  return (
    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
      <Text>Detail Screen</Text>
      <Text>Key: {record.key}</Text>
      <Text>Details: {record.details}</Text>
    </View>
  );
};

export default DetailScreen;
