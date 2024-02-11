import React, { useEffect, useRef, useState } from 'react';

import api from '../utils/api';

import ConceptMapTree from '../components/ConceptMapTree';

export default function ConceptMap() {
    const treeContainerRef = useRef(null);

    const [outlineData, setOutlineData] = useState({});
    const [containerDimensions, setContainerDimensions] = useState({ width: 0, height: 0 });

    function updateContainerDimensions() {
        if (treeContainerRef.current) {
            setContainerDimensions({
                width: treeContainerRef.current.offsetWidth,
                height: treeContainerRef.current.offsetHeight,
            });
        }
    }

    useEffect(() => {
        updateContainerDimensions();
        window.addEventListener('resize', updateContainerDimensions);
        return () => window.removeEventListener('resize', updateContainerDimensions);
    }, [treeContainerRef]);

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
        <>
            <h1>Concept Map</h1>
            <div ref={treeContainerRef} style={{ width: '100%', height: '100%', paddingLeft: '20px' }}>
                <ConceptMapTree
                    outlineData={outlineData}
                    dimensions={containerDimensions}
                />
            </div>
        </>
    );
}
