import { createContext, useContext, useState, useEffect } from 'react';
import authService from '../services/authService';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        checkUser();
    }, []);

    const checkUser = async () => {
        setLoading(true);
        try {
            const response = await authService.getUser();
            setUser(response?.error ? null : response);
        } catch {
            setUser(null);
        }
        setLoading(false);
    };

    const login = async (email, password) => {
        try {
            const response = await authService.login(email, password);
            if (response?.error) return response;

            await checkUser();
            return { success: true };
        } catch {
            return { error: 'Login failed. Please try again.' };
        }
    };

    const register = async (email, password) => {
        try {
            const response = await authService.register(email, password);
            if (response?.error) return response;

            return login(email, password);
        } catch {
            return { error: 'Registration failed. Please try again.' };
        }
    };

    const logout = async () => {
        try {
            await authService.logout();
        } finally {
            setUser(null);
        }
    };

    return (
        <AuthContext.Provider value={{ user, login, register, logout, loading }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => useContext(AuthContext);
