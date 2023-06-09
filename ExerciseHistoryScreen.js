import React, {useState, useEffect} from 'react';
import { View, Text, FlatList } from 'react-native';
import styles from './styles';
import * as SQLite from 'expo-sqlite';

const db = SQLite.openDatabase('workouts.db');

export const ExerciseHistoryScreen = ({ route }) => {
    const { exerciseName } = route.params;
    const [exerciseHistory, setExerciseHistory] = useState([]);

    console.log(exerciseHistory, "EXH");

    useEffect(() => {
        db.transaction((tx) => {
            tx.executeSql(
                'SELECT * FROM workouts',
                [],
                (_, { rows: { _array } }) => {
                    console.log("retrieved workout for exercise", exerciseName, _array);
                    const history = [];

                    _array.forEach(workout => {
                        const exercises = JSON.parse(workout.exercises);

                        console.log("EHS retrieved 1 workout", workout);
                        console.log("EHS retrieved 1 workout exercises", exercises);

                        if (exercises != null) {
                            const foundExercise = exercises.find(
                                (e) => e.name === exerciseName,
                            );

                            console.log("EHS retrieved prev exercise", foundExercise);

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
                    console.log("EHS GOTIT", history, exerciseHistory);
                },
                (_, error) => {
                    console.error('EHS Error retrieving workouts from DB:', error);
                }
            );
        });
    }, [exerciseName]);

    return (
        <View>
            <Text style={styles.historyTitle}>Exercise History:</Text>
            <FlatList
                style={{ maxHeight: '75%' }}
                data={exerciseHistory}
                renderItem={({ item }) => (
                    <View style={styles.historyItem}>
                        <Text style={styles.historyDate}>{item.date}:</Text>
                        {item.sets && item.sets.map((setReps, index) => (
                            <Text key={index}>
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
