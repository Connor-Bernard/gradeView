import React, { useState } from 'react';

import Tree from 'react-d3-tree';

import Loader from './Loader';

import './css/ConceptMapTree.css';

export default function ConceptMapTree({ outlineData, dimensions, currWeek }) {

    function getPathClass({ _, target }) {
        const classNames = ['path'];
        if (target?.data?.data?.week < currWeek) {
            classNames.push('taught');
        }; 
        return classNames.join(' ');
    }

    if (!outlineData?.name) {
        return <Loader />;
    }

    return (
        <Tree
            data={{
                name: outlineData.name,
                children: outlineData?.nodes?.children ?? [],
            }}
            translate={{
                x: 20,
                y: dimensions.height / 2,
            }}
            renderCustomNodeElement={(props) => <ConceptMapNode {...props} />}
            pathClassFunc={getPathClass}
            enableLegacyTransitions
            draggable={false}
            zoomable={false}
        />
    );
}

function ConceptMapNode({ hierarchyPointNode, nodeDatum, toggleNode }) {
    const numTotalChildren = hierarchyPointNode?.data?.children?.length;
    const [isCollapsed, setIsCollapsed] = useState(
        numTotalChildren && (numTotalChildren !== hierarchyPointNode?.children?.length)
    );

    function handleToggleNode() {
        if (hierarchyPointNode?.data?.children.length) {
            toggleNode();
            setIsCollapsed(prev => !prev);
        }
    }

    return (
        <g className={`node ${isCollapsed ? 'collapsed' : ''}`}>
            <circle r="10" onClick={handleToggleNode} />
            <text onClick={handleToggleNode} strokeWidth="0" x="20" y="-10">
                {nodeDatum.name}
            </text>
        </g>
    );
}   