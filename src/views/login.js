import React from 'react';
import { useEffect, useState } from 'react';
import Visibility from '@mui/icons-material/Visibility';
import VisibilityOff from '@mui/icons-material/VisibilityOff';
import { OutlinedInput, Stack, Button, InputAdornment, IconButton, FormControl, InputLabel, Typography } from '@mui/material';
import { WEBURL } from '../utils/api';
import '../css/login.css';
import { Navigate } from 'react-router-dom';


export default function Login(){

    // Initialize the google OAUTH
    useEffect(() => {
        /* global google */
        google.accounts.id.initialize({
            client_id: "435032403387-5sph719eh205fc6ks0taft7ojvgipdji.apps.googleusercontent.com",
            callback: handleGoogleLogin
        })
        google.accounts.id.renderButton(
            document.querySelector("#googleSignInButton"),{}
        );
    }, []);

    function handleGoogleLogin(response) {
        localStorage.setItem("token", response.credential);
        window.location.reload(false);
    }

    // Formatting for the input fields
    const [showPassword, setShowPassword] = React.useState(false);
    const handleClickShowPassword = () => setShowPassword((show) => !show);
    const handleMouseDownPassword = (event) => {
        event.preventDefault();
    };

    const [username, setUsername] = React.useState('');
    const [password, setPassword] = React.useState('');

    const handleLogin = (e) => {
        e.preventDefault();
        console.log(username + ' ' + password);
        // TODO: Make a post request to the server to verify username and password
        // TODO: store retreived JWT token to localStorage
    }
    
    // TODO: use this to create error messages
    const [error, setError] = useState(false);

    if (localStorage.getItem('token')) {
        return (
            <Navigate to='/' />
        );
    }
    return (
        <>
        <form>
            <Stack id="loginStack" spacing={2} alignItems='center' justifyContent="center">
                <Typography variant='h3' sx={{fontWeight:500}}>Login</Typography>
                <FormControl sx={{ m: 1, width: '25ch' }} variant="outlined">
                    <InputLabel htmlFor="username">Username</InputLabel>
                    <OutlinedInput
                        id='username'
                        autoComplete='username'
                        label='Username'
                        onChange={(e) => {
                            setUsername(e.target.value);
                        }}
                    />
                </FormControl>
                <FormControl sx={{ m: 1, width: '25ch' }} variant="outlined">
                    <InputLabel htmlFor="password">Password</InputLabel>
                    <OutlinedInput
                        id="password"
                        type={showPassword ? 'text' : 'password'}
                        autoComplete='current-password'
                        endAdornment={
                            <InputAdornment position="end">
                                <IconButton
                                    aria-label="toggle password visibility"
                                    onClick={handleClickShowPassword}
                                    onMouseDown={handleMouseDownPassword}
                                    edge="end"
                                >
                                    {showPassword ? <VisibilityOff /> : <Visibility />}
                                </IconButton>
                            </InputAdornment>
                        }
                        label="Password"
                        onChange={(e) => {
                            setPassword(e.target.value);
                        }}
                    />
                </FormControl>
                <Button variant='contained' size="large" onClick={handleLogin}>Login</Button>
                <p><i>or</i></p>
                <div id="googleSignInButton"></div>
            </Stack>
        </form>
        </>
    );
}
