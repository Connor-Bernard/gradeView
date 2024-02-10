import React, { useEffect, useState } from 'react';

import api from '../utils/api';

import ConceptMap from '../components/ConceptMap';

export default function ConceptMapView() {
    const [outlineData, setOutlineData] = useState({});
    useEffect(() => {
        let mounted = true;
        api.get('/pgrstructure').then((res) => {
            if (mounted) {
                setOutlineData(res.data);
            }
        });
        return () => mounted = false;
    }, []);

    return (
        <div>
            <h1>Concept Map</h1>
            <ConceptMap outlineData={outlineData} />
        </div>
    );
}
