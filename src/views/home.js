import React from 'react';
import { useState, useEffect } from 'react';
import { Box, CircularProgress } from '@mui/material';
import { DataGrid } from '@mui/x-data-grid';
import api from '../utils/api';

function Home() {

    const [isLoading, setLoading] = useState(true);

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
                setLoading(false);
            }
        })
        return () => mounted = false;
    }, []);

    return (
        <>
        <Box height='100%'>
            { isLoading ? 
                (
                    <CircularProgress sx={{position:'absolute',top:'50%', left:'50%', transform:'translate(-50%, -50%)'}} />
                ) : (
                    <DataGrid
                    columns={columns}
                    rows={gradeData}
                    pageSize={100}
                    disableSelectionOnClick
                    />
                )
            }
        </Box>
        </>
    );
}

export default Home;