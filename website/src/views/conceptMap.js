export default function ConceptMap() {
    const styleFrame = {
        width: '100%',
        border: 'none', 
        display: 'block', 
        marginLeft: 'auto', 
        marginRight: 'auto'
    };

    return (
        <div style={{ textAlign: 'center' }}>
            <h1>Concept Map</h1>
            <iframe className="concept_map_iframe" id="ConceptMap" title="Concept Map"
                src="http://localhost:8080?show_legend=false" 
                allowFullScreen>
            </iframe>
        </div>
    );
}