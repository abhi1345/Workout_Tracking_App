import React, { useState, useEffect, useCallback, useLayoutEffect} from 'react';
import { Platform, SafeAreaView, TextInput, ScrollView, View, Text, FlatList, TouchableOpacity, TouchableWithoutFeedback, Keyboard, KeyboardAvoidingView } from 'react-native';
import { formatTimeSeconds, localeDateStringToISO, isDateStringInLocaleFormat } from './utilities';
import Swipeable from 'react-native-gesture-handler/Swipeable';
import * as SQLite from 'expo-sqlite';
import { checkExerciseTableAccurate } from './exerciseDB.js';
import { FontAwesome } from 'react-native-vector-icons';
import { StatusBar } from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome';
import 'react-native-url-polyfill/auto';
import { Animated } from 'react-native';
import styles from './styles';

const db = SQLite.openDatabase('workouts.db');

export const HomeScreen = ({ navigation, fetchedData }) => {

    const [workout, setWorkout] = useState([]);
    const [numExercises, setNumExercises] = useState(0);

    const [exerciseInput, setExerciseInput] = useState('');
    const [filteredExercises, setFilteredExercises] = useState([]);

    const [timerRunning, setTimerRunning] = useState(false);
    const [workoutStartTime, setWorkoutStartTime] = useState(null);
    const [elapsedTime, setElapsedTime] = useState(0);
    const [timerVisible, setTimerVisible] = useState(false);
    const [exercisesLoaded, setExercisesLoaded] = useState(false);

    const [exerciseList, setExerciseList] = useState([]);
    const [justAddedExercise, setJustAddedExercise] = useState(false);

    const filterExercises = async (text) => {
        if (text === '') {
            setFilteredExercises([]);
        } else {
            const formattedText = text.replace(/-/g, ' ').toLowerCase();
            const filtered = exerciseList
                .filter((item) => item.name.replace(/-/g, ' ').toLowerCase().includes(formattedText))
                .slice(0, 5);
    
            console.log("New filtered exercise list:", filtered);
            setFilteredExercises(filtered);
        }
    };
    

    const modifyWorkout = (newWorkout) => {
        setWorkout(newWorkout);
    };

    // const modifyExercise = (newExercise) => {
    //     setWorkout(newExercise);
    // };

    const handleInputChange = (text) => {
        setExerciseInput(text);
        if (justAddedExercise) {
            setFilteredExercises([]);
        } else {
            filterExercises(text);
        }
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
            notes: null,
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
        console.log("Removing exercise from workout", exerciseId,
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
            notes: null,
        };

        if (exercise.name.trim() === '') {
            alert('Please enter a valid exercise name.');
            return;
        }

        setWorkout((prevWorkout) => [...prevWorkout, newExercise]);
        setExerciseInput('');
        setFilteredExercises([]);
        setNumExercises(numExercises + 1);
        setJustAddedExercise(true);
    };

    const setJustAddedExerciseFalse = () => {
        if (justAddedExercise) {
            setExerciseInput('');
        }
        setJustAddedExercise(false);
    }

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
            console.log("Saved workout", workoutData);

        } catch (error) {
            console.error('Error saving workout:', error);
            alert('Error saving workout.');
        }
        setWorkoutStartTime(null);
        setTimerRunning(false);
        setTimerVisible(false);
    };


    useEffect(() => {
        console.log("Checking local exercises table for discrepancies", exercisesLoaded);
        const checkAndLoadExercises = async () => {
            try {
                await checkExerciseTableAccurate((exercisesUpToDate) => {
                    // if (!exercisesUpToDate || HARDCREATEEXERCISES) {
                    //     createExerciseTable();
                    //     insertExerciseData(exerciseData);
                    // }

                    // Once you're sure the table exists and has data, retrieve it.
                    console.log("updating exercise list from local sqlite db");
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
            console.log("Ran check and Load exercises");
        };
        // Run the function immediately

        console.log("fecthedDate1", fetchedData);
        if (!exercisesLoaded) {
            console.log("fecthedDate2", fetchedData);
            checkAndLoadExercises();
            setExercisesLoaded(true);
        }

        // console.log("exerises lists", exerciseList);

    }, [exerciseInput]);

    useEffect(() => {
        if (exerciseInput === '') {
            // perform an action
            setExerciseInput('');
        }
    }, [exerciseInput, justAddedExercise, filteredExercises]);


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
            <StatusBar barStyle="light-content" />
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
                            color="#242240"
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
                                    minHeight: filteredExercises.length * 40,
                                    height: filteredExercises.length * 40,
                                    maxHeight: filteredExercises.length * 40,
                                },
                            ]}
                        />
                    )}

                    <View style={{ flex: 1, flexGrow: 1, paddingBottom: 75 }}>
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

                    <TouchableOpacity
                        style={[
                            styles.saveWorkoutButton,
                            !timerRunning ? styles.saveWorkoutButtonDisabled : null,
                            {flex: 1},
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
    const swipeableRef = React.useRef(null);

    const RightSwipeActions = (progress, dragX) => {
        const scale = dragX.interpolate({
            inputRange: [-100, 0],
            outputRange: [1, 0],
            extrapolate: 'clamp',
        });
        return (
            <TouchableOpacity onPress={() => {
                onDelete();
                swipeableRef.current.close();
            }}>
                <Animated.View style={{transform: [{ scale }]}}>
                    <CardDeleteButton onPress={onDelete} />
                </Animated.View>
            </TouchableOpacity>
        );
    };

    const swipeFromRightOpen = () => {
        return;
    };

    return (
        <Swipeable
            ref={swipeableRef}
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
                            Set {index + 1}:
                            {exercise.type === 'Cardio' ?
                                ` ${setReps[1]} Miles in ${setReps[0]} Minutes` :
                                ` ${setReps[0]} reps at ${setReps[1]} lbs`
                            }
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

const CardDeleteButton = ({ onPress }) => {
    return (
        <TouchableOpacity onPress={onPress} style={styles.cardDeleteButton}>
            <FontAwesome name="trash" size={24} color="#ffffff" />
        </TouchableOpacity>
    );
};
