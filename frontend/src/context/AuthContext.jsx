import { createContext, useContext, useState, useEffect } from 'react';
import * as authService from '../services/authService';

const AuthContext = createContext();

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const token = localStorage.getItem('token');
        const storedUser = localStorage.getItem('user');
        if (token && storedUser) {
            try {
                setUser(JSON.parse(storedUser));
            } catch (e) {
                console.error("Failed to parse user from local storage", e);
                localStorage.removeItem('user');
                localStorage.removeItem('token');
            }
        }
        setLoading(false);
    }, []);

    const login = async (email, password) => {
        try {
            const data = await authService.login(email, password);
            if (data.token) {
                localStorage.setItem('token', data.token);
                const user = {
                    _id: data._id,
                    name: data.name,
                    email: data.email,
                    isAdmin: data.isAdmin
                };
                localStorage.setItem('user', JSON.stringify(user));
                setUser(user);
            }
            return data;
        } catch (error) {
            throw error;
        }
    };

    const register = async (name, email, password) => {
        try {
            const data = await authService.register(name, email, password);
            if (data.token) {
                localStorage.setItem('token', data.token);
                const user = {
                    _id: data._id,
                    name: data.name,
                    email: data.email,
                    isAdmin: data.isAdmin
                };
                localStorage.setItem('user', JSON.stringify(user));
                setUser(user);
            }
            return data;
        } catch (error) {
            throw error;
        }
    };

    const logout = () => {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        setUser(null);
        // Optional: Redirect to home or login
    };

    const value = {
        user,
        loading,
        login,
        register,
        logout,
        isAuthenticated: !!user,
    };

    return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
