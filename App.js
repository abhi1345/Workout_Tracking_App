import React, { useCallback, useEffect, useState } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Ionicons } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import 'react-native-url-polyfill/auto';
import { createClient } from "@supabase/supabase-js";

import { SignInScreen } from './SignInScreen';
import { insertExerciseData, createExerciseTable } from './exerciseDB';
import { HomeScreen } from './HomeScreen.js';
import { ExerciseScreen } from './ExerciseScreen.js';
import { WorkoutLogScreen } from './WorkoutLogScreen';
import { ExerciseHistoryScreen } from './ExerciseHistoryScreen.js';
import styles from './styles';
import { useFonts } from 'expo-font';
import * as SplashScreen from 'expo-splash-screen';

const HomeStack = createStackNavigator();

export const supabase = createClient("https://mvxzzlpznfutepjuqbrx.supabase.co", "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im12eHp6bHB6bmZ1dGVwanVxYnJ4Iiwicm9sZSI6ImFub24iLCJpYXQiOjE2ODg0NTI2MDksImV4cCI6MjAwNDAyODYwOX0.uD4ANRSC2LKE7vkcKarplw5qtEEGToE9hJFdcVb1QWQ", {
  auth: {
    storage: AsyncStorage,
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: false,
  },
});

function HomeStackNavigator({ navigation, fetchedData }) {
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
            fontFamily: 'SFUIDisplay-Medium',
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
          headerStyle: {
            backgroundColor: '#19162b', // Set the background color of the header for the Exercise screen
          },
          headerTintColor: '#fff', // Set the text color for the header for the Exercise screen
        }}
      />
      <HomeStack.Screen
        name="SignIn"
        component={SignInScreen}
      />
    </HomeStack.Navigator>
  );
}


const Tab = createBottomTabNavigator();

// SplashScreen.preventAutoHideAsync();

function App() {

  const [fetchedData, setFetchedData] = useState(null);
  const [isLoading, setIsLoading] = useState(true); // Add this line

  // Load the exercise data from Firebase at the start of the app
  React.useEffect(() => {
    const loadExercises = async () => {
      console.log("loadExercises function is running");
      // Fetch the last updated time from AsyncStorage
      const lastUpdated = await AsyncStorage.getItem('lastUpdated');
      const now = Date.now();

      // Check if an hour has passed since last update
      console.log("Last update", lastUpdated);
      if (!lastUpdated || now - lastUpdated >= 60 * 60 * 1000) {

        // console.log("starting supabase pull");
        const { data, error } = await supabase.from("exercises").select("equipment, name, primary_muscle, type");
        console.log("Pulled exercise data from supabase db");
        const jsonData = data; // Parse JSON string
        // console.log("Pulled exercise jSONdata from supabase db", jsonData);

        // Create table in local db and insert data
        createExerciseTable()
          .then(() => {
            console.log('Table created, inserting data');
            return insertExerciseData(jsonData);
          })
          .then(() => {
            console.log('Data inserted, updating last updated time');
            setFetchedData(jsonData);
            // console.log("We have fetched data", fetchedData);
            setIsLoading(false);
            return AsyncStorage.setItem('lastUpdated', String(now));
          })
          .then(() => {
            console.log('Last updated time saved');
          })
          .catch((error) => {
            setIsLoading(false);
            console.error('Error during database update:', error);
          });
      } else {
        setIsLoading(false);
      }
    };

    loadExercises();
  }, []);  // Run once when the app starts 

  useEffect(() => {
    console.log("Is loading is", isLoading);
  }, [isLoading]);

  const [fontsLoaded] = useFonts({
    'SFUIDisplay-Heavy': require('./assets/fonts/SFUIDisplay-Heavy.otf'),
    'SFUIDisplay-Thin': require('./assets/fonts/SFUIDisplay-Thin.otf'),
    'SFUIDisplay-Black': require('./assets/fonts/SFUIDisplay-Black.otf'),
    'SFUIDisplay-Bold': require('./assets/fonts/SFUIDisplay-Bold.otf'),
    'SFUIDisplay-Light': require('./assets/fonts/SFUIDisplay-Light.otf'),
    'SFUIDisplay-Medium': require('./assets/fonts/SFUIDisplay-Medium.otf'),
    'SFUIDisplay-Semibold': require('./assets/fonts/SFUIDisplay-Semibold.otf'),
    'SFUIDisplay-Ultralight': require('./assets/fonts/SFUIDisplay-Ultralight.otf'),
  });

  const onLayoutRootView = useCallback(async () => {
    if (fontsLoaded) {
      await SplashScreen.hideAsync();
    }
  }, [fontsLoaded]);

  if (isLoading || !fontsLoaded) {
    return null; // Render nothing until the fonts+exercises are loaded
  }

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
          // Pass the fetched data to your HomeStackNavigator as a prop
          children={() => <HomeStackNavigator fetchedData={fetchedData} />}
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
              fontFamily: 'SFUIDisplay-Medium',
            },
          }} />
        {/* <Tab.Screen
          name="Your Programs"
          component={YourProgramsScreen}
          options={{
            tabBarIcon: ({ color, size }) => (
              <Ionicons name="calendar-outline" color={color} size={size} />
            ),
            headerStyle: {
              backgroundColor: '#19162b', // Set the background color of the header for the "Workout Log" screen
            },
            headerTitleStyle: {
              color: '#fff', // Set the text color for the header title
              fontFamily: 'SFUIDisplay-Medium',
            },
          }} /> */}
      </Tab.Navigator>
    </NavigationContainer>
  );
}

export default App;
