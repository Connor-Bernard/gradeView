import React from 'react';
import { useContext, useEffect, useState } from 'react';
import {
    AppBar,
    Box,
    Toolbar,
    Typography,
    Button,
    Link,
    Avatar,
    Menu,
    MenuItem,
    IconButton,
    useMediaQuery,
    FormControl, InputLabel, Select
} from '@mui/material'
import {
    LoginOutlined,
    StorageOutlined,
    AccountCircleOutlined,
    AccountTree,
    Logout
} from '@mui/icons-material';
import MenuIcon from '@mui/icons-material/Menu';
import api from '../utils/api';
import NavBarItem from './NavBarItem';
import NavMenuItem from './NavMenuItem';
import { StudentSelectionContext } from "./StudentSelectionWrapper";

export default function ButtonAppBar() {
    const mobileView = useMediaQuery('(max-width:600px)');
    const [loggedIn, setLoginStatus] = useState(!!localStorage.getItem('token'));
    const { selectedStudent, setSelectedStudent } = useContext(StudentSelectionContext);
    const [isAdmin, setAdminStatus] = useState(false);

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
    const [anchorEl, setAnchorEl] = useState(null);

    useEffect(() => {
        let mounted = true;
        if (loggedIn) {
            updateTabs(() => tabList);
            api.get('/profilepicture').then((res) => {
                if (mounted) {
                    updateProfilePicture(res.data);
                }
            }).catch((e) => {
                console.log(e);
            });
        }
        return () => mounted = false;
    }, [loggedIn]);

    function renderMenuItems() {
        return tabs.map((tab) => (
            <NavMenuItem
                icon={tab.icon}
                text={tab.name}
                onClick={() => { window.location.href = tab.href }}
            />
        ));
    }

    // Set up handlers for user menu
    function handleMenu(e) {
        setAnchorEl(e.currentTarget);
    }
    function handleClose() {
        setAnchorEl(null);
    }
    function doLogout() {
        localStorage.setItem('token', '');
        localStorage.setItem('email', '');
        setLoginStatus(false);
        window.location.reload(false);
    }

    // Moved from home.js
    function loadStudentData(e) {
        setSelectedStudent(e.target.value);
    }

    const [students, setStudents] = useState([]);
    useEffect(() => {
        let mounted = true;
        if (isAdmin) {
            api.get('/admin/students').then((res) => {
                if (mounted) {
                    setStudents(res.data);
                    setSelectedStudent(res.data[0][1]);
                }
            });
        }
        return () => mounted = false;
    }, [isAdmin]);

    useEffect(() => {
        let mounted = true;
        if (loggedIn) {
            // Update user admin status
            api.get('/isadmin').then((res) => {
                if (mounted) {
                    setAdminStatus(res.data);
                }
                return () => mounted = false;
            });
        }
    }, [loggedIn]);

    return (
        <Box sx={{ flexGrow: 1 }}>
            <AppBar position='static'>
                <Toolbar>
                    <Box sx={{ flexGrow: 1, gap: '20px' }} display='flex'>
                        <Typography variant='h6' component='div' display='inline-block'>
                            <a href='/' style={{ textDecoration: 'none', color: 'inherit' }}>Grade Viewer</a>
                        </Typography>
                        {!mobileView &&
                            <>
                                {loggedIn &&
                                    <NavBarItem href='/'>My Grades</NavBarItem>
                                }
                                <NavBarItem href='/buckets'>Buckets</NavBarItem>
                                <NavBarItem href='/conceptmap'>Concept Map</NavBarItem>
                            </>
                        }
                    </Box>
                    {loggedIn ?
                        (
                            <>
                                {isAdmin &&
                                    <Box>
                                        <FormControl size='small' sx={{ m: 1, minWidth: 100 }} variant={"filled"}>
                                            <InputLabel id='student-dropdown-label'>Student</InputLabel>
                                            <Select
                                                labelId='student-dropdown-label'
                                                id='student-dropdown'
                                                label='student'
                                                onChange={loadStudentData}
                                                style={{ backgroundColor: "white" }}
                                                defaultValue={selectedStudent}
                                            >
                                                {
                                                    students.map((student) => (
                                                        <MenuItem key={student[1]} value={student[1]}>{student[0]}</MenuItem>
                                                    ))
                                                }
                                            </Select>
                                        </FormControl>
                                    </Box>
                                }
                                <IconButton onClick={handleMenu} >
                                    <Avatar src={profilePicture} imgProps={{ referrerPolicy: 'no-referrer' }} />
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
                                    {mobileView &&
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
                                {mobileView ?
                                    <>
                                        <IconButton onClick={handleMenu} color="inherit">
                                            <MenuIcon />
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
