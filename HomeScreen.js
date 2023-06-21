import React, { useState, useEffect, useCallback } from 'react';
import { Platform, SafeAreaView, TextInput, ScrollView, View, Text, FlatList, TouchableOpacity, TouchableWithoutFeedback, Keyboard, KeyboardAvoidingView } from 'react-native';
import { formatTimeSeconds, localeDateStringToISO, isDateStringInLocaleFormat } from './utilities';
import Swipeable from 'react-native-gesture-handler/Swipeable';
import * as SQLite from 'expo-sqlite';
import { exerciseData } from './ExerciseList.js';
import { createExerciseTable, insertExerciseData, checkExerciseTableAccurate } from './exerciseDB.js';
import fetch from 'isomorphic-fetch';
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

    const [exerciseList, setExerciseList] = useState([]);
    const [justAddedExercise, setJustAddedExercise] = useState(false);


    const HARDCREATEEXERCISES = true;

    const filterExercises = async (text) => {
        if (text === '') {
            setFilteredExercises([]);
        } else {
            // const semanticMatches = [];
            // try {
            //     const url = `http://localhost:5003/?name=${text}`;
            //     const response = await fetch(url);
            //     const data = await response.text(); // Extract response as text
            //     const jsonData = JSON.parse(data); // Parse JSON string

            //     for (let i = 0; i < jsonData.matches.length; i++) {
            //         semanticMatches.push(jsonData.matches[i]["id"]);
            //     }

            // } catch (error) {
            //     console.error(error);
            // }

            const filtered = exerciseList.filter((item) => item.name.toLowerCase().includes(text.toLowerCase()));
            // const filtered = exerciseList.filter((item) => item.name.toLowerCase().includes(text.toLowerCase()) || semanticMatches.includes(item.name));

            console.log("New exlist", filtered);
            setFilteredExercises(filtered);
        }
    };


    const modifyWorkout = (newWorkout) => {
        setWorkout(newWorkout);
    };

    const handleInputChange = (text) => {
        setExerciseInput(text);
        console.log("change in handleInputChange");
        if (justAddedExercise) {
            setFilteredExercises([]);
        } else {
            filterExercises(text);
        }
        console.log("exercise var", justAddedExercise);
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
            type: null,
        };

        if (exerciseInput.trim() === '') {
            alert('Please enter a valid exercise name.');
            return;
        }

        setWorkout((prevWorkout) => [...prevWorkout, newExercise]);
        // setExerciseInput('');
        setNumExercises(numExercises + 1);
        setJustAddedExercise(true);
    };

    const removeExercise = (exerciseId) => {
        console.log("removing exercise from workout", exerciseId,
            workout.find((exercise) => exercise.id !== exerciseId));
        const updatedWorkout = workout.filter((exercise) => exercise.id !== exerciseId);
        setWorkout(updatedWorkout);
    };

    const addExerciseWithInput = (exercise) => {
        const newExercise = {
            id: numExercises,
            name: exercise.name,
            type: exercise.type,
            sets: null,
            reps: null,
            weight: null,
        };

        if (exercise.name.trim() === '') {
            alert('Please enter a valid exercise name.');
            return;
        }

        setWorkout((prevWorkout) => [...prevWorkout, newExercise]);
        setExerciseInput('');
        setFilteredExercises([]);
        console.log("this is ei", exerciseInput);
        setNumExercises(numExercises + 1);
        setJustAddedExercise(true);
    };

    const setJustAddedExerciseFalse = () => {
        if (justAddedExercise) {
            setExerciseInput('');
        }
        setJustAddedExercise(false);
    }

    const clearExercises = () => {
        setWorkout([]);
        setNumExercises(0);
    };

    const saveWorkout = async () => {
        let duration = 0;
        if (workoutStartTime) {
            const endTime = new Date();
            duration = Math.floor((endTime - workoutStartTime) / 1000); // Duration in seconds
        }

        if (workout.length === 0) {
            alert('No exercises to save. Add exercises before saving the workout.');
            return;
        }

        const workoutData = {
            id: `workout-${Date.now()}`,
            date: new Date().toISOString(),
            exercises: JSON.stringify(workout),
            workoutDuration: duration,
        };

        try {
            db.transaction((tx) => {
                tx.executeSql(
                    'CREATE TABLE IF NOT EXISTS workouts (id INTEGER PRIMARY KEY AUTOINCREMENT, date TEXT, exercises TEXT, workoutDuration INT);',
                    [],
                    () => console.log('workouts Table created successfully')
                );
                tx.executeSql(
                    'INSERT INTO workouts (date, exercises, workoutDuration) VALUES (?, ?, ?)',
                    [workoutData.date, workoutData.exercises, workoutData.workoutDuration],
                    () => {
                        console.log("Saved workout data to db with data", workoutData);
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
    };

    useEffect(() => {
        console.log("Updated exerciseInput: ", exerciseInput);
        console.log("Updated justAddedExerciseVar: ", justAddedExercise);
        console.log("Updated filteredExercises: ", filteredExercises);
        if (exerciseInput === '') {
            // perform an action
            setExerciseInput('');
        }
    }, [exerciseInput, justAddedExercise, filteredExercises]);


    useEffect(() => {
        let intervalId;

        const checkAndLoadExercises = async () => {
            try {
                await checkExerciseTableAccurate((exercisesUpToDate) => {
                    if (!exercisesUpToDate || HARDCREATEEXERCISES) {
                        createExerciseTable();
                        insertExerciseData(exerciseData);
                    }

                    // Once you're sure the table exists and has data, retrieve it.
                    db.transaction(tx => {
                        tx.executeSql(
                            'SELECT name, type FROM exercises',
                            [],
                            (_, { rows }) => {
                                // Map through the rows, extract each name, and add it to the exerciseList state.
                                let data = [];
                                for (let i = 0; i < rows.length; i++) {
                                    data.push({ name: rows.item(i).name, type: rows.item(i).type });
                                }
                                setExerciseList(data);
                            },
                            (_, error) => {
                                console.error('Error retrieving exercise names:', error);
                            }
                        );
                    });
                });
            } catch (error) {
                console.error('Error checking/creating exercises table:', error);
            }
        };

        checkAndLoadExercises();

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
                            <View style={styles.timerTextContainer}>
                                <Text style={styles.timerText}>{formatTimeSeconds(elapsedTime)}</Text>
                            </View>
                        )}
                    </View>
                    <View style={styles.inputContainer}>
                        <TextInput
                            // key={exerciseInput}
                            style={styles.input}
                            placeholder="Type an exercise, then click Add"
                            placeholderTextColor="#5c5c6c"
                            onChangeText={handleInputChange}
                            value={justAddedExercise ? '' : exerciseInput}
                            onFocus={setJustAddedExerciseFalse}
                        />
                        <CardButton
                            style={styles.addExerciseCardButton}
                            title="Add"
                            color="#841584"
                            onPress={addExercise} />
                    </View>
                    {filteredExercises.length > 0 && (
                        <FlatList
                            keyboardShouldPersistTaps='handled'
                            data={filteredExercises}
                            renderItem={({ item }) => (
                                <TouchableOpacity
                                    onPress={() => {
                                        setFilteredExercises([]);
                                        addExerciseWithInput(item);
                                        Keyboard.dismiss();
                                    }}
                                    style={styles.dropdownItem}
                                >
                                    <Text style={{ fontSize: 15, color: 'gray' }}>{item.name}</Text>
                                </TouchableOpacity>
                            )}
                            keyExtractor={(item) => item.name}
                            style={[
                                styles.dropdown,
                                {
                                    maxHeight: Math.min(filteredExercises.length * 40, 150),
                                    height: filteredExercises.length * 40,
                                    minHeight: 40
                                },
                            ]}
                        />
                    )}

                    <View style={{ maxHeight: "50%", flex: 1, flexGrow: 1 }}>
                        <FlatList
                            data={workout}
                            renderItem={({ item }) => (
                                <Card
                                    exercise={item}
                                    onPress={() =>
                                        navigation.navigate('Exercise', {
                                            exercise: item,
                                            workout: workout,
                                            modifyWorkout: modifyWorkout,
                                        })
                                    }
                                    onDelete={() => removeExercise(item.id)}
                                />
                            )}
                            keyExtractor={(item) => item.id}
                        />
                    </View>
                    <CardButton title="Clear exercises" onPress={clearExercises} color="#fff" />
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
        return;
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
                <View style={{ marginTop: 5 }}>
                    {exercise.sets !== null && exercise.sets.map((setReps, index) => (
                        <Text key={index} style={{ color: 'gray' }} >
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
