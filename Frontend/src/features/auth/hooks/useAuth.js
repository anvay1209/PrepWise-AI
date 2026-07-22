import { useContext, useEffect } from "react";
import { AuthContext } from "../auth.context.jsx";
import { register, login, logout, getMe } from "../services/auth.api.js";

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error("useAuth must be used within an AuthProvider");
    }
    const { user, loading, error, setUser, setLoading, setError } = context;

    const handleLogin = async (email, password) => {
        setLoading(true);
        setError(null);
        try {
            const data = await login({ email, password });
            if (data && data.user) {
                setUser(data.user);
            }
        } catch (err) {
            const errorMessage = err.response?.data?.message || err.message || "Login failed";
            setError(errorMessage);
            console.error("Login error:", err);
        } finally {
            setLoading(false);
        }
    }

    const handleRegister = async (username, email, password) => {
        setLoading(true);
        setError(null);
        try {
            const data = await register({ username, email, password });
            if (data && data.user) {
                setUser(data.user);
            }
        } catch (err) {
            const errorMessage = err.response?.data?.message || err.message || "Registration failed";
            setError(errorMessage);
            console.error("Register error:", err);
        } finally {
            setLoading(false);
        }
    }

    const handleLogout = async () => {
        setLoading(true);
        setError(null);
        try {
            await logout();
            setUser(null);
        } catch (err) {
            const errorMessage = err.response?.data?.message || err.message || "Logout failed";
            setError(errorMessage);
            console.error("Logout error:", err);
        } finally {
            setLoading(false);
        }
    }
        useEffect(() => {
        const getAndSetUser = async () => {
                try {
                    const data = await getMe();
                    setUser(data && data.user ? data.user : null);
                } catch (err) {
                    setUser(null);
                } finally {
                    setLoading(false);
                }
            };

            getAndSetUser();
        }, []);

    return { user, loading, error, handleLogin, handleRegister, handleLogout };
}
