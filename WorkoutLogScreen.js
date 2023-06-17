import React, { useState, useEffect, useCallback } from 'react';
import { SafeAreaView, View, Text, FlatList, TouchableOpacity } from 'react-native';
import { useFocusEffect } from '@react-navigation/native';
import * as SQLite from 'expo-sqlite';

import { formatTimeSeconds, isoDateToLocale, isDateStringInLocaleFormat, localeDateStringToISO } from './utilities';
import styles from './styles';

const db = SQLite.openDatabase('workouts.db');

export const WorkoutLogScreen = () => {
  const [savedWorkouts, setSavedWorkouts] = useState([]);

  const updateDateInDatabase = (workoutId, newDate) => {
    db.transaction(tx => {
        tx.executeSql(
            'UPDATE workouts SET date = ? WHERE id = ?',
            [newDate, workoutId],
            (_, result) => {
                console.log(`Successfully updated date for workout id ${workoutId}`);
            },
            (_, err) => {
                console.error(`Error updating date for workout id ${workoutId}: ${err}`);
            }
        );
    });
};

  const loadWorkouts = useCallback(() => {

    try {
      db.transaction(tx => {
        tx.executeSql(
          'CREATE TABLE IF NOT EXISTS workouts (id INTEGER PRIMARY KEY AUTOINCREMENT, date TEXT, exercises TEXT, workoutDuration INT);',
          [],
          () => console.log('Table created successfully')
        );
        tx.executeSql(
          'SELECT * FROM workouts ORDER BY date DESC',
          [],
          (_, result) => {
            const rows = result.rows;
            let data = [];

            for (let i = 0; i < rows.length; i++) {
              let workout = rows.item(i);

              let workoutDate = workout.date;
              // If the date is not in ISO format, convert it
              if (isDateStringInLocaleFormat(workout.date)) {
                workoutDate = localeDateStringToISO(workout.date);
                updateDateInDatabase(workout.id, workoutDate);
              }

              try {
                // Try to parse the exercises string
                const parsedExercises = JSON.parse(workout.exercises);

                // If parsing was successful, add the workout to the data array
                data.push({ id: workout.id, date: workout.date, exercises: parsedExercises, workoutDuration: workout.workoutDuration });
              } catch (error) {
                console.log('Failed to parse exercises string for workout id ' + workout.id);
                // If parsing failed, you could add the workout with the unparsed exercises string
                // or you could just skip this workout
                // This example skips the workout:
                continue;
              }
            }

            setSavedWorkouts(data);
          },
          (_, err) => {
            console.error(`Error: ${err}`);
          },
        );
      });
    } catch (err) {
      console.error(err);
    }

  }, []);


  useFocusEffect(loadWorkouts);

  const deleteWorkout = async (workoutId) => {
    try {
      db.transaction((tx) => {
        tx.executeSql('DELETE FROM workouts WHERE id = ?', [workoutId], () => {
          console.log('Workout deleted:', workoutId);
          loadWorkouts();
        });
      });
    } catch (error) {
      console.error('Error deleting workout:', error);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <FlatList
        data={savedWorkouts}
        renderItem={({ item }) => {
          const { id, date, exercises, workoutDuration } = item;
          console.log("Retrieved exercises in db", exercises, typeof (exercises));

          return (
            <View style={styles.card}>
              <View style={styles.cardHeader}>
                <Text style={styles.cardTitle}>Workout - {isoDateToLocale(date)}</Text>
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
                <TouchableOpacity style={styles.deleteButtonCard} onPress={() => deleteWorkout(id)}>
                  <Text style={styles.deleteButton}>Delete</Text>
                </TouchableOpacity>
              </View>
            </View>
          );
        }}
        keyExtractor={(item) => item.id.toString()}
      />
    </SafeAreaView>
  );
};
