import React from 'react'
import { Button, Link } from '@mui/material';

export default function NavBarItem(props){
    return (
        <Link href={props.href} color='inherit' underline='none'>
            <Button color='inherit'>{props.children}</Button>
        </Link>
    );
}