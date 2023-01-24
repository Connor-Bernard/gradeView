import React from 'react'
import { Box, Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Typography } from '@mui/material';

export default function Buckets(){

    function createGradingRow(assignment, points){
        return { assignment, points };
    }

    function createBucketRow(grade, range){
        return { grade, range };
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

    const bucketRows = [
        createBucketRow('A+', '485-500'),
        createBucketRow('A', '460-484'),
        createBucketRow('A-', '450-459'),
        createBucketRow('B+', '440-449'),
        createBucketRow('B', '420-439'),
        createBucketRow('B-', '400-419'),
        createBucketRow('C+', '375-399'),
        createBucketRow('C', '360-374'),
        createBucketRow('C-', '350-359'),
        createBucketRow('D', '300-349'),
        createBucketRow('F', '0-299'),
    ]

    return(
        <>
        <Typography variant='h5' component='div' sx={{m:2, fontWeight:500}}>Grading Breakdown</Typography>
        <Box sx={{mt:4, display:'flex', flexBasis:'min-content', justifyContent:'center', gap:'10%'}}>
            <TableContainer component={Paper} sx={{width:500}}>
                <Table>
                    <TableHead>
                        <TableRow>
                            <TableCell>Assignment</TableCell>
                            <TableCell>Points</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {
                            gradingRows.map((row) => (
                                <TableRow key={row.assignment}>
                                    <TableCell>{row.assignment}</TableCell>
                                    <TableCell>{row.points}</TableCell>
                                </TableRow>
                            ))
                        }
                    </TableBody>
                </Table>
            </TableContainer>
            <TableContainer component={Paper} sx={{width:500, height:'fit-content'}}>
                <Table>
                    <TableHead>
                        <TableRow>
                            <TableCell>Letter Grade</TableCell>
                            <TableCell>Range</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {
                            bucketRows.map((row) => (
                                <TableRow key={row.grade}>
                                    <TableCell>{row.grade}</TableCell>
                                    <TableCell>{row.range}</TableCell>
                                </TableRow>
                            ))
                        }
                    </TableBody>
                </Table>
            </TableContainer>
        </Box>
        </>
    );
}