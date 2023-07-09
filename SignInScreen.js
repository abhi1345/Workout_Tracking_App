import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity } from 'react-native';
import styles from './styles';

export const SignInScreen = ({ route }) => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');

    const handleSignIn = () => {
        // Handle sign-in logic here
        // For example, you could validate the username and password,
        // then send them to your backend service for verification.
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
