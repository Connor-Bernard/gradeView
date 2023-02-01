import React, { useEffect, useState } from 'react'
import { Box, Typography } from '@mui/material';
import api from '../utils/api';
import BinTable from '../components/BinTable';

export default function Buckets(){

    const [binRows, setBins] = useState([]);

    useEffect(() => {
        let mounted = true;
        api.get('/bins').then((res) => {
            if(mounted){
                let tempBins = [{ grade: res.data[0][1], range: `0-${res.data[0][0]}`}];
                for(let i = 1; i < res.data.length; i++){
                    const grade = res.data[i][1];
                    const range = `${+res.data[i - 1][0] + 1}-${res.data[i][0]}`;
                    tempBins = [...tempBins, { grade, range }];
                }
                setBins(tempBins);
            }
        }).catch((err) => {
            console.log(err);
        })
        return () => mounted = false;
    }, []);

    function createGradingRow(assignment, points) {
        return { assignment, points };
    }

    const gradingRows = [
        createGradingRow('Quest', 40),
        createGradingRow('Midterm (With Snap!)', 15),
        createGradingRow('Midterm (Without Snap!)', 65),
        createGradingRow('Postterm', 100),
        createGradingRow('Project 1: Wordle™-lite', 10),
        createGradingRow('Project 2: Wordle™', 20),
        createGradingRow('Project 3: 2048', 30),
        createGradingRow('Project 4: Explore', 40),
        createGradingRow('Project 5: Python', 50),
        createGradingRow('Final Project', 80),
        createGradingRow('Labs', 30),
        createGradingRow('Reading Quizzes', 20)
    ]

    return(
        <>
        <Typography variant='h5' component='div' sx={{m:2, fontWeight:500}}>Grading Breakdown</Typography>
        <Box sx={{mt:4, display:'flex', flexBasis:'min-content', justifyContent:'center', gap:'10%'}}>
            <BinTable col1='Asignment' col2='Points' rows={gradingRows} keys={['assignment', 'points']} />
            <BinTable col1='Letter Grade' col2='Range' rows={binRows} keys={['grade', 'range']} />
        </Box>
        </>
    );
}