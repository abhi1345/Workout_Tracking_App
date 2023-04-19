import React, { useState, useEffect, useCallback } from 'react';
import { Button, SafeAreaView, TextInput, View, Text, FlatList, TouchableOpacity, TouchableWithoutFeedback, Keyboard, KeyboardAvoidingView } from 'react-native';
import { NavigationContainer, useFocusEffect } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Ionicons } from '@expo/vector-icons';

import styles from './styles';

const HomeScreen = ({ navigation }) => {
  const [workout, setWorkout] = useState([]);
  const [numExercises, setNumExercises] = useState(0);

  const [exerciseInput, setExerciseInput] = useState('');
  const [filteredExercises, setFilteredExercises] = useState([]);

  const [timerRunning, setTimerRunning] = useState(false);
  const [workoutStartTime, setWorkoutStartTime] = useState(null);
  const [workoutDuration, setWorkoutDuration] = useState(null);

  const exerciseList = [
    { name: 'Squat' },
    { name: 'Bench Press' },
    { name: 'Deadlift' },
    { name: 'Overhead Press' },
    { name: 'Barbell Row' },
    { name: 'Leg Press' }, // New exercise
    { name: 'Bicep Curl' }, // New exercise
  ];

  const filterExercises = (text) => {
    if (text === '') {
      setFilteredExercises([]);
    } else {
      const filtered = exerciseList.filter((item) => item.name.toLowerCase().startsWith(text.toLowerCase()));
      setFilteredExercises(filtered);
    }
  };

  const handleInputChange = (text) => {
    setExerciseInput(text);
    filterExercises(text);
  };

  const startWorkout = () => {
    if (!timerRunning) {
      setWorkoutStartTime(new Date());
      setTimerRunning(true);
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
    if (workoutStartTime) {
      const endTime = new Date();
      const duration = Math.floor((endTime - workoutStartTime) / 1000); // Duration in seconds
      setWorkoutDuration(duration);
      setWorkoutStartTime(null);
      setTimerRunning(false);
    }

    if (workout.length === 0) {
      alert('No exercises to save. Add exercises before saving the workout.');
      return;
    }


    const workoutData = {
      id: `workout-${Date.now()}`,
      date: new Date().toLocaleString(),
      exercises: workout,
      duration: workoutDuration,
    };

    try {
      // Create a unique workout identifier based on the current date and time
      const workoutId = 'workout_' + new Date().toISOString();

      // Get existing workouts
      const existingWorkouts = await AsyncStorage.getItem('workouts');
      let workouts = JSON.parse(existingWorkouts);

      if (!workouts) {
        workouts = {};
      }

      // Save the current workout with the unique identifier
      workouts[workoutId] = workoutData;

      // Save updated workouts to AsyncStorage
      await AsyncStorage.setItem('workouts', JSON.stringify(workouts));

      // Clear the current workout
      setWorkout([]);

      alert('Workout saved successfully.');
    } catch (error) {
      console.error('Error saving workout:', error);
      alert('Error saving workout.');
    }
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      style={styles.container}
    >
      <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
        <SafeAreaView style={styles.safeArea}>
          <TouchableOpacity
            style={[
              styles.startWorkoutButton,
              timerRunning ? styles.startWorkoutButtonDisabled : null,
            ]}
            onPress={startWorkout}
            disabled={timerRunning}
          >
            <Text style={styles.startWorkoutButtonText}>Start Workout</Text>
          </TouchableOpacity>
          <TextInput
            style={styles.input}
            placeholder="Type an exercise"
            onChangeText={handleInputChange}
            value={exerciseInput}
          />
          {filteredExercises.length > 0 && (
            <FlatList
              data={filteredExercises}
              renderItem={({ item }) => (
                <TouchableOpacity
                  onPress={() => {
                    Keyboard.dismiss();
                    setExerciseInput(item.name);
                    setFilteredExercises([]);
                    addExerciseWithInput(item.name);
                  }}
                  style={styles.dropdownItem}
                >
                  <Text style={styles.dropdownText}>{item.name}</Text>
                </TouchableOpacity>
              )}
              keyExtractor={(item) => item.name}
              style={styles.dropdown}
            />
          )}
          <CardButton style={styles.cardButton} title="Add exercise" onPress={addExercise} />
          <CardButton title="Clear exercises" onPress={clearExercises} />
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
              />
            )}
            keyExtractor={(item) => item.id}
          />
          <TouchableOpacity style={styles.saveWorkoutButton} onPress={saveWorkout}>
            <Text style={styles.saveWorkoutButtonText}>Save Workout</Text>
          </TouchableOpacity>
        </SafeAreaView>
      </TouchableWithoutFeedback>
    </KeyboardAvoidingView>
  );
};

