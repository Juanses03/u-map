import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import Map from './Map'; // Importa MapScreen aquí

const Stack = createStackNavigator();

export default function Main() {
  return (
    <NavigationContainer>
      <Stack.Navigator>
        <Stack.Screen name="Map" component={Map} />
        {/* Agrega más pantallas aquí según sea necesario */}
      </Stack.Navigator>
    </NavigationContainer>
  );
}
