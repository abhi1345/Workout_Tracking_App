import React, { useState, useRef, useLayoutEffect } from 'react';
import {
    Button, SafeAreaView, TextInput, View, Text, FlatList, ScrollView, TouchableOpacity, Animated
} from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome';
import { Swipeable } from 'react-native-gesture-handler';
import * as SQLite from 'expo-sqlite';

import styles from './styles';

const db = SQLite.openDatabase('workouts.db');

export const ExerciseScreen = ({ route, navigation }) => {
    const { workout, exercise } = route.params;
    console.log("Starting screen with route params:", route.params);
    const [sets, setSets] = useState(() => exercise.sets || []);
    const [reps, setReps] = useState(() => exercise.reps || '');
    const [weight, setWeight] = useState(() => exercise.weight || '');


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

    const deleteSet = (index) => {
        setSets(prevSets => {
            if (prevSets.length === 0) {
                console.log('No sets to delete.');
                return prevSets;
            }

            const lastSet = prevSets[index]; // Get the last set
            console.log('Deleting set (reps, lbs):', lastSet); // Log the last set

            const newSets = [...prevSets];
            newSets.splice(index, 1);; // Removes the element at index

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
    };

    const renderRightAction = (progress, dragX, index) => {
        const scale = dragX.interpolate({
            inputRange: [-100, 0],
            outputRange: [1, 0],
            extrapolate: 'clamp',
        });
        return (
            <TouchableOpacity onPress={() => deleteSet(index)}>
                <View style={styles.deleteBox}>
                    <Animated.Text
                        style={[
                            styles.deleteText,
                            {
                                transform: [{ scale }],
                            },
                        ]}>
                        Delete
                    </Animated.Text>
                </View>
            </TouchableOpacity>
        );
    };


    useLayoutEffect(() => {
        navigation.setOptions({
            headerRight: () => (
                <TouchableOpacity
                    onPress={() => navigation.navigate('ExerciseHistory', { exerciseName: exercise.name })}
                >
                    <Icon name="clock-o" size={40} color="#000" style={{ marginRight: 10 }} />
                </TouchableOpacity>
            ),
            headerStyle: {
                height: 55, // Set your desired height
            },
        });
    }, [exercise, navigation]);



    const firstInputRef = useRef(null);
    const secondInputRef = useRef(null);

    return (
        <SafeAreaView style={styles.safeArea}>
            <View style={styles.inputContainer}>
                <TextInput
                    ref={firstInputRef}
                    placeholder={exercise.type === 'Cardio' ? "Add Minutes" : "Add Reps"}
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

                <Text style={styles.repSetText}>{exercise.type === 'Cardio' ? "Minutes" : "Reps"}</Text>
                <TextInput
                    ref={secondInputRef}
                    placeholder={exercise.type === 'Cardio' ? "Add Miles" : "Add Weight"}
                    onChangeText={setWeight}
                    value={weight}
                    keyboardType="decimal-pad"
                    style={styles.setRepInput}
                />
                <Text style={styles.repSetText}>{exercise.type === 'Cardio' ? "Miles" : "LBS"}</Text>
            </View>
            <Button title="Add Set" onPress={addSet} />

            <ScrollView>
                {sets.map((setReps, index) => (
                    <Swipeable key={index} renderRightActions={(progress, dragX) => renderRightAction(progress, dragX, index)}>
                        <View style={styles.card}>
                            <Text style={styles.cardText}>
                                Set {index + 1}: {setReps[0]} reps at {setReps[1]} lbs
                            </Text>
                        </View>
                    </Swipeable>
                ))}
            </ScrollView>



        </SafeAreaView>
    );
};