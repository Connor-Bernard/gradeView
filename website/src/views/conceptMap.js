import { useEffect, useState } from 'react';

import api from '../utils/api';
import Loader from '../components/Loader';
import './css/conceptMap.css';

export default function ConceptMap() {
    const [loading, setLoading] = useState(false);
    const [studentMastery, setStudentMastery] = useState('000000');

    useEffect(() => {
        let mounted = true;
        setLoading(true);
        if (mounted && localStorage.getItem('token')) {
            api.get('/progressquerystring').then((res) => {
                console.debug('debug: hit this point.');
                setStudentMastery(res.data)
                setLoading(false);
            });
        } else {
            setLoading(false);
        }
        return () => mounted = false;
    }, []);

    if (loading) {
        return <Loader />;
    }

    return (
        <div style={{ textAlign: 'center', height:'100%',border: 'none' }} overflow="hidden">
            <h1>Concept Map</h1>
            <iframe id="ConceptMap" title="Concept Map"  
            className='concept_map_iframe'
            src={`${window.location.origin}/progress?show_legend=false&student_mastery=${studentMastery}`} 
            allowfullscreen="" 
            scrolling='no'>
            </iframe>
        </div>
    );
}
