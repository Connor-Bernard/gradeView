import {useContext, useEffect, useState} from 'react';

import api from '../utils/api';
import Loader from '../components/Loader';
import PageHeader from '../components/PageHeader';
import './css/conceptMap.css';
import jwtDecode from "jwt-decode";
import apiv2 from "../utils/apiv2";
import {StudentSelectionContext} from "../components/StudentSelectionWrapper";

export default function ConceptMap() {
    const [loading, setLoading] = useState(false);
    const [studentMastery, setStudentMastery] = useState('000000');

    const {selectedStudent, setSelectedStudent} = useContext(StudentSelectionContext);

    useEffect(() => {
        let mounted = true;
        setLoading(true);
        if (mounted && localStorage.getItem('token')) {
            let email = jwtDecode(localStorage.getItem('token')).email;
            api.get('v2/students/' + email + '/progressquerystring').then((res) => {
                setStudentMastery(res.data)
                setLoading(false);
            });
        } else {
            setLoading(false);
        }
        return () => mounted = false;
    }, []);

    useEffect(() => {
        let mounted = true;
        if (mounted) {
            setLoading(true);
            api.get('v2/students/' + selectedStudent + '/progressquerystring').then((res) => {
                setStudentMastery(res.data)
                setLoading(false);
            });
        }
        return () => mounted = false;
    }, [selectedStudent])

    if (loading) {
        return <Loader />;
    }

    return (
        <>
            <PageHeader>Concept Map</PageHeader>
            <div style={{ textAlign: 'center', height:"100%" }} overflow="hidden">
                <iframe
                    className="concept_map_iframe"
                    id="ConceptMap"
                    title="Concept Map"
                    scrolling="no"
                    src={`${window.location.origin}/progress?show_legend=false&student_mastery=${studentMastery}`}
                    allowFullScreen
                />
            </div>
        </>
    );
}
