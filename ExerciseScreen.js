import React, { useState, useRef, useEffect } from 'react';
import {
    Button, SafeAreaView, TextInput, View, Text, TouchableOpacity, FlatList, ScrollView,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import styles from './styles';

export const ExerciseScreen = ({ route, navigation }) => {
    const { workout, setWorkout, exercise } = route.params;
    const [sets, setSets] = useState(() => exercise.sets || []);
    const [reps, setReps] = useState(() => exercise.reps || '');
    const [weight, setWeight] = useState(() => exercise.weight || '');
    const [exerciseHistory, setExerciseHistory] = useState([]);


    const addSet = () => {
        const numericTextReps = reps.replace(/[^0-9]/g, '');
        const numericTextWeight = weight.replace(/[^0-9.]/g, '');

        if (numericTextReps.trim() !== '' && numericTextWeight.trim() !== '') {
            setSets(prevSets => {
                const newSets = [...prevSets, [parseInt(reps), parseFloat(weight)]];

                const updatedWorkout = workout.map((item) => {
                    if (item.id === exercise.id) {
                        return {
                            ...item,
                            sets: newSets,
                        };
                    }
                    return item;
                });

                route.params.modifyWorkout(updatedWorkout);
                return newSets;
            });
        } else {
            alert('Please enter numbers only.');
        }
    };

    const loadExerciseHistory = async () => {
        try {
            const storedWorkouts = await AsyncStorage.getItem('workouts');
            if (storedWorkouts) {
                const workouts = JSON.parse(storedWorkouts);
                console.log("retrieved workout", workouts);
                const history = [];

                for (const workoutId in workouts) {
                    const workout = workouts[workoutId];
                    console.log("retrieved 1 workout", workout);
                    console.log("retrieved 1 workout exercises", workout.exercises);
                    if (workout.exercises != null) {
                        const foundExercise = workout.exercises.find(
                            (e) => e.name === exercise.name,
                        );


                        console.log("retrieved prev exercise", foundExercise);

                        if (foundExercise && foundExercise.sets && foundExercise.sets.length > 0) {
                            history.push({
                                workoutId: workout.id,
                                date: workout.date,
                                sets: foundExercise.sets,
                            });
                        }
                    }
                }

                setExerciseHistory(history);
            }
        } catch (error) {
            console.error('Error loading exercise history:', error);
        }
    };

    useEffect(() => {
        loadExerciseHistory();
    }, []);



    const firstInputRef = useRef(null);
    const secondInputRef = useRef(null);

    return (
        <SafeAreaView style={styles.safeArea}>
            <View style={styles.inputContainer}>
                <TextInput
                    ref={firstInputRef}
                    placeholder="Add Reps"
                    onChangeText={(text) => {
                        setReps(text);
                        if (text.length == 1 && parseInt(text) > 3
                            || text.length >= 2) { // Replace 2 with your desired limit
                            secondInputRef.current.focus();
                        }
                    }}
                    value={reps}
                    keyboardType="number-pad"
                    style={styles.setRepInput}
                    maxLength={2} // Add this line
                />

                <Text style={styles.repSetText}>Reps</Text>
                <TextInput
                    ref={secondInputRef}
                    placeholder="Add Weight"
                    onChangeText={setWeight}
                    value={weight}
                    keyboardType="decimal-pad"
                    style={styles.setRepInput}
                />
                <Text style={styles.repSetText}>LBS</Text>
            </View>
            <Button title="Add Set" onPress={addSet} />

            <ScrollView style={{ maxHeight: '30%' }}>
                {sets.map((setReps, index) => (
                    <Text key={index}>
                        Set {index + 1}: {setReps[0]} reps at {setReps[1]} lbs
                    </Text>
                ))}
            </ScrollView>
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
                    keyExtractor={(item) => item.workoutId}
                />
            </View>

        </SafeAreaView>
    );
};