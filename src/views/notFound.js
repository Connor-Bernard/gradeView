import React from 'react'
import { Box, Typography } from '@mui/material';

export default function NotFound(){
    return (
        <>
        <Box sx={{width:'100%', display:'flex', flexDirection:'column', alignItems:'center', position:'absolute', top:'50%', transform:'translate(0, -50%)'}}>
            <Typography variant='h1' component={Box} sx={{fontWeight:'600'}}>
                404
            </Typography>
            <Typography variant='h4' component={Box} sx={{marginBottom:'10px', textAlign:'center'}}>
                Oops!  Looks like you made it here by mistake!
            </Typography>
            <Typography sx={{marginBottom:'20px'}}>
                Here's a gif of a cat though :D
            </Typography>
                <img src="https://cataas.com/cat/gif" alt='Funny gif of a cat.' />
        </Box>
        </>
    );
}