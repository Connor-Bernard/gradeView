import React from 'react';
import { MenuItem, ListItemIcon, ListItemText } from '@mui/material';

function NavigationMenuItem({ icon, text, onClick }) {
    return (
        <MenuItem onClick={onClick} disableRipple>
            <ListItemIcon>
                {icon}
            </ListItemIcon>
            <ListItemText primary={text} />
        </MenuItem>
    );
}

export default NavigationMenuItem;
