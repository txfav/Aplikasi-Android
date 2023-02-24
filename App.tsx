import React, {useState} from "react";
import { Text, View } from "react-native";
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { AppProvider } from "./src/Auth";

import Utama from "./src/Utama";
import Login from "./src/Login";
import Scanble from "./src/Scanble";


const Stack = createNativeStackNavigator();

function App() {
  return (
    <AppProvider>
      <NavigationContainer>
        <Stack.Navigator 
          initialRouteName="Screen"
          screenOptions={{headerShown: false}}>
          <Stack.Screen name="Home" component={Login}/>
          <Stack.Screen name="Utama" component={Utama}/>
          <Stack.Screen name="Scanble" component={Scanble}/>
        </Stack.Navigator>
      </NavigationContainer>
    </AppProvider>
  );
}

export default App;