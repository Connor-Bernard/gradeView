import React from 'react';
import { useEffect, useState } from 'react';
import Visibility from '@mui/icons-material/Visibility';
import VisibilityOff from '@mui/icons-material/VisibilityOff';
import { OutlinedInput, Stack, Button, InputAdornment, IconButton, FormControl, InputLabel, Typography, Alert } from '@mui/material';
import axios from 'axios';
import jwtDecode from 'jwt-decode';
import DOMPurify from 'dompurify';

export default function Login() {
    const [error, setError] = useState(false);

    // Initialize the google OAUTH
    useEffect(() => {
        /* global google */
        google.accounts.id.initialize({
            client_id: "435032403387-5sph719eh205fc6ks0taft7ojvgipdji.apps.googleusercontent.com",
            callback: handleGoogleLogin
        });
        google.accounts.id.renderButton(
            document.querySelector("#googleSignInButton"), {}
        );
    }, []);


    // Updates OAuth2 token to be the local token value
    async function handleGoogleLogin(authData) {
        const token = `Bearer ${authData.credential}`;
        axios.get(`/api/v2/login`, {
            headers: { 'Authorization': token }
        }).then((loginRes) => {
            if (!loginRes.data.status) {
                setError('You are not a registered student or admin.');
                return;
            } else {
                localStorage.setItem('token', token);
                // TODO: this is pretty awful.  We should have this in a context or something.
                localStorage.setItem('email', jwtDecode(authData.credential)?.email);
                localStorage.setItem('profilepicture', DOMPurify.sanitize(jwtDecode(authData.credential)?.picture));
                window.location.reload(false);
            }
        }).catch(() => {
            setError('An error occured.  Please try again later.');
        });
    }

    // Formatting for the input fields
    const [showPassword, setShowPassword] = React.useState(false);
    const handleClickShowPassword = () => setShowPassword((show) => !show);
    const handleMouseDownPassword = (event) => {
        event.preventDefault();
    };

    const [username, setUsername] = React.useState('');
    const [password, setPassword] = React.useState('');

    function handleLogin(e) {
        e.preventDefault();
        console.log(username + ' ' + password);
        // TODO: Make a post request to the server to verify username and password
        // TODO: store retreived JWT token to localStorage
    }

    return (
        <>
            <form>
                <Stack spacing={2} sx={{ alignItems: 'center', justifyContent: 'center', width: '100%', position: 'absolute', top: '50%', transform: 'translate(0, -50%)' }}>
                    <Typography variant='h3' sx={{ fontWeight: 500 }}>Login</Typography>
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
                    {error &&
                        <Alert severity='error'>{error}</Alert>
                    }
                    <Button variant='contained' size="large" onClick={handleLogin}>Login</Button>
                    <p><i>or</i></p>
                    <div id="googleSignInButton"></div>
                </Stack>
            </form>
        </>
    );
}
