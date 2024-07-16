## 不具合2: ナビゲーションスクリーンの設定ミス

### 発生日時
2024-07-16

### 概要
ナビゲーションスクリーンを定義する際に、正しいコンポーネントがナビゲーターに追加されていなかったため、エラーが発生。

### エラーメッセージ
A navigator can only contain 'Screen', 'Group' or 'React.Fragment' as its direct children (found ' '). To render this component in the navigator, pass it in the 'component' prop to 'Screen'.

### 原因
`App.tsx` ファイル内で、`AddRecordScreen` コンポーネントがナビゲーターに追加されていなかった。

### 解決策

`App.tsx`（プロジェクトルート）に `AddRecordScreen` を正しく追加：
```tsx
import 'react-native-gesture-handler';
import * as React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { AppRegistry } from 'react-native';
import { name as appName } from './app.json';

import HomeScreen from './screens/HomeScreen';
import DetailScreen from './screens/DetailScreen';
import AddRecordScreen from './screens/AddRecordScreen'; // 追加

const Stack = createNativeStackNavigator();

function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="Home">
        <Stack.Screen name="Home" component={HomeScreen} />
        <Stack.Screen name="Detail" component={DetailScreen} />
        <Stack.Screen name="AddRecord" component={AddRecordScreen} /> // 追加
      </Stack.Navigator>
    </NavigationContainer>
  );
}

AppRegistry.registerComponent(appName, () => App);

export default App;
```