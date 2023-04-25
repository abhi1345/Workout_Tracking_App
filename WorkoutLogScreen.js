import React, { useState, useEffect, useCallback } from 'react';
import { SafeAreaView, View, Text, FlatList, TouchableOpacity } from 'react-native';
import { useFocusEffect } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { formatTimeSeconds } from './utilities';

import styles from './styles';

export const WorkoutLogScreen = () => {
    const [savedWorkouts, setSavedWorkouts] = useState([]);
  
    useFocusEffect(
      useCallback(() => {
        const loadWorkouts = async () => {
          const workouts = await AsyncStorage.getItem('workouts');
          if (workouts) {
            setSavedWorkouts(JSON.parse(workouts));
          }
        };
  
        loadWorkouts();
      }, [])
    );
  
    const deleteWorkout = async (workoutId) => {
      try {
        const allWorkouts = await AsyncStorage.getItem('workouts');
        let workouts = JSON.parse(allWorkouts);
  
        if (workouts) {
          console.log("Deleting workout: ", workouts[workoutId]);
          delete workouts[workoutId];
          await AsyncStorage.setItem('workouts', JSON.stringify(workouts));
          setSavedWorkouts(workouts);
        }
      } catch (error) {
        console.error('Error deleting workout:', error);
      }
    };
  
  
    useEffect(() => {
      const fetchWorkouts = async () => {
        try {
          const allWorkouts = await AsyncStorage.getItem('workouts');
          setSavedWorkouts(JSON.parse(allWorkouts));
        } catch (error) {
          console.error('Error fetching workouts:', error);
        }
      };
  
      fetchWorkouts();
    }, []);
  
  
    // Render your workout data here
    return (
      <SafeAreaView style={styles.container}>
        <FlatList
          data={Object.entries(savedWorkouts)}
          renderItem={({ item }) => {
            const [workoutId, workoutData] = item;
            const { id, date, exercises, workoutDuration } = workoutData;
  
            if (!exercises || !date || !id) {
              return null;
            }
  
            if (!workoutDuration) {
              console.log("cant find duration");
            }
  
            const formattedDate = String(date);
  
            return (
              <View style={styles.card}>
                <View style={styles.cardHeader}>
                  <Text style={styles.cardTitle}>Workout - {formattedDate}</Text>
                </View>
                <Text style={styles.cardItem}>Duration: {formatTimeSeconds(workoutDuration)}</Text>
                {exercises.map((exercise, index) => (
                  <Text style={styles.cardItem} key={index}>
                    {exercise.name} {'\n'}
                    {exercise.sets !== null &&
                      Array.isArray(exercise.sets) &&
                      exercise.sets.map((setReps, index) => (
                        <Text key={index}>
                          {'\t'}Set {index + 1}: {setReps[0]} reps at {setReps[1]} lbs {'\n'}
                        </Text>
                      ))}
                  </Text>
                ))}
                <View style={styles.deleteButtonContainer}>
                  <TouchableOpacity style={styles.deleteButtonCard} onPress={() => deleteWorkout(workoutId)}>
                    <Text style={styles.deleteButton}>Delete</Text>
                  </TouchableOpacity>
                </View>
              </View>
            );
          }}
          keyExtractor={(item) => item[0]}
        />
      </SafeAreaView>
    );
  };