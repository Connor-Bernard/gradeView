import React from 'react';
import { useContext, useEffect, useState } from 'react';
import Loader from '../components/Loader';
import PageHeader from '../components/PageHeader';
import './css/conceptMap.css';
import jwtDecode from 'jwt-decode';
import { StudentSelectionContext } from "../components/StudentSelectionWrapper";
import apiv2 from "../utils/apiv2";

export default function ConceptMap() {
    const [loading, setLoading] = useState(false);
    const [studentMastery, setStudentMastery] = useState('000000');

    const { selectedStudent, setSelectedStudent } = useContext(StudentSelectionContext);

    useEffect(() => {
        let mounted = true;
        setLoading(true);
        if (mounted && localStorage.getItem('token')) {
            let email = jwtDecode(localStorage.getItem('token')).email;
            apiv2.get(`/students/${email}/progressquerystring`).then((res) => {
                setStudentMastery(res.data);
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
            apiv2.get(`/students/${selectedStudent}/progressquerystring`).then((res) => {
                //.substring(0, 6) for quest data only
                setStudentMastery(res.data); //remove substring when we are ready for midterm and postterm
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
