import React from 'react'
import { Button} from '@mui/material';
import { Link } from "react-router-dom";

export default function NavBarItem({ href, children }){
    return (
        <Link to={href} style={{textDecoration:'none',color:'inherit'}}>
            <Button color='inherit'>{children}</Button>
        </Link>
    );
}