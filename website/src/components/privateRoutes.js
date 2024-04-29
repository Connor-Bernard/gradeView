import React, { useEffect, useState } from 'react';
import { Outlet, Navigate } from 'react-router-dom';
import apiv2 from '../utils/apiv2';
import Loader from './Loader';

export default function PrivateRoutes() {
    const [loaded, setLoaded] = useState(false);
    const [authorized, setAuthorized] = useState(false);
    useEffect(() => {
        if(localStorage.getItem('token') === ''){
            setAuthorized(false);
            setLoaded(true);
            return;
        }
        let mounted = true;
        apiv2.get('/login').then((res) => {
            if (mounted) {
                setAuthorized(res.data.status);
            }
            setLoaded(true);
        });
        return () => mounted = false;
    }, []);

    return (
        loaded ? authorized ? <Outlet /> : <Navigate to='/login'/> : <Loader />
    )
}