import React from 'react';

import Tree from 'react-d3-tree';

import Loader from './Loader';

import './css/ConceptMapTree.css';

export default function ConceptMapTree({ outlineData, dimensions }) {

    if (!outlineData?.name) {
        return <Loader />;
    }

    return (
        <Tree
            data={{
                name: outlineData.name,
                children: outlineData?.nodes?.children ?? [],
            }}
            dimensions={dimensions}
            translate={{
                x: 20,
                y: dimensions.height / 2,
            }}
            rootNodeClassName='rootNode node'
            branchNodeClassName='branchNode node'
            leafNodeClassName='leafNode node'
            enableLegacyTransitions
        />
    );
}