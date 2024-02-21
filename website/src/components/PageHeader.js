import React from 'react';
import { Typography } from '@mui/material';

export default function PageHeader({ children }) {
    return (
        <Typography variant='h5' component='div' sx={{m:2, fontWeight:500}}>
            {children}
        </Typography>
    );
}
