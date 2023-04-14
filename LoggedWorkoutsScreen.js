import React from 'react';
import { View, Text, FlatList } from 'react-native';
import styles from './styles';

const LoggedWorkoutsScreen = ({ route }) => {
  const exercises = route.params?.exercises || [];

  const renderItem = ({ item }) => {
    return (
      <View style={styles.exerciseContainer}>
        <Text style={styles.exerciseName}>{item.name}</Text>
        <Text>Sets: {item.sets}</Text>
        <Text>Reps: {item.reps}</Text>
        <Text>Weight: {item.weight} lbs</Text>
      </View>
    );
  };

  return (
    <View style={styles.container}>
      <FlatList
        data={exercises}
        renderItem={renderItem}
        keyExtractor={(item, index) => index.toString()}
      />
    </View>
  );
};

export default LoggedWorkoutsScreen;
