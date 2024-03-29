import { StyleSheet } from 'react-native';

const styles = StyleSheet.create({
    card: {
        backgroundColor: '#19162b',
        borderRadius: 10,
        padding: 20, // increased padding
        marginVertical: 10, // increased margin
        marginHorizontal: 10,
        borderColor: 'gray',
        borderWidth: 1,
    },
    exerciseScreenSetCard: {
        paddingLeft: 30,
        flex: 1,
        borderColor: 'gray',
        paddingBottom: 15,
        backgroundColor: '#19162b',
        borderRadius: 10,
        alignContent: 'center',
    },
    workoutLogCard: {
        backgroundColor: '#19162b',
        borderRadius: 5,
        padding: 10, // increased padding
        marginVertical: 10, // increased margin
        marginHorizontal: 10,
    },
    cardText: {
        fontSize: 35,
        color: 'white',
        fontFamily: 'SFUIDisplay-Light',
        alignSelf: 'flex-start',
    },
    input: {
        borderColor: '#ccc',
        borderWidth: 1,
        borderRadius: 10,
        padding: 20,
        marginVertical: 20,
        marginHorizontal: 10,
        flex: 1,
        fontSize: 14,
        color: 'white',
    },
    noteInput: {
        borderColor: '#ccc',
        borderWidth: 1,
        borderRadius: 10,
        padding: 20,
        marginVertical: 20,
        marginHorizontal: 10,
        flex: 1,
        fontSize: 14,
        color: 'white',
    },
    signInInput: {
        borderColor: '#ccc',
        // minHeight: 100,
        // maxHeight: 100,
        // width: 300,
        padding: 20,
        marginVertical: 20,
        marginHorizontal: 20,
        borderWidth: 1,
        borderRadius: 10,
        fontSize: 20,
        color: 'white',
    },
    setRepInput: {
        borderColor: '#ccc',
        borderWidth: 1,
        borderRadius: 10,
        padding: 10,
        marginVertical: 20,
        marginHorizontal: 10,
        flex: 1,
        fontSize: 11,
        color: 'gray',
    },
    safeArea: {
        padding: 20, // added padding
        backgroundColor: '#19162b',
        flex: 1,
    },
    saveWorkoutButtonDisabled: {
        backgroundColor: 'gray',
        opacity: 0.5,
        // Add any other desired styles for the disabled state
    },
    saveWorkoutButton: {
        position: 'absolute',
        bottom: 0,
        width: "90%",
        height: 55,
        backgroundColor: '#9088eb',
        borderRadius: 10,
        padding: 15,
        marginVertical: 10,
        marginHorizontal: "5%",
        alignItems: 'center',
        justifyContent: 'center',
    },
    signInButton: {
        width: "90%",
        height: 55,
        backgroundColor: '#white',
        borderRadius: 10,
        padding: 15,
        marginVertical: 10,
        marginHorizontal: "5%",
        alignItems: 'center',
        justifyContent: 'center',
    },
    cardButton: {
        backgroundColor: '#242240',
        borderRadius: 10,
        padding: 20,
        marginVertical: 10,
        marginHorizontal: 10,
        // shadowColor: '#000',
        // shadowOpacity: 0.25,
        // shadowOffset: { width: 0, height: 2 },
        shadowRadius: 10,
        elevation: 5,
        alignItems: 'center',
    },
    addExerciseCardButton: {
        backgroundColor: '#382c54',
        borderRadius: 10,
        padding: 10,
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
    deleteText: {
        color: 'white',
        textAlignVertical: "center",
        textAlign: "center",
    },
    exerciseScreenDeleteText: {
        color: 'white',
        // textAlignVertical: "center",
        textAlign: "center",
        fontSize: 12,
    },
    cardButtonText: {
        fontSize: 18,
        color: 'white',
        fontFamily: 'SFUIDisplay-Light',
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
    saveWorkoutButtonText: {
        color: '#fff',
        fontSize: 18,
        fontFamily: 'SFUIDisplay-Light',
    },
    saveWorkoutButtonText: {
        color: '#fff',
        fontSize: 18,
        fontFamily: 'SFUIDisplay-Light',
    },
    container: {
        flex: 1,
        backgroundColor: '#19162b',
    },
    bottomNavBar: {
        backgroundColor: '#19162b',
        color: '#19162b',
    },
    topHeader: {
        backgroundColor: '#19162b',
    },
    inputContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        backgroundColor: '#19162b',
    },
    exerciseScreenInputContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        backgroundColor: '#19162b',
        paddingLeft: 20,
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
        color: 'white',
        fontFamily: 'SFUIDisplay-Light',
    },
    signInScreenTitle: {
        fontSize: 18,
        fontWeight: 'bold',
        marginBottom: 10,
        color: 'white',
        fontFamily: 'SFUIDisplay-Light',
        alignContent: 'center',
        justifyContent: 'center',
    },
    cardItem: {
        fontSize: 16,
        marginBottom: 5,
        color: 'white',
        fontFamily: 'SFUIDisplay-Thin',
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
        padding: 10, // Add more padding
        fontSize: 25,
    },
    dropdownText: {
        fontSize: 25, // Increase the font size
    },
    dropdown: {
        // paddingLeft: 10,
        marginLeft: 10,
        marginRight: 103,
        borderRadius: 10,
        // minHeight: 40,
        borderWidth: 1,
        borderColor: 'grey',
        flex: 1,
    },
    startWorkoutButton: {
        backgroundColor: '#242240',
        padding: 15,
        borderRadius: 10,
        alignItems: 'center',
        marginBottom: 10,
        marginTop: 15,
        marginHorizontal: 10,
    },
    startWorkoutButtonText: {
        color: '#ffffff',
        fontSize: 18,
        fontWeight: 'bold',
        fontFamily: 'SFUIDisplay-Light',
    },
    timerTextContainer: {
        fontSize: 24,
        fontWeight: 'bold',
        marginBottom: 10,
        alignItems: 'center',
        color: 'white',
    },
    timerText: {
        fontSize: 18,
        color: 'white',
        fontFamily: 'SFUIDisplay-Light',
    },
    startWorkoutButtonDisabled: {
        backgroundColor: '#A0A0A0',
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
    deleteBox: {
        backgroundColor: 'red',
        justifyContent: 'center',
        alignItems: 'flex-end',
        width: 110,
        borderRadius: 10,
        padding: 30, // increased padding
        marginVertical: 10, // increased margin
        marginHorizontal: 10,
    },
    exerciseScreenDeleteBox: {
        backgroundColor: 'red',
        justifyContent: 'center',
        alignItems: 'center',
        width: 80,
        borderRadius: 10,
        padding: 10, // increased padding
        marginVertical: 0, // increased margin
        // marginLeft: 0,
        marginRight: 10,
    },
    repSetText: {
        padding: 5,
        alignItems: 'flex-end',
        justifyContent: 'center',
        flex: 1,
        color: 'white',
    },
    historyTitle: {
        fontSize: 18,
        fontWeight: 'bold',
        marginTop: 10,
        color: 'white',
        textAlign: 'center',
    },
    historyItem: {
        backgroundColor: '#19162b',
        borderRadius: 5,
        padding: 10,
        marginBottom: 10,
    },
    historyDate: {
        fontSize: 16,
        fontWeight: 'bold',
        marginBottom: 5,
        color: '#ccc',
        fontFamily: 'SFUIDisplay-Light',
    },
    historySet: {
        fontSize: 14,
        fontWeight: 'bold',
        marginBottom: 5,
        color: '#ccc',
        fontFamily: 'SFUIDisplay-Light',
    },
});

export default styles;
