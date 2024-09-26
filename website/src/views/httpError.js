import React from 'react';
import { Box, Typography } from '@mui/material';
import { useLocation } from 'react-router-dom';

// Default error text options
export const errorTextOptions = {
    404: 'Oops!  Looks like you made it here by mistake!',
    500: 'Oh no!  It looks like something went wrong on our end!',
    400: "Oops!  Looks like something went wrong :(",
}

/**
 * Error page for HTTP errors.
 * @param {Integer} errorCode
 * @param {string} errorText
 * @returns {JSX.Element} error page
 */
export default function HTTPError({ errorCode = 500, errorText }) {
    const state = useLocation().state || {};
    const finalErrorCode = state.errorCode || errorCode;
    const finalErrorText = errorText || errorTextOptions[finalErrorCode] || 'Oops!  Looks like something went wrong!';

    return (
        <Box
            sx={{
                width: '100%',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                position: 'absolute',
                top: '50%',
                transform: 'translate(0, -50%)'
            }}
        >
            <Typography variant='h1' component={Box} sx={{ fontWeight: '600' }}>
                {finalErrorCode}
            </Typography>
            <Typography variant='h4' component={Box} sx={{ marginBottom: '10px', textAlign: 'center' }}>
                {finalErrorText}
            </Typography>
            <Typography sx={{ marginBottom: '20px' }}>
                Here's a gif of a cat though :D
            </Typography>
            <img src="https://cataas.com/cat/gif" alt='Funny gif of a cat.' />
        </Box>
    );
}
