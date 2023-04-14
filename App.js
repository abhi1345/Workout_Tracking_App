import React, { useState, useEffect } from 'react';
import { Button, SafeAreaView, TextInput, View, Text, FlatList, TouchableOpacity } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { useNavigation } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import AsyncStorage from '@react-native-async-storage/async-storage';
import styles from './styles';

const HomeScreen = ({ navigation }) => {
  const [exercise, setExercise] = useState('');
  const [workout, setWorkout] = useState([]);
  const [numExercises, setNumExercises] = useState(0);

  const addExercise = () => {
    const newExercise = {
      id: this.numExercises,
      name: exercise,
      sets: null,
      reps: null,
      weight: null,
    };

    setWorkout((prevWorkout) => [...prevWorkout, newExercise]);
    setExercise('');
    setNumExercises(this.numExercises + 1);
  };

  const clearExercises = () => {
    setWorkout([]);
  };

  const saveExerciseData = (exerciseId, sets, reps, weight) => {
    setWorkout((prevWorkout) =>
      prevWorkout.map((exercise) =>
        exercise.id === exerciseId ? { ...exercise, sets, reps, weight } : exercise
      )
    );
    navigation.navigate('Home');
  };

  const saveWorkout = async () => {
    if (workout.length === 0) {
      alert('No exercises to save. Add exercises before saving the workout.');
      return;
    }

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
      workouts[workoutId] = workout;

      // Save updated workouts to AsyncStorage
      await AsyncStorage.setItem('workouts', JSON.stringify(workouts));

      // Print the entire set of saved workouts
      console.log('All saved workouts:', workouts);

      // Clear the current workout
      setWorkout([]);

      alert('Workout saved successfully.');
    } catch (error) {
      console.error('Error saving workout:', error);
      alert('Error saving workout.');
    }
  };



  return (
    <SafeAreaView style={styles.safeArea}>
      <TextInput
        placeholder="Type an exercise"
        onChangeText={setExercise}
        value={exercise}
        style={styles.input}
      />
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
                saveExerciseData: saveExerciseData, // Pass the callback function
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
  );
};

const ExerciseScreen = ({ route, navigation }) => {
  const { exercise } = route.params;
  const [sets, setSets] = useState('');
  const [reps, setReps] = useState('');
  const [weight, setWeight] = useState('');

  const saveExerciseData = () => {
    const updatedSets = parseInt(sets, 10);
    const updatedReps = parseInt(reps, 10);
    const updatedWeight = parseFloat(weight);

    route.params.saveExerciseData(exercise.id, updatedSets, updatedReps, updatedWeight);
    navigation.goBack();
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <Text style={styles.card}>{exercise.name}</Text>
      <TextInput
        placeholder="Sets"
        onChangeText={setSets}
        value={sets}
        keyboardType="number-pad"
        style={styles.input}
      />
      <TextInput
        placeholder="Reps"
        onChangeText={setReps}
        value={reps}
        keyboardType="number-pad"
        style={styles.input}
      />
      <TextInput
        placeholder="Weight (lbs)"
        onChangeText={setWeight}
        value={weight}
        keyboardType="decimal-pad"
        style={styles.input}
      />
      <Button title="Save" onPress={saveExerciseData} />
    </SafeAreaView>
  );
};

const WorkoutLogScreen = () => {
  const [savedWorkouts, setSavedWorkouts] = useState([]);

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
          const [workoutId, workout] = item;
          const date = workoutId.split('_')[1];

          return (
            <View style={styles.card}>
              <Text style={styles.cardTitle}>Workout - {date}</Text>
              {workout.map((exercise, index) => (
                <Text style={styles.cardItem} key={index}>
                  {exercise.name} ({exercise.sets} sets x {exercise.reps} reps x {exercise.weight} lbs)
                </Text>
              ))}
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
        <Tab.Screen name="Home" component={HomeStackNavigator} />
        <Tab.Screen name="Workout Log" component={WorkoutLogScreen} />
      </Tab.Navigator>
    </NavigationContainer>
  );
}

// const App = () => {
//   return (
//     <NavigationContainer>
//       <Stack.Navigator>
//         <Stack.Screen name="Home" component={HomeScreen} />
//         <Stack.Screen name="Exercise" component={ExerciseScreen} />
//         <Stack.Screen name="Workout Log" component={WorkoutLogScreen} />
//       </Stack.Navigator>
//     </NavigationContainer>
//   );
// };

const Card = ({ exercise, onPress }) => {
  return (
    <TouchableOpacity style={styles.card} onPress={onPress}>
      <Text style={styles.cardText}>{exercise.name}</Text>
      {exercise.sets !== null && <Text>Sets: {exercise.sets}</Text>}
      {exercise.reps !== null && <Text>Reps: {exercise.reps}</Text>}
      {exercise.weight !== null && <Text>Weight: {exercise.weight} lbs</Text>}
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