import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button, TextField, Checkbox, FormControlLabel, LinearProgress, Snackbar, IconButton, InputAdornment, Typography, Paper } from '@mui/material';
import { Visibility, VisibilityOff } from '@mui/icons-material';
import AuthService from '../../services/AuthService/auth.service';

const Login = () => {
    const navigate = useNavigate();
    const passwordInputRef = useRef(null);
    
    const [state, setState] = useState({
        username: localStorage.getItem('username') || '',
        password: localStorage.getItem('password') || '',
        errorUsername: '',
        errorPassword: '',
    });

    const [loading, setLoading] = useState(false);
    const [rememberMe, setRememberMe] = useState(!!localStorage.getItem('remember'));
    const [error, setError] = useState('');
    const [showPassword, setShowPassword] = useState(false);

    // Check if user is already logged in
    useEffect(() => {
        const token = sessionStorage.getItem('token');
        if (token) {
            navigate('/');
        }
    }, [navigate]);

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setState(prev => ({
            ...prev,
            [name]: value,
            [`error${name.charAt(0).toUpperCase() + name.slice(1)}`]: ''
        }));
    };

    const validateForm = () => {
        let isValid = true;
        const newErrors = { errorUsername: '', errorPassword: '' };

        if (!state.username.trim()) {
            newErrors.errorUsername = 'Username is required';
            isValid = false;
        }

        if (!state.password) {
            newErrors.errorPassword = 'Password is required';
            isValid = false;
        }

        setState(prev => ({ ...prev, ...newErrors }));
        return isValid;
    };

    const handleLogin = (e) => {
        e.preventDefault();
        
        if (!validateForm()) return;
        
        setLoading(true);
        setError('');

        // First get IP address
        AuthService.getGetIP(
            // Success callback for getGetIP
            () => {
                // Then attempt login with credentials
                AuthService.loginWithCredentials(
                    {
                        username: state.username,
                        password: state.password,
                        isRemember: rememberMe,
                        isLogout: false
                    },
                    // Success callback for loginWithCredentials
                    (response) => {
                        // Store remember me preference
                        if (rememberMe) {
                            localStorage.setItem('username', state.username);
                            localStorage.setItem('password', state.password);
                            localStorage.setItem('remember', 'true');
                        } else {
                            localStorage.removeItem('username');
                            localStorage.removeItem('password');
                            localStorage.removeItem('remember');
                        }
                        
                        // Redirect to dashboard on successful login
                        navigate('/');
                    },
                    // Error callback for loginWithCredentials
                    (error) => {
                        setLoading(false);
                        if (error.response) {
                            if (error.response.status === 401) {
                                setError('Invalid username or password');
                            } else {
                                setError('An error occurred. Please try again.');
                            }
                        } else {
                            setError('Network error. Please check your connection.');
                        }
                    },
                    // Final callback
                    () => setLoading(false)
                );
            },
            // Error callback for getGetIP
            () => {
                setLoading(false);
                setError('Unable to connect to the server. Please try again.');
            }
        );
    };

    const handleKeyPress = (e) => {
        if (e.key === 'Enter') {
            if (e.target.name === 'username') {
                passwordInputRef.current?.focus();
            } else if (e.target.name === 'password') {
                handleLogin(e);
            }
        }
    };

    const togglePasswordVisibility = () => {
        setShowPassword(!showPassword);
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
            <div className="max-w-md w-full space-y-8">
                <div>
                    <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
                        Sign in to your account
                    </h2>
                </div>
                
                {loading && <LinearProgress />}
                
                <Paper elevation={3} className="p-8">
                    <form className="mt-8 space-y-6" onSubmit={handleLogin}>
                        {error && (
                            <div className="mb-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded">
                                {error}
                            </div>
                        )}
                        
                        <div className="rounded-md shadow-sm space-y-4">
                            <div>
                                <TextField
                                    fullWidth
                                    variant="outlined"
                                    label="Username"
                                    name="username"
                                    value={state.username}
                                    onChange={handleInputChange}
                                    onKeyPress={handleKeyPress}
                                    error={!!state.errorUsername}
                                    helperText={state.errorUsername}
                                    disabled={loading}
                                    autoComplete="username"
                                />
                            </div>
                            
                            <div>
                                <TextField
                                    fullWidth
                                    variant="outlined"
                                    label="Password"
                                    name="password"
                                    type={showPassword ? 'text' : 'password'}
                                    value={state.password}
                                    onChange={handleInputChange}
                                    onKeyPress={handleKeyPress}
                                    error={!!state.errorPassword}
                                    helperText={state.errorPassword}
                                    disabled={loading}
                                    inputRef={passwordInputRef}
                                    InputProps={{
                                        endAdornment: (
                                            <InputAdornment position="end">
                                                <IconButton
                                                    aria-label="toggle password visibility"
                                                    onClick={togglePasswordVisibility}
                                                    edge="end"
                                                >
                                                    {showPassword ? <VisibilityOff /> : <Visibility />}
                                                </IconButton>
                                            </InputAdornment>
                                        ),
                                    }}
                                />
                            </div>
                        </div>

                        <div className="flex items-center justify-between">
                            <FormControlLabel
                                control={
                                    <Checkbox
                                        checked={rememberMe}
                                        onChange={(e) => setRememberMe(e.target.checked)}
                                        color="primary"
                                        disabled={loading}
                                    />
                                }
                                label="Remember me"
                            />
                            
                            <div className="text-sm">
                                <a href="#" className="font-medium text-indigo-600 hover:text-indigo-500">
                                    Forgot your password?
                                </a>
                            </div>
                        </div>

                        <div>
                            <Button
                                type="submit"
                                fullWidth
                                variant="contained"
                                color="primary"
                                disabled={loading}
                                className="py-2"
                            >
                                {loading ? 'Signing in...' : 'Sign in'}
                            </Button>
                        </div>
                    </form>
                </Paper>
                
                <div className="text-center text-sm">
                    <span className="text-gray-600">Don't have an account? </span>
                    <a href="#" className="font-medium text-indigo-600 hover:text-indigo-500">
                        Contact administrator
                    </a>
                </div>
            </div>
        </div>
    );
};

export default Login;
