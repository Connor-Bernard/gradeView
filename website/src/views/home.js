import React, { useMemo, useContext, useEffect, useState } from 'react';
import { Box, Typography, useMediaQuery } from '@mui/material';
import useFetch from '../utils/useFetch';
import Loader from '../components/Loader';
import GradeAccordion from '../components/GradeAccordion';
import GradeGrid from '../components/GradeGrid';
import Grid from '@mui/material/Unstable_Grid2';
import ProjectionTable from '../components/ProjectionTable';
import { StudentSelectionContext } from "../components/StudentSelectionWrapper";

function Home() {

    const [binsData, setBinsData] = useState([]);

    const mobileView = useMediaQuery('(max-width:600px)');

    const { selectedStudent } = useContext(StudentSelectionContext);

    const fetchEmail = useMemo(() => {
        return selectedStudent || localStorage.getItem('email');
    }, [selectedStudent]);

    const binsInfo = useFetch('/bins');
    const gradeInfo = useFetch(`students/${fetchEmail}/grades`);
    const projectionsInfo = useFetch(`/students/${fetchEmail}/projections`);

    useEffect(() => {
        if (binsInfo.data && localStorage.getItem('token')) {
            setBinsData(binsInfo.data.map(({ letter, points }) => [points, letter]));
        }
    }, [binsInfo.data]);

    if (gradeInfo.loading || binsInfo.loading || projectionsInfo.loading) {
        return (<Loader />);
    }

    return (
        <Box sx={{ display: 'flex', flexFlow: 'column', height: '100%' }}>
            {mobileView ?
                <>
                    {Object.entries(gradeInfo.data).map(([assignmentName, breakdown]) => (
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
                        {Object.entries(gradeInfo.data).map(([assignmentName, breakdown]) => (
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
                        <ProjectionTable projections={projectionsInfo.data} gradeData={binsData} />
                    </Box>
                </Box>
            }
        </Box>
    );
}

export default Home;
