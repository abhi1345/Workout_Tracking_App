import React from 'react';
import { View, Text, FlatList, TouchableOpacity, StyleSheet } from 'react-native';

// Import the list of workout programs from a separate file
import { workoutPrograms } from './workoutPrograms';

export const YourProgramsScreen = () => {
  // Render each program tile
  const renderProgramItem = ({ item }) => {
    return (
      <TouchableOpacity style={styles.programTile} onPress={() => handleProgramPress(item)}>
        <Text style={styles.programTitle}>{item.title}</Text>
        <Text style={styles.programDescription}>{item.description}</Text>
      </TouchableOpacity>
    );
  };

  // Handle program tile press
  const handleProgramPress = (program) => {
    // Handle program selection logic
    console.log(`Selected program: ${program.title}`);
  };

  return (
    <View style={styles.container}>
      <FlatList
        data={workoutPrograms} // Use the workoutPrograms array as the data source
        keyExtractor={(item) => item.id.toString()}
        renderItem={renderProgramItem} // Render each program item as a tile
        contentContainerStyle={styles.programList}
      />
    </View>
  );
}; 

// Styles
const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#19162b',
  },
  screenTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 10,
    color: '#fff'
  },
  programList: {
    flexGrow: 1,
  },
  programTile: {
    backgroundColor: '#242240',
    borderRadius: 10,
    padding: 10,
    marginBottom: 10,
  },
  programTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 5,
    color: '#fff',
    fontFamily: 'SFUIDisplay-Light',
  },
  programDescription: {
    fontSize: 16,
    color: '#eeeef0',
    fontFamily: 'SFUIDisplay-Thin',
  },
});
