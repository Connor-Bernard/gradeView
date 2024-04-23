import React, { useContext, useEffect, useState } from 'react';
import { Box, Typography, useMediaQuery } from '@mui/material';
import api from '../utils/api';
import apiv2 from '../utils/apiv2';
import Loader from '../components/Loader';
import GradeAccordion from '../components/GradeAccordion';
import GradeGrid from '../components/GradeGrid';
import Grid from '@mui/material/Unstable_Grid2';
import ProjectionTable from '../components/ProjectionTable';
import { StudentSelectionContext } from "../components/StudentSelectionWrapper";

function Home() {

    const [isLoading, setLoading] = useState(true);

    const [projections, setProjections] = useState({ zeros: 0, pace: 0, perfect: 0 });

    // Hook for updating grades, calling updateGradeData(var) will make gradeDate = var
    const [gradeData, updateGradeData] = useState([]);

    const [scoreToLetterGrade, setScoreToLetterGrade] = useState([]);

    const mobileView = useMediaQuery('(max-width:600px)');

    const { selectedStudent } = useContext(StudentSelectionContext);

    useEffect(() => {
        let mounted = true;
        // Initialize grade data
        const fetchEmail = selectedStudent || localStorage.getItem('email');
        apiv2.get(`students/${fetchEmail}/grades`).then((res) => {
            if (mounted) {
                updateGradeData(res.data);
                let assignmentCategories = [];
                for (let assignment in res.data) {
                    if (!assignmentCategories.includes(res.data[assignment].type)) {
                        assignmentCategories.push(res.data[assignment].type);
                    }
                }
                setLoading(false);
            }
            return () => mounted = false;
        });
    }, [selectedStudent]);

    useEffect(() => {
        let mounted = true;

        api.get('/projections').then((res) => {
            if (mounted && localStorage.getItem('token')) {
                setProjections(res.data);
            }
            return () => mounted = false;
        });

    }, [])

    useEffect(() => {
        let mounted = true;

        api.get('/bins').then((res) => {
            if (mounted && localStorage.getItem('token')) {
                setScoreToLetterGrade(res.data);
            }
            return () => mounted = false;
        });
    }, [])

    return (
        <>
            {isLoading ? (<Loader />) : (
                <Box sx={{ display: 'flex', flexFlow: 'column', height: '100%' }}>
                    {mobileView ?
                        <>
                            {Object.entries(gradeData).map(([assignmentName, breakdown]) => (
                                <GradeAccordion
                                    key={assignmentName}
                                    category={assignmentName}
                                    assignments={breakdown}
                                />
                            ))}
                        </>
                        :
                        <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', marginTop: 4, width: '100%' }}>
                            <Grid container sx={{ width: '100%' }} spacing={{ xs: 3, md: 5 }} columns={{ xs: 4, sm: 8, md: 12 }}>
                                {Object.entries(gradeData).map(([assignmentName, breakdown]) => (
                                    <GradeGrid
                                        key={assignmentName}
                                        category={assignmentName}
                                        assignments={breakdown}
                                    />
                                ))}
                            </Grid>
                        </Box>
                    }
                    {localStorage.getItem('token') &&
                        <Box>
                            <Typography variant='h5' component='div' sx={{ mt: 6, mb: 2, fontWeight: 500, textAlign: 'center' }}>Grade Projections</Typography>
                            <Box sx={{ mb: 4, display: 'flex', flexBasis: 'min-content', justifyContent: 'center' }}>
                                <ProjectionTable projections={projections} gradeData={scoreToLetterGrade} />
                            </Box>
                        </Box>
                    }
                </Box>
            )
            }
        </>
    );
}

export default Home;
