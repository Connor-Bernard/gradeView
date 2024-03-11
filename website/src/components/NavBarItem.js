import React from 'react'
import { Button, Link } from '@mui/material';
import { NavLink, useMatch } from 'react-router-dom';

export default function NavBarItem({ href, children }){

    const match = useMatch(href);
    return (
        <Link component={NavLink} to={href} color='inherit' underline='none'>
          <Button
            color='inherit'
            sx={{
              backgroundColor: match ? '#1F7CD5' : 'inherit',
              '&:hover': {
                backgroundColor: 'lightblue', 
              }
            }}
          >
            {children}
          </Button>
        </Link>
      );
}
