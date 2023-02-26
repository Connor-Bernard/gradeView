import React, { useEffect, useState } from 'react';
import { Outlet, Navigate } from 'react-router-dom';
import api from '../utils/api';
import Loader from './Loader';

export default function PrivateRoutes(){
    const [loaded, setLoaded] = useState(false);
    const [authorized, setAuthorized] = useState(false);
    useEffect(() => {
        if(localStorage.getItem('token') === ''){
            return;
        }
        let mounted = true;
        api.get('/verifyaccess').then((res) => {
            if(mounted){
                setAuthorized(res.data);
            }
            setLoaded(true);
        });
        return () => mounted = false;
    }, []);

    return (
        loaded ? authorized ? <Outlet /> : <Navigate to='/login'/> : <Loader />
        
    )
}