import React from 'react';
import { Box } from '@mui/material';
import { DataGrid } from '@mui/x-data-grid';

function Home() {

    let columns = [
        {field: 'assignment', headerName: 'Assignment', width:400},
        {field: 'grade', headerName: 'Grade', width:100}
    ];
    let rows = [
        { id: 1, assignment: 'Homework 0', grade: Math.round(80 + Math.random() * 20) },
        { id: 2, assignment: 'Homework 1', grade: Math.round(80 + Math.random() * 20) },
        { id: 3, assignment: 'Homework 2', grade: Math.round(80 + Math.random() * 20) },
        { id: 4, assignment: 'Homework 3', grade: Math.round(80 + Math.random() * 20) },
        { id: 5, assignment: 'Homework 4', grade: Math.round(80 + Math.random() * 20) },
        { id: 6, assignment: 'Homework 5', grade: Math.round(80 + Math.random() * 20) },
        { id: 7, assignment: 'Homework 6', grade: Math.round(80 + Math.random() * 20) },
        { id: 8, assignment: 'Homework 7', grade: Math.round(80 + Math.random() * 20) },
        { id: 9, assignment: 'Homework 8', grade: Math.round(80 + Math.random() * 20) },
        { id: 10, assignment: 'Homework 9', grade: Math.round(80 + Math.random() * 20) },
        { id: 11, assignment: 'Homework 10', grade: Math.round(80 + Math.random() * 20) },
        { id: 12, assignment: 'Homework 11', grade: Math.round(80 + Math.random() * 20) },
        { id: 13, assignment: 'Lab 0', grade: Math.round(80 + Math.random() * 20) },
        { id: 14, assignment: 'Lab 1', grade: Math.round(80 + Math.random() * 20) },
        { id: 15, assignment: 'Lab 2', grade: Math.round(80 + Math.random() * 20) },
        { id: 16, assignment: 'Lab 3', grade: Math.round(80 + Math.random() * 20) },
        { id: 17, assignment: 'Lab 4', grade: Math.round(80 + Math.random() * 20) },
        { id: 18, assignment: 'Lab 5', grade: Math.round(80 + Math.random() * 20) },
        { id: 19, assignment: 'Lab 6', grade: Math.round(80 + Math.random() * 20) },
        { id: 20, assignment: 'Lab 7', grade: Math.round(80 + Math.random() * 20) },
        { id: 21, assignment: 'Lab 8', grade: Math.round(80 + Math.random() * 20) },
        { id: 22, assignment: 'Lab 9', grade: Math.round(80 + Math.random() * 20) },
        { id: 23, assignment: 'Project 1', grade: Math.round(80 + Math.random() * 20) },
        { id: 24, assignment: 'Project 2A', grade: Math.round(80 + Math.random() * 20) },
        { id: 25, assignment: 'Project 2B', grade: Math.round(80 + Math.random() * 20) },
        { id: 26, assignment: 'Project 3A', grade: Math.round(80 + Math.random() * 20) },
        { id: 27, assignment: 'Project 3B', grade: Math.round(80 + Math.random() * 20) },
        { id: 28, assignment: 'Project 4', grade: Math.round(80 + Math.random() * 20) },
        { id: 29, assignment: 'Midterm', grade: Math.round(80 + Math.random() * 20) },
        { id: 30, assignment: 'Final', grade: Math.round(80 + Math.random() * 20) },
        { id: 31, assignment: 'EC: Course Evaluation', grade: '1' },
        { id: 32, assignment: 'EC: Lab Survey', grade: '1' }

    ];
    return (
        <>
        <Box height='100%'>
            <DataGrid
                rows={rows}
                columns={columns}
                pageSize={100}
                disableSelectionOnClick
            />
        </Box>
        </>
    );
}

export default Home;