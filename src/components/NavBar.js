import * as React from 'react';
import { AppBar, Box, Toolbar, Typography, Button, IconButton, Link, Avatar } from '@mui/material'
import MenuIcon from '@mui/icons-material/Menu';
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
                <Button variant="outlined" color="inherit">Login</Button>
            );
        }
    }

    return (
        <Box sx={{ flexGrow: 1 }}>
            <AppBar position="static">
                <Toolbar>
                    <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
                        <a href="/" style={{textDecoration:"none",color:"inherit"}}>Grade Viewer</a>
                    </Typography>
                    <Link href="/login" color="inherit" underline="none">
                        <LogInButton isLoggedIn={localStorage.getItem("token") !== null} />
                    </Link>
                </Toolbar>
            </AppBar>
        </Box>
    );
}