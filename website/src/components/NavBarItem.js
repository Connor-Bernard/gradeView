import React from 'react'
import { Button, Link } from '@mui/material';

export default function NavBarItem({ href, children }){
    return (
        <Link href={href} color='inherit' underline='none'>
            <Button color='inherit'>{children}</Button>
        </Link>
    );
}