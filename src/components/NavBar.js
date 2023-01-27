import * as React from 'react';
import { useEffect, useState } from 'react';
import { AppBar, Box, Toolbar, Typography, Button, Link, Avatar } from '@mui/material'
import api from '../utils/api';

export default function ButtonAppBar() {

    // Sets up the profile picture on element load by getting pfp url from api
    // This also serves as a auth verification
    const [profilePicture, updateProfilePicture] = useState('');
    useEffect(() => {
        let mounted = true;
        if(localStorage.getItem('token')){
            api.get('/profilepicture').then((res) => {
                if(mounted){
                    updateProfilePicture(res.data);
                }
            });
        }
        return () => mounted = false;
    }, []);

    function LogInButton(props){
        if(props.token){
            return (
                <Avatar src={profilePicture} />
            );
        } else {
            return (
                <Button variant='outlined' color='inherit'>Login</Button>
            );
        }
    }

    function NavBarItem(props){
        return (
            <Link href={props.href} color='inherit' underline='none'>
                <Button color='inherit'>{props.children}</Button>
            </Link>
        );
    }

    return (
        <Box sx={{ flexGrow: 1 }}>
            <AppBar position='static'>
                <Toolbar>
                    <Box sx={{flexGrow:1, gap:'20px'}} display='flex'>
                        <Typography variant='h6' component='div' display='inline-block'>
                            <a href='/' style={{textDecoration:'none',color:'inherit'}}>Grade Viewer</a>
                        </Typography>
                        <NavBarItem href='/'>My Grades</NavBarItem>
                        <NavBarItem href='/buckets'>Buckets</NavBarItem>
                    </Box>
                    <Link href='/login' color='inherit' underline='none'>
                        <LogInButton token={localStorage.getItem('token')} />
                    </Link>
                </Toolbar>
            </AppBar>
        </Box>
    );
}