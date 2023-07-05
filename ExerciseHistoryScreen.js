import React, { useState, useEffect } from 'react';
import { View, Text, FlatList } from 'react-native';
import styles from './styles';
import * as SQLite from 'expo-sqlite';
import { isoDateToLocale, isDateStringInLocaleFormat } from './utilities';

const db = SQLite.openDatabase('workouts.db');

export const ExerciseHistoryScreen = ({ route }) => {
    const { exerciseName } = route.params;
    const [exerciseHistory, setExerciseHistory] = useState([]);

    useEffect(() => {
        console.log("retrieving workout history for ", exerciseName);
        db.transaction((tx) => {
            tx.executeSql(
                'SELECT * FROM workouts ORDER BY date DESC',
                [],
                (_, { rows: { _array } }) => {
                    console.log("retrieved workout for exercise", exerciseName, _array);
                    const history = [];

                    _array.forEach(workout => {
                        const exercises = JSON.parse(workout.exercises);

                        if (exercises != null) {
                            const foundExercise = exercises.find(
                                (e) => e.name === exerciseName,
                            );

                            if (foundExercise && foundExercise.sets && foundExercise.sets.length > 0) {
                                history.push({
                                    workoutId: workout.id,
                                    date: workout.date,
                                    sets: foundExercise.sets,
                                });
                            }
                        }
                    });

                    setExerciseHistory(history);
                },
                (_, error) => {
                    console.error('EHS Error retrieving workouts from DB:', error);
                }
            );
        });
    }, [exerciseName]);

    return (
        <View style={styles.container}>
            <FlatList
                data={exerciseHistory}
                renderItem={({ item }) => (
                    <View style={styles.historyItem}>
                        <Text style={styles.historyDate}>{isoDateToLocale(item.date)}:</Text>
                        {item.sets && item.sets.map((setReps, index) => (
                            <Text key={index} style={styles.historySet}>
                                Set {index + 1}: {setReps[0]} reps at {setReps[1]} lbs
                            </Text>
                        ))}
                    </View>
                )}
                keyExtractor={(item) => item.workoutId.toString()}
            />
        </View>
    );
};
