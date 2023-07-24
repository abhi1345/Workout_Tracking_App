import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, TouchableOpacity } from 'react-native';
import { createClient } from '@supabase/supabase-js'
import AsyncStorage from '@react-native-async-storage/async-storage';
import styles from './styles';

export const SignInScreen = ({ route }) => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');


    const supabase = createClient("https://mvxzzlpznfutepjuqbrx.supabase.co", "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im12eHp6bHB6bmZ1dGVwanVxYnJ4Iiwicm9sZSI6ImFub24iLCJpYXQiOjE2ODg0NTI2MDksImV4cCI6MjAwNDAyODYwOX0.uD4ANRSC2LKE7vkcKarplw5qtEEGToE9hJFdcVb1QWQ", {
        auth: {
            storage: AsyncStorage,
            autoRefreshToken: true,
            persistSession: true,
            detectSessionInUrl: false,
        },
    });

    const fetchUserData = async () => {
        const { data: user } = await supabase.auth.getUser();
        console.log("Got user data", user);
    };

    useEffect(async () => {
        fetchUserData();
    }, []);



    const handleSignIn = async () => {
        // Handle sign-in logic here
        // For example, you could validate the username and password,
        // then send them to your backend service for verification.
        let { data, error } = await supabase.auth.signInWithPassword({
            email: username,
            password: password
        });

        console.log("Ran user login");
        console.log(data);

    };

    return (
        <View style={styles.container}>
            <View ><Text style={styles.signInScreenTitle}>Sign In</Text></View>

            <TextInput
                style={styles.signInInput}
                placeholder='Username'
                placeholderTextColor='white'
                onChangeText={text => setUsername(text)}
                value={username}
                autoCapitalize='none'
            />
            <TextInput
                style={styles.signInInput}
                placeholder='Password'
                placeholderTextColor='white'
                secureTextEntry
                autoCapitalize="none"
                onChangeText={text => setPassword(text)}
                value={password}
            />
            <TouchableOpacity
                style={styles.signInButton}
                onPress={handleSignIn}
            >
                <Text style={styles.saveWorkoutButtonText}>Sign In</Text>
            </TouchableOpacity>
        </View>
    );
};
