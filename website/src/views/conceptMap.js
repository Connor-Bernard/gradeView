import {useContext, useEffect, useState} from 'react';

import api from '../utils/api';
import Loader from '../components/Loader';
import PageHeader from '../components/PageHeader';
import './css/conceptMap.css';
import { StudentSelectionContext } from "../components/StudentSelectionWrapper";

export default function ConceptMap() {
    const [loading, setLoading] = useState(false);
    const [studentMastery, setStudentMastery] = useState('000000');
    const { selectedStudent, getSelectedStudent } = useContext(StudentSelectionContext);

    useEffect(() => {
        let mounted = true;
        setLoading(true);
        if (mounted && localStorage.getItem('token')) {
            if (selectedStudent === "") {
                api.get('/progressquerystring').then((res) => {
                    setStudentMastery(res.data)
                    setLoading(false);
                });
            } else {
                api.get('/admin/studentProgressReport?email=' + selectedStudent).then((res) => {
                    setStudentMastery(res.data);
                    setLoading(false);
                })
            }
        } else {
            setLoading(false);
        }
        return () => mounted = false;
    }, [selectedStudent]);

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
