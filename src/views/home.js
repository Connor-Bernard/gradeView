import React from 'react';
import { useState, useEffect } from 'react';
import { Box } from '@mui/material';
import { DataGrid } from '@mui/x-data-grid';
import api from '../utils/api';

function Home() {

    const columns = [
        { field: 'assignment', headerName: 'Assignment', width: 400 },
        { field: 'grade', headerName: 'Grade', width: 100 }
    ];

    // Hook for updating grades
    const [gradeData, updateGradeData] = useState([]);

    // Initialize grade data
    useEffect(() => {
        let mounted = true;
        api.get('/grades').then((res) => {
            if(mounted){
                updateGradeData(res.data);
            }
        })
        return () => mounted = false;
    }, []);

    return (
        <>
        <Box height='100%'>
            <DataGrid
                columns={columns}
                rows={gradeData}
                pageSize={100}
                disableSelectionOnClick
            />
        </Box>
        </>
    );
}

export default Home;