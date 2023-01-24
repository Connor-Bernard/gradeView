import * as React from 'react';
import { AppBar, Box, Toolbar, Typography, Button, IconButton, Link, Avatar, Menu } from '@mui/material'
import jwtDecode from 'jwt-decode';

export default function ButtonAppBar() {

    function LogInButton(props){
        if(props.isLoggedIn){
            let token = localStorage.getItem('token');
            return (
                <Avatar src={jwtDecode(token).picture} />
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
        )
    }

    return (
        <Box sx={{ flexGrow: 1 }}>
            <AppBar position='static'>
                <Toolbar>
                    <Box sx={{flexGrow:1, gap:'20px'}} display='flex'>
                        <Typography variant='h6' component='div' display='inline-block'>
                            <a href='/' style={{textDecoration:'none',color:'inherit'}}>Grade Viewer</a>
                        </Typography>
                        <NavBarItem href='/'>Grades</NavBarItem>
                        <NavBarItem href='/buckets'>Buckets</NavBarItem>
                    </Box>
                    <Link href='/login' color='inherit' underline='none'>
                        <LogInButton isLoggedIn={localStorage.getItem('token') !== null} />
                    </Link>
                </Toolbar>
            </AppBar>
        </Box>
    );
}