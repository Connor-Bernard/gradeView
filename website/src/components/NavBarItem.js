import React from 'react'
import { Button, Link } from '@mui/material';
import { useLocation } from 'react-router-dom';

export default function NavBarItem({ href, children }) {
    const location = useLocation();
    const isActive = location.pathname === href;
    // Makes the text grey if the tab is active
    const activeStyle = {
        background: isActive? "#4169E1": "inherit",
        color: 'inherit',
    };

    return (
        <Link href={href} underline='none' style={activeStyle}>
            <Button color='inherit'>{children}</Button>
        </Link>
    );
}