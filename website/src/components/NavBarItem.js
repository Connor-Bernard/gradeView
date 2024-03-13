import React from 'react'
import { Button, Link, Box } from '@mui/material';
import { NavLink, useMatch } from 'react-router-dom';

export default function NavBarItem({ href, children }){
    const match = useMatch(href);
    return (
        <Link component={NavLink} to={href} color='inherit' >
          <Button sx={{ color: 'inherit', opacity: match ? 1 : 0.7 }}>
            {children}
            {match && (
              <Box
                className="underline"
                sx={{
                  position: 'absolute',
                  bottom: 0, // Position at the bottom of the button
                  left: '50%',
                  transform: 'translateX(-50%)', // Center the Box
                  width: '100%',
                  height: '2px', // Thickness of the underline
                  backgroundColor: 'currentColor', // Use the text color for the underline
                }}
              />
          )}
        </Button>
      </Link>
    );
}
