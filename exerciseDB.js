// db.js

import * as SQLite from 'expo-sqlite';
import { exerciseData } from './ExerciseList.js';


const db = SQLite.openDatabase('workouts.db');

export const createExerciseTable = () => {
    db.transaction((tx) => {
        tx.executeSql(
            'CREATE TABLE IF NOT EXISTS exercises (id INTEGER PRIMARY KEY AUTOINCREMENT, name TEXT, type TEXT, equipment TEXT);',
            [],
            () => console.log('Exercise table created successfully'),
            (_, error) => console.error('Error creating exercise table:', error)
        );
    });
};

export const insertExerciseData = (exerciseData) => {
    exerciseData.forEach((exercise) => {
        const { name, type, equipment } = exercise;

        db.transaction((tx) => {
            tx.executeSql(
                'INSERT INTO exercises (name, type, equipment) VALUES (?, ?, ?)',
                [name, type, equipment],
                () => console.log('Inserted exercise data successfully'),
                (_, error) => console.error('Error inserting exercise data:', error)
            );
        });
    });
};

export const checkExerciseTableAccurate = (callback) => {
    console.log("strating check function");
    db.transaction((tx) => {
        tx.executeSql(
            "SELECT name FROM sqlite_master WHERE type='table' AND name='exercises';",
            [],
            (_, { rows: { _array } }) => {
                if (_array.length === 0) {
                    console.log("no rows found")
                    callback(false);
                } else {
                    // The table exists, now we need to check if all the data from exerciseData is in the table
                    console.log("table exists");
                    tx.executeSql(
                        'SELECT name FROM exercises;',
                        [],
                        (_, { rows }) => {
                            let dbExerciseNames = [];
                            for (let i = 0; i < rows.length; i++) {
                                dbExerciseNames.push(rows.item(i).name);
                            }

                            let missingExercises = exerciseData.filter(({ name }) => !dbExerciseNames.includes(name));

                            // There are exercises from exerciseData that are not in the table, so add them
                            missingExercises.forEach((exercise) => {
                                tx.executeSql(
                                    'INSERT INTO exercises (name) VALUES (?);',
                                    [exercise.name],
                                    (_, result) => console.log('Inserted missing exercise:', exercise.name),
                                    (_, error) => console.error('Error inserting missing exercise:', error)
                                );
                            });
                            console.log("inserted missing exercises");
                            callback(true);
                        },
                        (_, error) => console.error('Error checking exercise data:', error)
                    );
                }
            },
            (_, error) => console.error('Error checking if table exists:', error)
        );
    });
};

