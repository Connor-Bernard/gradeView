import React from 'react';

import Tree from 'react-d3-tree';

import Loader from './Loader';

export default function ConceptMap({ outlineData }) {

    if (!outlineData?.name) {
        return <Loader />;
    }

    return (
        <div style={{ backgroundColor: 'red', width: '100%', height: '100vh' }}>
            <Tree
                data={{
                    name: outlineData.name,
                    children: outlineData.nodes.children,
                }}
            />
        </div>
    );
}