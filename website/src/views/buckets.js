import React, { useEffect, useState } from 'react'
import { Box, Typography, useMediaQuery } from '@mui/material';
import apiv2 from '../utils/apiv2';
import BinTable from '../components/BinTable';
import Loader from '../components/Loader';

export default function Buckets() {

    const minMedia = useMediaQuery('(min-width:600px)');
    const [binRows, setBins] = useState([]);
    const [loadCount, setLoadCount] = useState(0);

    useEffect(() => {
        let mounted = true;
        setLoadCount(i => i + 1);
        apiv2.get('/bins').then((res) => {
            if (mounted) {
                let tempBins = [];
                for (let i = res.data.length - 1; i >= 0; i--) {
                    const grade = res.data[i]['letter'];
                    const lower = (i !== 0) ? +res.data[i - 1]['points'] + 1 : 0;
                    const range = `${lower}-${res.data[i]['points']}`;
                    tempBins.push({ grade, range });
                }
                setBins(tempBins);
            }
        }).finally(() => {
            setLoadCount(i => i - 1);
        });
        return () => mounted = false;
    }, []);

    function createGradingRow(assignment, points) {
        return { assignment, points };
    }

    const gradingRows = [
        createGradingRow('Quest', 25),
        createGradingRow('Midterm', 80),
        createGradingRow('Postterm', 100),
        createGradingRow('Project 1: Wordle™-lite', 10),
        createGradingRow('Project 2: Spelling-Bee', 25),
        createGradingRow('Project 3: 2048', 35),
        createGradingRow('Project 4: Explore', 15),
        createGradingRow('Project 5: Pyturis', 45),
        createGradingRow('Final Project', 60),
        createGradingRow('Labs', 80),
        createGradingRow('Attendance / Participation', 25)
    ];

    return (
        <>
            {loadCount > 0 ? (<Loader />) : (
                <>
                    <Typography variant='h5' component='div' sx={{ m: 2, fontWeight: 500 }}>Buckets</Typography>
                    <Box sx={minMedia ?
                        { mt: 4, display: 'flex', flexBasis: 'min-content', justifyContent: 'center', gap: '10%' } :
                        { display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 4 }
                    }
                    >
                        <BinTable title='Grading Breakdown' col1='Assignment' col2='Points' rows={gradingRows} keys={['assignment', 'points']} />
                        <BinTable title='Buckets' col1='Letter Grade' col2='Range' rows={binRows} keys={['grade', 'range']} />
                    </Box>
                </>
            )
            }
        </>
    );
}
