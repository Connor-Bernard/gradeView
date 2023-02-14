import { useEffect, useState } from 'react';
import { AppBar, Box, Toolbar, Typography, Button, Link, Avatar, Menu, MenuItem, IconButton, useMediaQuery } from '@mui/material'
import api from '../utils/api';
import NavBarItem from './NavBarItem';

export default function ButtonAppBar() {

    const mobileView = useMediaQuery('(max-width:600px)');
    const [loggedIn, setLoginStatus] = useState(localStorage.getItem('token') ? true : false);

    // Sets up the profile picture on element load by getting pfp url from api
    // This also serves as a auth verification
    const [profilePicture, updateProfilePicture] = useState('');
    const [tabs, updateTabs] = useState([{name:'Buckets', href:'/buckets'}]);
    useEffect(() => {
        let mounted = true;
        if(loggedIn){
            updateTabs((tabs) => [{name:'Profile', href:'/'}, ...tabs]);
            api.get('/profilepicture').then((res) => {
                if(mounted){
                    updateProfilePicture(res.data);
                }
            }).catch((e) => {
                console.log(e);
            });
        }
        return () => mounted = false;
    }, [loggedIn]);

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
        setLoginStatus(false);
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
                        { !mobileView &&
                            <>
                            {loggedIn &&
                                <NavBarItem href='/'>My Grades</NavBarItem>
                            }
                            <NavBarItem href='/buckets'>Buckets</NavBarItem>
                            </>
                        }
                    </Box>
                    { loggedIn ?
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
                                { mobileView &&
                                    tabs.map((tab) => (
                                        <MenuItem key={tab.name} onClick={() => {window.location = tab.href}}>{tab.name}</MenuItem>
                                    ))
                                }
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