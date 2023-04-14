import React, { useState, useRef } from 'react';
import {
    View,
    Text,
    Image,
    TextInput,
    TouchableOpacity,
    TouchableWithoutFeedback,
    Keyboard,
    Alert,
    ScrollView,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import styles from './styles';

const HomeScreen = () => {
    const navigation = useNavigation();
    const [exerciseName, setExerciseName] = useState('');
    const [numSets, setNumSets] = useState('');
    const [numReps, setNumReps] = useState('');
    const [weight, setWeight] = useState('');
    const [exercises, setExercises] = useState([]);
    const numSetsRef = useRef(null);
    const numRepsRef = useRef(null);

    const handleAddExercise = () => {
        const exercise = {
            name: exerciseName,
            sets: numSets,
            reps: numReps,
            weight: weight,
        };
        setExercises([...exercises, exercise]);
        setExerciseName('');
        setNumSets('');
        setNumReps('');
        setWeight('');
    };

    const handleNumSetsChange = (text) => {
        setNumSets(text);
        if (text.length >= 2) {
            numSetsRef.current.focus();
        }
    };

    const handleNumRepsChange = (text) => {
        setNumReps(text);
        if (text.length >= 2) {
            numRepsRef.current.focus();
        }
    };

    const handleLogWorkout = () => {
        if (exercises.length === 0) {
            Alert.alert('Error', 'You must log at least one exercise before saving your workout');
            return;
        }
        navigation.navigate('LoggedWorkouts', { exercises });
        setExercises([]);
    };

    const handleClearWorkout = () => {
        setExercises([]);
    };

    return (
        <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
                <View style={styles.container}>
                    <Image source={require('./assets/Icon-192.png')} style={styles.logo} />
                    <TextInput
                        style={styles.input}
                        placeholder="Exercise name"
                        value={exerciseName}
                        onChangeText={(text) => setExerciseName(text)}
                    />
                    <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
                        <TextInput
                            ref={numSetsRef}
                            style={[styles.input, { width: '47%', marginHorizontal: '3%' }]}
                            placeholder="Number of sets"
                            keyboardType="numeric"
                            value={numSets}
                            onChangeText={handleNumSetsChange}
                            onSubmitEditing={() => numRepsRef.current.focus()}
                        />
                        <TextInput
                            ref={numRepsRef}
                            style={[styles.input, { width: '47%', marginHorizontal: '3%' }]}
                            placeholder="Number of reps"
                            keyboardType="numeric"
                            value={numReps}
                            onChangeText={handleNumRepsChange}
                        />
                    </View>
                    <TextInput
                        style={styles.input}
                        placeholder="Weight in lbs"
                        keyboardType="numeric"
                        value={weight}
                        onChangeText={(text) => setWeight(text)}
                    />
                    <TouchableOpacity style={styles.button} onPress={handleAddExercise}>
                        <Text style={styles.buttonText}>Add Exercise</Text>
                    </TouchableOpacity>
                    {exercises.length > 0 && (
                        <>
                            <Text style={styles.header}>Logged Exercises:</Text>
                            {exercises.map((exercise, index) => (
                                <View style={styles.exerciseContainer} key={index}>
                                    <Text style={styles.exerciseName}>{exercise.name}</Text>
                                    <Text>Sets: {exercise.sets}</Text>
                                    <Text>Reps: {exercise.reps}</Text>
                                    <Text>Weight: {exercise.weight} lbs</Text>
                                </View>
                            ))}
                            <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
                                <TouchableOpacity style={[styles.button, { backgroundColor: 'green' }]} onPress={handleLogWorkout}>
                                    <Text style={styles.buttonText}>Log Workout</Text>
                                </TouchableOpacity>
                                <TouchableOpacity style={[styles.button, { backgroundColor: 'red' }]} onPress={handleClearWorkout}>
                                    <Text style={styles.buttonText}>Clear Workout</Text>
                                </TouchableOpacity>
                            </View>
                        </>
                    )}
                </View>
        </TouchableWithoutFeedback>
    );
};

export default HomeScreen;
