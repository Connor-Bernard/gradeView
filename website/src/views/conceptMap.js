import React, { useEffect, useRef, useState } from 'react';

import api from '../utils/api';
import ConceptMapTree from '../components/ConceptMapTree';
import PageHeader from '../components/PageHeader';

export default function ConceptMap() {
    const treeContainerRef = useRef(null);

    const [outlineData, setOutlineData] = useState({});
    const [week, setWeek] = useState(0);
    const [containerDimensions, setContainerDimensions] = useState({ width: 0, height: 0 });

    function updateContainerDimensions() {
        if (treeContainerRef.current) {
            setContainerDimensions({
                width: treeContainerRef.current.offsetWidth,
                height: treeContainerRef.current.offsetHeight,
            });
        }
    }

    function calculateWeek(startDateTime) {
        const diffDateTime = Math.abs(Date.now() - startDateTime);
        return Math.ceil(diffDateTime / (1000 * 7 * 24 * 60 * 60));
    }

    useEffect(() => {
        updateContainerDimensions();
        window.addEventListener('resize', updateContainerDimensions);
        return () => window.removeEventListener('resize', updateContainerDimensions);
    }, [treeContainerRef]);

    useEffect(() => {
        let mounted = true;
        api.get('/pgrstructure').then((res) => {
            if (mounted && res?.data) {
                setWeek(calculateWeek(Date.parse(res.data['start date'])));
                setOutlineData(res.data);
            }
        });
        return () => mounted = false;
    }, []);

    return (
        <>
            <PageHeader>Concept Map</PageHeader>
            <div ref={treeContainerRef} style={{ width: '100%', height: '100%', paddingLeft: '20px' }}>
                <ConceptMapTree
                    outlineData={outlineData}
                    dimensions={containerDimensions}
                    currWeek={week}
                />
            </div>
        </>
    );
}
