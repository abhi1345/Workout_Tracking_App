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
        borderRadius: 10,
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
        shadowRadius: 10,
        elevation: 5,
        alignItems: 'center',
    },
    cardDeleteButton: {
        backgroundColor: '#FF0000',
        borderRadius: 10,
        padding: 20,
        marginVertical: 10,
        marginHorizontal: 10,
        shadowColor: '#000',
        shadowOpacity: 0.25,
        shadowOffset: { width: 0, height: 2 },
        shadowRadius: 10,
        elevation: 10,
        justifyContent: "center",
    },
    swipeActionText: {
        paddingTop: 10,
        paddingBottom: 10,
        color: 'white',
        textAlignVertical: "center",
        textAlign: "center",
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
    cardHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 10,
    },
    deleteButtonContainer: {
        alignItems: 'center',
        marginTop: 10,
    },
    deleteButtonCard: {
        backgroundColor: '#ffcccc',
        borderRadius: 10,
        paddingVertical: 5,
        paddingHorizontal: 10,
        alignItems: 'center',
    },
    deleteButton: {
        fontSize: 16,
        color: 'red',
    },
    autocompleteInputContainer: {
        borderWidth: 0,
    },
    dropdownItem: {
        padding: 20, // Add more padding
        fontSize: 28,
    },
    dropdownText: {
        fontSize: 28, // Increase the font size
    },
    dropdown: {
        maxHeight: 200,
        borderWidth: 1,
        borderColor: 'grey',
    },
    startWorkoutButton: {
        backgroundColor: '#1a73e8',
        padding: 15,
        borderRadius: 10,
        alignItems: 'center',
        marginBottom: 10,
        marginHorizontal: 10,
    },
    startWorkoutButtonText: {
        color: '#ffffff',
        fontSize: 16,
        fontWeight: 'bold',
    },
    timerText: {
        fontSize: 24,
        fontWeight: 'bold',
        marginBottom: 10,
        alignItems: 'center',
    },
    startWorkoutButtonDisabled: {
        backgroundColor: '#A0A0A0',
    },
    saveWorkoutButtonDisabled: {
        backgroundColor: 'gray',
        opacity: 0.5,
        // Add any other desired styles for the disabled state
    },
    leftSwipeActions: {
        backgroundColor: 'blue',
        justifyContent: 'center',
        alignItems: 'flex-start',
        width: 100,
    },
    rightSwipeActions: {
        backgroundColor: 'red',
        justifyContent: 'center',
        alignItems: 'flex-end',
        width: 110,
        borderRadius: 10,
        padding: 30, // increased padding
        marginVertical: 10, // increased margin
        marginHorizontal: 10,
    },

});

export default styles;
