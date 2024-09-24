import React from 'react';
import { useCallback, useContext, useEffect, useRef, useState } from 'react';
import Loader from '../components/Loader';
import PageHeader from '../components/PageHeader';
import './css/conceptMap.css';
import jwtDecode from 'jwt-decode';
import { StudentSelectionContext } from "../components/StudentSelectionWrapper";
import apiv2 from "../utils/apiv2";

export default function ConceptMap() {
    const [loading, setLoading] = useState(false);
    const [studentMastery, setStudentMastery] = useState('000000');

    const iframeRef = useRef(null);

    const { selectedStudent } = useContext(StudentSelectionContext);

    const handleLoad = useCallback(() =>{
        if(iframeRef.current) {
            const iframeDocument = iframeRef.current.contentDocument || iframeRef.current.contentWindow.document;
            const height = iframeDocument.body.scrollHeight;
            iframeRef.current.style.height = `${height}px`;
        }
    }, []);

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
                setStudentMastery(res.data);
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
                    ref={iframeRef}
                    className="concept_map_iframe"
                    id="ConceptMap"
                    title="Concept Map"
                    src={`${window.location.origin}/progress?show_legend=false&student_mastery=${studentMastery}`}
                    onLoad={handleLoad}
                    scrolling='no'
                    allowFullScreen
                />
            </div>
        </>
    );
}
