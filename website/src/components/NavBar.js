import React from 'react';
import { useEffect, useState } from 'react';
import {
    AppBar,
    Box,
    Toolbar,
    Typography,
    Button,
    Link,
    Avatar,
    Menu,
    IconButton,
    useMediaQuery,
} from '@mui/material';
import {
    LoginOutlined,
    StorageOutlined,
    AccountCircleOutlined,
    AccountTree,
    Logout
} from '@mui/icons-material';
import  MenuIcon from '@mui/icons-material/Menu';
import api from '../utils/api';
import NavBarItem from './NavBarItem';
import NavMenuItem from './NavMenuItem';

export default function ButtonAppBar() {
    const mobileView = useMediaQuery('(max-width:600px)');
    const [loggedIn, setLoginStatus] = useState(localStorage.getItem('token') ? true : false);
    // Sets up the profile picture on element load by getting pfp url from api
    // This also serves as a auth verification
    const [profilePicture, updateProfilePicture] = useState('');
    const tabList = [
        {
            name: 'Profile',
            href: '/',
            icon: <AccountCircleOutlined />,
        },
        {
            name: 'Buckets',
            href: '/buckets',
            icon: <StorageOutlined />,
        },
        {
            name: 'Concept Map',
            href: '/conceptmap',
            icon: <AccountTree />,
        },
    ];

    const [tabs, updateTabs] = useState(tabList.slice(1));

    const renderMenuItems = () => tabs.map((tab) => (
        <NavMenuItem
            icon={tab.icon}
            text={tab.name}
            onClick={() => { window.location.href = tab.href }}
        />
        
    ));


    useEffect(() => {
        let mounted = true;
        if(loggedIn){
            updateTabs((tabs) => tabList);
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
                            <NavBarItem href='/conceptmap'>Concept Map</NavBarItem>
                            </>
                        }
                    </Box>
                    { loggedIn ?
                    (
                        <>
                            <IconButton onClick={handleMenu} >
                                <Avatar src={profilePicture} imgProps={{referrerPolicy:'no-referrer'}} />
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
                                    renderMenuItems()
                                }
                                <NavMenuItem
                                    icon={<Logout />}
                                    text={"Logout"}
                                    onClick={doLogout}
                                />
                            </Menu>
                        </>
                    ) : (
                        <>
                            { mobileView ? 
                                <> 
                                    <IconButton onClick={handleMenu} color="inherit">
                                        <MenuIcon/> 
                                    </IconButton>    
                                    <Menu
                                        id='loggedInMenuMobile'
                                        anchorEl={anchorEl}
                                        anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
                                        keepMounted
                                        transformOrigin={{ vertical: 'top', horizontal: 'right' }}
                                        open={Boolean(anchorEl)}
                                        onClose={handleClose}
                                    >
                                        <NavMenuItem
                                            icon={<LoginOutlined />}
                                            text={"Login"}
                                            onClick={() => { window.location.href = '/login' }}
                                        />
                                        {renderMenuItems()}
                                    </Menu>  
                                </>
                            :  
                                <Link href='/login' color='inherit' underline='none'>
                                    <Button variant='outlined' color='inherit'>Login</Button>
                                </Link>
                            }
                    </>
                    )
                }
                </Toolbar>
            </AppBar>
        </Box>
    );
}
