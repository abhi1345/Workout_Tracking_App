import React, { useCallback } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Ionicons } from '@expo/vector-icons';

import { HomeScreen } from './HomeScreen.js';
import { ExerciseScreen } from './ExerciseScreen.js';
import { WorkoutLogScreen } from './WorkoutLogScreen';
import { ExerciseHistoryScreen } from './ExerciseHistoryScreen.js';
import styles from './styles';
import { useFonts } from 'expo-font';
import * as SplashScreen from 'expo-splash-screen';

const HomeStack = createStackNavigator();

function HomeStackNavigator({ navigation }) {
  return (
    <HomeStack.Navigator
      screenOptions={{
        headerStyle: {
          backgroundColor: '#19162b', // Set the background color of the header
        },
        headerTintColor: '#19162b', // Set this to the color you want for the header title and back button
      }}
      style={styles.topHeader}
    >
      <HomeStack.Screen
        name="Home"
        component={HomeScreen}
        style={styles.topHeader}
        options={{
          // headerShown: false, // Hide the header for the HomeScreen
          title: 'Home', // Set the header title for the HomeScreen
          headerTitleStyle: {
            color: '#fff', // Set the text color for the header title
          },
        }}
      />
      <HomeStack.Screen
        name="Exercise"
        component={ExerciseScreen}
        options={({ route }) => ({
          title: route.params.exercise.name,
          headerStyle: {
            backgroundColor: '#19162b', // Set the background color of the header for the Exercise screen
          },
          headerTintColor: '#fff', // Set the text color for the header for the Exercise screen
        })}
      />
      <HomeStack.Screen
        name="ExerciseHistory"
        component={ExerciseHistoryScreen}
        options={{
          title: 'Exercise History', // Set the title for the ExerciseHistoryScreen
        }}
      />
    </HomeStack.Navigator>
  );
}


const Tab = createBottomTabNavigator();

// SplashScreen.preventAutoHideAsync();

function App() {
  // const [fontsLoaded] = useFonts({
  //   'SFUIDisplay-Heavy': require('./assets/fonts/SFUIDisplay-Heavy.otf'),
  //   'SFUIDisplay-Thin': require('./assets/fonts/SFUIDisplay-Thin.otf'),
  //   'SFUIDisplay-Black': require('./assets/fonts/SFUIDisplay-Black.otf'),
  //   'SFUIDisplay-Bold': require('./assets/fonts/SFUIDisplay-Bold.otf'),
  //   'SFUIDisplay-Light': require('./assets/fonts/SFUIDisplay-Light.otf'),
  //   'SFUIDisplay-Medium': require('./assets/fonts/SFUIDisplay-Medium.otf'),
  //   'SFUIDisplay-Semibold': require('./assets/fonts/SFUIDisplay-Semibold.otf'),
  //   'SFUIDisplay-Ultralight': require('./assets/fonts/SFUIDisplay-Ultralight.otf'),
  // });

  // const onLayoutRootView = useCallback(async () => {
  //   if (fontsLoaded) {
  //     await SplashScreen.hideAsync();
  //   }
  // }, [fontsLoaded]);

  return (
    <NavigationContainer style={styles.bottomNavBar}>
      <Tab.Navigator
        screenOptions={({ route }) => ({
          tabBarActiveTintColor: "#9088eb",
          tabBarInactiveTintColor: "gray",
          tabBarStyle: {
            backgroundColor: '#19162b',
          },
          tabBarIcon: ({ focused, color, size }) => {
            let iconName;

            if (route.name === 'Your Workout') {
              iconName = focused ? 'md-barbell' : 'md-barbell';
            } else if (route.name === 'Workout Log') {
              iconName = focused ? 'ios-list' : 'ios-list';
            }

            // You can return any component that you like here!
            return <Ionicons name={iconName} size={size} color={color} />;
          },
        })}
      >
        <Tab.Screen
          name="Your Workout"
          component={HomeStackNavigator}
          style={styles.bottomNavBar}
          options={{
            tabBarIcon: ({ color, size }) => (
              <Ionicons name="md-barbell" color={color} size={size} />
            ),
            headerShown: false,
          }} />
        <Tab.Screen
          name="Workout Log"
          component={WorkoutLogScreen}
          options={{
            tabBarIcon: ({ color, size }) => (
              <Ionicons name="ios-list" color={color} size={size} />
            ),
            headerStyle: {
              backgroundColor: '#19162b', // Set the background color of the header for the "Workout Log" screen
            },
            headerTitleStyle: {
              color: '#fff', // Set the text color for the header title
            },
          }} />
      </Tab.Navigator>
    </NavigationContainer>
  );
}

export default App;
