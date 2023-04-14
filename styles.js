import { StyleSheet } from 'react-native';

const styles = StyleSheet.create({
    card: {
        backgroundColor: '#fff',
        borderRadius: 10,
        padding: 30, // increased padding
        marginVertical: 10, // increased margin
        marginHorizontal: 10,
        shadowColor: '#000',
        shadowOpacity: 0.25,
        shadowOffset: { width: 0, height: 2 },
        shadowRadius: 5,
        elevation: 5,
    },
    cardText: {
        fontSize: 18,
    },
    input: {
        borderColor: '#ccc',
        borderWidth: 1,
        borderRadius: 5,
        padding: 15,
        marginVertical: 20,
        marginHorizontal: 10,
    },
    safeArea: {
        padding: 20, // added padding
    },
    cardButton: {
        backgroundColor: '#fff',
        borderRadius: 10,
        padding: 20,
        marginVertical: 10,
        marginHorizontal: 10,
        shadowColor: '#000',
        shadowOpacity: 0.25,
        shadowOffset: { width: 0, height: 2 },
        shadowRadius: 5,
        elevation: 5,
        alignItems: 'center',
    },
    cardButtonText: {
        fontSize: 18,
    },
    workoutLogItem: {
        backgroundColor: '#fff',
        borderRadius: 10,
        padding: 20,
        marginVertical: 5,
        marginHorizontal: 10,
        shadowColor: '#000',
        shadowOpacity: 0.25,
        shadowOffset: { width: 0, height: 2 },
        shadowRadius: 5,
        elevation: 5,
    },
    workoutLogText: {
        fontSize: 16,
        marginBottom: 5,
    },
    saveWorkoutButton: {
        backgroundColor: '#1E90FF',
        borderRadius: 10,
        padding: 15,
        alignItems: 'center',
        justifyContent: 'center',
        margin: 10,
      },
      saveWorkoutButtonText: {
        color: '#fff',
        fontSize: 18,
      },
      container: {
        flex: 1,
        backgroundColor: '#fff',
      },
      workoutItem: {
        padding: 15,
        borderBottomWidth: 1,
        borderBottomColor: '#ccc',
      },
      cardTitle: {
        fontSize: 18,
        fontWeight: 'bold',
        marginBottom: 10,
      },
      cardItem: {
        fontSize: 16,
        marginBottom: 5,
      },
});

export default styles;
