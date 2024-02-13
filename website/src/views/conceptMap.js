import React from 'react';
import './css/conceptMap.css';

export default function ConceptMap() {

    return (
        <div style={{ textAlign: 'center' }}>
            <h1>Concept Map</h1>
            <iframe className="concept_map_iframe" id="ConceptMap" title="Concept Map"
                src={`${window.location.origin}/progress?show_legend=false`}
                allowFullScreen>
            </iframe>
        </div>
    );
}

