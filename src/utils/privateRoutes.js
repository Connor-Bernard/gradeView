import React, { useEffect, useState } from 'react';
import { Outlet, Navigate } from 'react-router-dom';
import api from './api';

export default function PrivateRoutes(){
    const [authorized, setAuthorized] = useState('false');
    useEffect(() => {
        let mounted = true;
        api.get('/verifyaccess').then(() => {
            if(mounted){
                setAuthorized(true);
            }
        });
        return () => mounted = false;
    }, []);

    return (
        authorized ? <Outlet /> : <Navigate to='/login/' />
    )
}