import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Ionicons } from '@expo/vector-icons';

import { HomeScreen } from './HomeScreen.js';
import { ExerciseScreen } from './ExerciseScreen.js';
import { WorkoutLogScreen } from './WorkoutLogScreen';


// const Stack = createStackNavigator();
const HomeStack = createStackNavigator();

function HomeStackNavigator({ navigation }) {
  return (
    <HomeStack.Navigator>
      <HomeStack.Screen
        name="Home"
        component={HomeScreen}
        options={{
          headerShown: false, // Hide the header for the HomeScreen
        }}
      />
      <HomeStack.Screen
        name="Exercise"
        component={ExerciseScreen}
        options={({ route }) => ({
          title: route.params.exercise.name,
        })}
      />
    </HomeStack.Navigator>
  );
}

const Tab = createBottomTabNavigator();

function App() {
  return (
    <NavigationContainer>
      <Tab.Navigator>
        <Tab.Screen name="Your Workout" component={HomeStackNavigator} options={{
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="md-barbell" color={color} size={size} />
          ),
        }} />
        <Tab.Screen name="Workout Log" component={WorkoutLogScreen} options={{
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="ios-list" color={color} size={size} />
          ),
        }} />
      </Tab.Navigator>
    </NavigationContainer>
  );
}

export default App;
