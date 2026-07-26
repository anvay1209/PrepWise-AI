import { useContext } from "react";
import { AuthContext } from "../auth.context.jsx";
import { register, login, logout } from "../services/auth.api.js";

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
            return data;
        } catch (err) {
            const errorMessage = err.response?.data?.message || err.message || "Login failed";
            setError(errorMessage);
            console.error("Login error:", err);
            throw err;
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
            return data;
        } catch (err) {
            const errorMessage = err.response?.data?.message || err.message || "Registration failed";
            setError(errorMessage);
            console.error("Register error:", err);
            throw err;
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
            return true;
        } catch (err) {
            const errorMessage = err.response?.data?.message || err.message || "Logout failed";
            setError(errorMessage);
            console.error("Logout error:", err);
            throw err;
        } finally {
            setLoading(false);
        }
    }

    return { user, loading, error, handleLogin, handleRegister, handleLogout };
}
