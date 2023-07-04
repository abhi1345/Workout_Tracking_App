// db.js

import * as SQLite from 'expo-sqlite';
import { exerciseData } from './ExerciseList.js';


const db = SQLite.openDatabase('workouts.db');



export const createExerciseTable = () => {
    return new Promise((resolve, reject) => {
        db.transaction((tx) => {
            // delete the existing table
            tx.executeSql(
                'DROP TABLE IF EXISTS exercises;',
                [],
                () => {
                    // create a new table
                    tx.executeSql(
                        'CREATE TABLE exercises (id INTEGER PRIMARY KEY AUTOINCREMENT, name TEXT, type TEXT, equipment TEXT, primary_muscle TEXT);',
                        [],
                        () => {
                            console.log('exercises table created successfully');
                            resolve();
                        },
                        (_, error) => {
                            console.error('Error creating exercise table:', error);
                            reject(error);
                        }
                    );
                },
                (_, error) => {
                    console.error('Error dropping exercise table:', error);
                    reject(error);
                }
            );
        });
    });
};

export const insertExerciseData = (exerciseData) => {
    return new Promise((resolve, reject) => {
        exerciseData.forEach((exercise) => {
            const { name, type, equipment, primary_muscle } = exercise;

            db.transaction((tx) => {
                tx.executeSql(
                    'INSERT INTO exercises (name, type, equipment, primary_muscle) VALUES (?, ?, ?, ?)',
                    [name, type, equipment, primary_muscle],
                    () => {
                        console.log('Inserted exercise data successfully for', exercise);
                        resolve();
                    },
                    (_, error) => {
                        console.error('Error inserting exercise data:', error);
                        reject(error);
                    }
                );
            });
        });
    });
};


export const checkExerciseTableAccurate = (callback) => {
    db.transaction((tx) => {
        tx.executeSql(
            "SELECT name FROM sqlite_master WHERE type='table' AND name='exercises';",
            [],
            (_, { rows: { _array } }) => {
                if (_array.length === 0) {
                    console.log("no rows found in exercises table when checking");
                    callback(false);
                } else {
                    // The table exists, now we need to check if all the data from exerciseData is in the table
                    console.log("exercises table exists, rows found");
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
                            console.log("inserted missing exercises:", missingExercises);
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

