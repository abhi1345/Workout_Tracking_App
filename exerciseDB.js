// db.js

import * as SQLite from 'expo-sqlite';

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



export const checkTableExists = (callback) => {
    db.transaction((tx) => {
        tx.executeSql(
            "SELECT name FROM sqlite_master WHERE type='table' AND name='exercises';",
            [],
            (_, { rows: { _array } }) => {
                if (_array.length === 0) {
                    callback(false);
                } else {
                    callback(true);
                }
            },
            (_, error) => console.error('Error checking if table exists:', error)
        );
    });
};
