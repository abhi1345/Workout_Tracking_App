import React, { useState, useEffect, useCallback } from 'react';
import { Platform, SafeAreaView, TextInput, ScrollView, View, Text, FlatList, TouchableOpacity, TouchableWithoutFeedback, Keyboard, KeyboardAvoidingView } from 'react-native';
import { formatTimeSeconds } from './utilities';
import Swipeable from 'react-native-gesture-handler/Swipeable';
import * as SQLite from 'expo-sqlite';

import styles from './styles';

const db = SQLite.openDatabase('workouts.db');

export const HomeScreen = ({ navigation }) => {
    const [workout, setWorkout] = useState([]);
    const [numExercises, setNumExercises] = useState(0);

    const [exerciseInput, setExerciseInput] = useState('');
    const [filteredExercises, setFilteredExercises] = useState([]);

    const [timerRunning, setTimerRunning] = useState(false);
    const [workoutStartTime, setWorkoutStartTime] = useState(null);
    const [elapsedTime, setElapsedTime] = useState(0);
    const [timerVisible, setTimerVisible] = useState(false);

    const exerciseList = [
        { name: 'Back Squat' },
        { name: 'Barbell Bench Press' },
        { name: 'Conventional Deadlift' },
        { name: 'Sumo Deadlift' },
        { name: 'Overhead Press' },
        { name: 'Barbell Row' },
        { name: 'Leg Press' },
        { name: 'Bicep Curl' },
    ];

    const filterExercises = (text) => {
        if (text === '') {
            setFilteredExercises([]);
        } else {
            const filtered = exerciseList.filter((item) => item.name.toLowerCase().includes(text.toLowerCase()));
            setFilteredExercises(filtered);
        }
    };

    const handleInputChange = (text) => {
        setExerciseInput(text);
        filterExercises(text);
    };

    const startWorkout = () => {
        if (!timerRunning) {
            setElapsedTime(0);
            setWorkoutStartTime(new Date());
            setTimerRunning(true);
            setTimerVisible(true);
        }
    };

    const addExercise = () => {
        const newExercise = {
            id: numExercises,
            name: exerciseInput,
            sets: null,
            reps: null,
            weight: null,
        };

        if (exerciseInput.trim() === '') {
            alert('Please enter a valid exercise name.');
            return;
        }

        setWorkout((prevWorkout) => [...prevWorkout, newExercise]);
        setExerciseInput('');
        setNumExercises(numExercises + 1);
    };

    const removeExercise = (exerciseId) => {
        console.log("removing exercise", exerciseId,
            workout.find((exercise) => exercise.id !== exerciseId));
        const updatedWorkout = workout.filter((exercise) => exercise.id !== exerciseId);
        setWorkout(updatedWorkout);
    };

    const addExerciseWithInput = (text) => {
        const newExercise = {
            id: numExercises,
            name: text,
            sets: null,
            reps: null,
            weight: null,
        };

        if (text.trim() === '') {
            alert('Please enter a valid exercise name.');
            return;
        }

        setWorkout((prevWorkout) => [...prevWorkout, newExercise]);
        setExerciseInput('');
        setNumExercises(numExercises + 1);
    };

    const clearExercises = () => {
        setWorkout([]);
    };

    const saveWorkout = async () => {
        let duration = 0;
        if (workoutStartTime) {
            const endTime = new Date();
            duration = Math.floor((endTime - workoutStartTime) / 1000); // Duration in seconds
            console.log("duration is", duration);
        }

        if (workout.length === 0) {
            alert('No exercises to save. Add exercises before saving the workout.');
            return;
        }


        const workoutData = {
            id: `workout-${Date.now()}`,
            date: new Date().toLocaleString(),
            exercises: JSON.stringify(workout),
            workoutDuration: duration,
        };
        console.log("Creating workout data with data", workoutData);

        try {
            db.transaction((tx) => {
                tx.executeSql(
                    'CREATE TABLE IF NOT EXISTS workouts (id INTEGER PRIMARY KEY AUTOINCREMENT, date TEXT, exercises TEXT, workoutDuration INT);',
                    [],
                    () => console.log('Table created successfully')
                );
                tx.executeSql(
                    'INSERT INTO workouts (date, exercises, workoutDuration) VALUES (?, ?, ?)',
                    [workoutData.date, workoutData.exercises, workoutData.workoutDuration],
                    () => {
                        console.log("Saved workout data with data", workoutData);
                    },
                    (_, error) => {
                        console.error('Error saving workout:', error);
                        alert('Error saving workout.');
                    }
                );
            });

            // Clear the current workout
            setWorkout([]);

            alert('Workout saved successfully.');

        } catch (error) {
            console.error('Error saving workout:', error);
            alert('Error saving workout.');
        }
        setWorkoutStartTime(null);
        setTimerRunning(false);
        setTimerVisible(false);
        console.log("Cleared workout timer");
    };

    useEffect(() => {
        let intervalId;

        if (timerVisible) {
            intervalId = setInterval(() => {
                setElapsedTime(Math.floor((new Date() - workoutStartTime) / 1000));
            }, 1000);
        }

        return () => {
            clearInterval(intervalId);
        };
    }, [timerVisible, workoutStartTime]);

    return (
        <KeyboardAvoidingView
            behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
            style={styles.container}
        >
            <TouchableWithoutFeedback onPress={Keyboard.dismiss}
            >
                <SafeAreaView style={styles.safeArea}>
                    <TouchableOpacity
                        style={[
                            styles.startWorkoutButton,
                            timerRunning ? styles.startWorkoutButtonDisabled : null,
                        ]}
                        onPress={startWorkout}
                        disabled={timerRunning}
                    >
                        <Text style={styles.startWorkoutButtonText}>Start Workout Timer</Text>
                    </TouchableOpacity>
                    <View>
                        {timerVisible && (
                            <View style={styles.timerText}>
                                <Text>{formatTimeSeconds(elapsedTime)}</Text>
                            </View>
                        )}
                    </View>
                    <View style={styles.inputContainer}>
                        <TextInput
                            style={styles.input}
                            placeholder="Type an exercise, then click Add"
                            onChangeText={handleInputChange}
                            value={exerciseInput}
                        />
                        <CardButton style={styles.addExerciseCardButton} title="Add" onPress={addExercise} />
                    </View>
                    {filteredExercises.length > 0 && (
                        <FlatList
                            keyboardShouldPersistTaps='handled'
                            data={filteredExercises}
                            renderItem={({ item }) => (
                                <TouchableOpacity
                                    onPress={() => {
                                        setFilteredExercises([]);
                                        addExerciseWithInput(item.name);
                                        Keyboard.dismiss();
                                    }}
                                    style={styles.dropdownItem}
                                >
                                    <Text style={styles.dropdownText}>{item.name}</Text>
                                </TouchableOpacity>
                            )}
                            keyExtractor={(item) => item.name}
                            style={[styles.dropdown]}
                        />
                    )}

                    <View style={{ maxHeight: '50%' }}>
                        <FlatList
                            data={workout}
                            renderItem={({ item }) => (
                                <Card
                                    exercise={item}
                                    onPress={() =>
                                        navigation.navigate('Exercise', {
                                            exercise: item,
                                            workout: workout,
                                            setWorkout: setWorkout,
                                            // saveExerciseData: saveExerciseData, // Pass the callback function
                                        })
                                    }
                                    onDelete={() => removeExercise(item.id)}
                                />
                            )}
                            keyExtractor={(item) => item.id}
                        />
                    </View>
                    <CardButton title="Clear exercises" onPress={clearExercises} />
                    <TouchableOpacity
                        style={[
                            styles.saveWorkoutButton,
                            !timerRunning ? styles.saveWorkoutButtonDisabled : null,
                        ]}
                        onPress={!timerRunning ? null : saveWorkout}
                    >
                        <Text
                            style={styles.saveWorkoutButtonText}
                        >Save Workout</Text>
                    </TouchableOpacity>
                </SafeAreaView>
            </TouchableWithoutFeedback>
        </KeyboardAvoidingView>
    );
};