const ExerciseScreen = ({ route, navigation }) => {
  const { workout, setWorkout, exercise } = route.params;
  const [sets, setSets] = useState(() => exercise.sets || []);
  const [reps, setReps] = useState(() => exercise.reps || '');
  const [weight, setWeight] = useState(() => exercise.weight || '');

  const addSet = () => {
    if (reps.trim() !== '') {
      setSets([...sets, [parseInt(reps), parseInt(weight)]]);
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
          keyboardType="number-pad"
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

const WorkoutLogScreen = () => {
  const [savedWorkouts, setSavedWorkouts] = useState([]);

  useFocusEffect(
    useCallback(() => {
      const loadWorkouts = async () => {
        const workouts = await AsyncStorage.getItem('workouts');
        if (workouts) {
          setSavedWorkouts(JSON.parse(workouts));
        }
      };

      loadWorkouts();
    }, [])
  );

  const deleteWorkout = async (workoutId) => {
    try {
      const allWorkouts = await AsyncStorage.getItem('workouts');
      let workouts = JSON.parse(allWorkouts);

      if (workouts) {
        delete workouts[workoutId];
        await AsyncStorage.setItem('workouts', JSON.stringify(workouts));
        setSavedWorkouts(workouts);
      }
    } catch (error) {
      console.error('Error deleting workout:', error);
    }
  };


  useEffect(() => {
    const fetchWorkouts = async () => {
      try {
        const allWorkouts = await AsyncStorage.getItem('workouts');
        setSavedWorkouts(JSON.parse(allWorkouts));
      } catch (error) {
        console.error('Error fetching workouts:', error);
      }
    };

    fetchWorkouts();
  }, []);


  // Render your workout data here
  return (
    <SafeAreaView style={styles.container}>
      <FlatList
        data={Object.entries(savedWorkouts)}
        renderItem={({ item }) => {
          const [workoutId, workoutData] = item;
          const { id, date, exercises, duration } = workoutData;

          if (!exercises || !date || !id) {
            return null;
          }

          const formattedDate = String(date);

          const durationInMinutes = (duration / (1000 * 60)).toFixed(0);

          return (
            <View style={styles.card}>
              <View style={styles.cardHeader}>
                <Text style={styles.cardTitle}>Workout - {formattedDate}</Text>
              </View>
              <Text style={styles.cardItem}>Duration: {durationInMinutes} minutes</Text>
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
                <TouchableOpacity style={styles.deleteButtonCard} onPress={() => deleteWorkout(workoutId)}>
                  <Text style={styles.deleteButton}>Delete</Text>
                </TouchableOpacity>
              </View>
            </View>
          );
        }}
        keyExtractor={(item) => item[0]}
      />
    </SafeAreaView>
  );




};

// const Stack = createStackNavigator();
const HomeStack = createStackNavigator();

function HomeStackNavigator({ navigation }) {
  return (
    <HomeStack.Navigator>
      <HomeStack.Screen
        name="Home"
        component={HomeScreen}
        options={{
          headerShown: false, // Hide the header for the HomeScreen
        }}
      />
      <HomeStack.Screen name="Exercise" component={ExerciseScreen} />
    </HomeStack.Navigator>
  );
}

const Tab = createBottomTabNavigator();

function App() {
  return (
    <NavigationContainer>
      <Tab.Navigator>
        <Tab.Screen name="Home Screen" component={HomeStackNavigator} options={{
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="md-barbell" color={color} size={size} />
          ),
        }} />
        <Tab.Screen name="Workout Log" component={WorkoutLogScreen} options={{
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="ios-list" color={color} size={size} />
          ),
        }} />
      </Tab.Navigator>
    </NavigationContainer>
  );
}

const Card = ({ exercise, onPress }) => {
  return (
    <TouchableOpacity style={styles.card} onPress={onPress}>
      <Text style={styles.cardText}>{exercise.name}</Text>
      <View>
        {exercise.sets !== null && exercise.sets.map((setReps, index) => (
          <Text key={index}>
            Set {index + 1}: {setReps[0]} reps at {setReps[1]} lbs
          </Text>
        ))}
      </View>
    </TouchableOpacity>
  );
};

const CardButton = ({ title, onPress }) => {
  return (
    <TouchableOpacity onPress={onPress} style={styles.cardButton}>
      <Text style={styles.cardButtonText}>{title}</Text>
    </TouchableOpacity>
  );
};

const WorkoutLogItem = ({ exerciseId, sets, reps, weight }) => {
  return (
    <View style={styles.workoutLogItem}>
      <Text style={styles.workoutLogText}>Exercise ID: {exerciseId}</Text>
      <Text style={styles.workoutLogText}>Sets: {sets}</Text>
      <Text style={styles.workoutLogText}>Reps: {reps}</Text>
      <Text style={styles.workoutLogText}>Weight: {weight} lbs</Text>
    </View>
  );
};

export default App;