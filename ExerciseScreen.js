import React, { useState } from 'react';
import { Button, SafeAreaView, TextInput, View, Text } from 'react-native';
import styles from './styles';

export const ExerciseScreen = ({ route, navigation }) => {
    const { workout, setWorkout, exercise } = route.params;
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
  
          setWorkout(updatedWorkout);
          return newSets;
        });
      } else {
        alert('Please enter numbers only.');
      }
    };
  
  
    const saveExerciseData = () => {
      const updatedWorkout = workout.map((item) => {
        if (item.id === exercise.id) {
          return {
            ...item,
            sets: sets,
          };
        }
        return item;
      });
  
      setWorkout(updatedWorkout);
      navigation.goBack();
    };
  
    return (
      <SafeAreaView style={styles.safeArea}>
        <Text style={styles.card}>{exercise.name}</Text>
        <View style={styles.addSetContainer}>
          <TextInput
            placeholder="Add Reps"
            onChangeText={setReps}
            value={reps}
            keyboardType="number-pad"
            style={styles.input}
          />
          <TextInput
            placeholder="Add Weight"
            onChangeText={setWeight}
            value={weight}
            keyboardType="decimal-pad"
            style={styles.input}
          />
          <Button title="Add Set" onPress={addSet} />
        </View>
        <View>
          {sets.map((setReps, index) => (
            <Text key={index}>
              Set {index + 1}: {setReps[0]} reps at {setReps[1]} lbs
            </Text>
          ))}
        </View>
        <Button title="Save" onPress={saveExerciseData} />
      </SafeAreaView>
    );
  };