const Card = ({ exercise, onPress, onDelete }) => {

    const RightSwipeActions = () => {
        return (
            <CardDeleteButton title="Delete" style={styles.cardDeleteButton} onPress={onDelete} />
        );
    };

    const swipeFromRightOpen = () => {
        console.log('Swiped from right');
    };

    return (
        <Swipeable
            renderLeftActions={null}
            renderRightActions={RightSwipeActions}
            onSwipeableRightOpen={swipeFromRightOpen}
            disableLeftSwipe={true}
            leftThreshold={1}
        >
            <TouchableOpacity style={styles.card} onPress={onPress}>
                <Text style={{ flexDirection: 'row' }}>
                    <Text style={styles.cardText}>{exercise.name} </Text>
                    <Text style={{ color: 'gray' }}> (click to add sets)</Text>
                </Text>
                <View>
                    {exercise.sets !== null && exercise.sets.map((setReps, index) => (
                        <Text key={index}>
                            Set {index + 1}: {setReps[0]} reps at {setReps[1]} lbs
                        </Text>
                    ))}
                </View>
            </TouchableOpacity>
        </Swipeable>
    );
};

const CardButton = ({ title, onPress }) => {
    return (
        <TouchableOpacity onPress={onPress} style={styles.cardButton}>
            <Text style={styles.cardButtonText}>{title}</Text>
        </TouchableOpacity>
    );
};

const CardDeleteButton = ({ title, onPress }) => {
    return (
        <TouchableOpacity onPress={onPress} style={styles.cardDeleteButton}>
            <Text style={styles.swipeActionText}>{title}</Text>
        </TouchableOpacity>
    );
};
