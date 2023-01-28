import * as React from 'react';
import { useEffect, useState } from 'react';
import { AppBar, Box, Toolbar, Typography, Button, Link, Avatar, Menu, MenuItem, IconButton } from '@mui/material'
import api from '../utils/api';
import NavBarItem from './NavBarItem';

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

    // Set up handlers for user menu
    const [anchorEl, setAnchorEl] = useState(null);
    function handleMenu(e){
        setAnchorEl(e.currentTarget);
    }
    function handleClose(){
        setAnchorEl(null);
    }
    function doLogout(){
        localStorage.setItem('token', '');
        window.location.reload(false);
    }

    return (
        <Box sx={{ flexGrow: 1 }}>
            <AppBar position='static'>
                <Toolbar>
                    <Box sx={{flexGrow:1, gap:'20px'}} display='flex'>
                        <Typography variant='h6' component='div' display='inline-block'>
                            <a href='/' style={{textDecoration:'none',color:'inherit'}}>Grade Viewer</a>
                        </Typography>
                        {localStorage.getItem('token') &&
                            <NavBarItem href='/'>My Grades</NavBarItem>
                        }
                        <NavBarItem href='/buckets'>Buckets</NavBarItem>
                    </Box>
                    { localStorage.getItem('token') ?
                    (
                        <>
                            <IconButton onClick={handleMenu} >
                                <Avatar src={profilePicture} />
                            </IconButton>
                            <Menu
                                id='loggedInMenu'
                                anchorEl={anchorEl}
                                anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
                                keepMounted
                                transformOrigin={{ vertical: 'top', horizontal: 'right' }}
                                open={Boolean(anchorEl)}
                                onClose={handleClose}
                            >
                                <MenuItem onClick={doLogout}>Logout</MenuItem>
                            </Menu>
                        </>
                    ) : (
                        <Link href='/login' color='inherit' underline='none'>
                            <Button variant='outlined' color='inherit'>Login</Button>
                        </Link>
                    )
                }
                </Toolbar>
            </AppBar>
        </Box>
    );
}