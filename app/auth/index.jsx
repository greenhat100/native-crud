import { useState } from 'react';
import { View, Text, StyleSheet, TextInput, TouchableOpacity, Alert } from 'react-native';
import { useAuth } from '@/contexts/AuthContext';
import { useRouter } from 'expo-router';

const AuthScreen = () => {
    const { login, register } = useAuth();
    const router = useRouter();
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [isRegistering, setIsRegistering] = useState(false);
    const [error, setError] = useState('');

    const handleAuth = async () => {
        setError('');

        if (!email.trim() || !password.trim()) {
            setError('Email and password are required.');
            return;
        }

        if (isRegistering && password !== confirmPassword) {
            setError('Passwords do not match.');
            return;
        }

        const response = isRegistering
            ? await register(email, password)
            : await login(email, password);

        if (response?.error) {
            setError(response.error);
            return;
        }

        Alert.alert(isRegistering ? 'Registration Successful' : 'Login Successful', `Welcome, ${email}!`);
        router.replace('/notes');
    };

    return (
        <View style={styles.container}>
            <Text style={styles.header}>{isRegistering ? 'Sign Up' : 'Login'}</Text>
            {error ? <Text style={styles.error}>{error}</Text> : null}

            <TextInput
                style={styles.input}
                placeholder="Email Address"
                placeholderTextColor="#aaa"
                value={email}
                onChangeText={setEmail}
                autoCapitalize="none"
                keyboardType="email-address"
            />
            <TextInput
                style={styles.input}
                placeholder="Password"
                placeholderTextColor="#aaa"
                value={password}
                onChangeText={setPassword}
                secureTextEntry
                textContentType='none'
            />
            {isRegistering && (
                <TextInput
                    style={styles.input}
                    placeholder="Confirm Password"
                    placeholderTextColor="#aaa"
                    value={confirmPassword}
                    onChangeText={setConfirmPassword}
                    secureTextEntry
                    textContentType='none'
                />
            )}

            <TouchableOpacity style={styles.button} onPress={handleAuth}>
                <Text style={styles.buttonText}>{isRegistering ? 'Sign Up' : 'Login'}</Text>
            </TouchableOpacity>

            <TouchableOpacity onPress={() => setIsRegistering(!isRegistering)}>
                <Text style={styles.switchText}>
                    {isRegistering ? 'Already have an account? Login' : "Don't have an account? Register"}
                </Text>
            </TouchableOpacity>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        padding: 20,
        backgroundColor: '#f8f9fa',
    },
    header: {
        fontSize: 28,
        fontWeight: 'bold',
        marginBottom: 20,
        color: '#333',
    },
    error: {
        color: 'red',
        marginBottom: 10,
        fontSize: 16,
    },
    input: {
        width: '100%',
        padding: 12,
        borderWidth: 1,
        borderRadius: 8,
        marginBottom: 12,
        fontSize: 18,
        backgroundColor: '#fff',
        borderColor: '#ccc',
    },
    button: {
        backgroundColor: '#007bff',
        paddingVertical: 12,
        borderRadius: 8,
        width: '100%',
        alignItems: 'center',
        marginTop: 10,
    },
    buttonText: {
        color: '#fff',
        fontSize: 18,
        fontWeight: 'bold',
    },
    switchText: {
        marginTop: 10,
        color: '#007bff',
        fontSize: 16,
    },
});

export default AuthScreen;
