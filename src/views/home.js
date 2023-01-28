import React from 'react';
import { useState, useEffect } from 'react';
import { Box, CircularProgress, FormControl, InputLabel, MenuItem, Select } from '@mui/material';
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

    // Check if the user is an admin
    const [isAdmin, setAdminStatus] = useState(false);
    useEffect(() => {
        let mounted = true;
        api.get('/isadmin').then((res) => {
            if(mounted){
                setAdminStatus(res.data);
            }
        });
        return () => mounted = false;
    }, []);

    // Initalize list of students for admin viewership
    const [students, setStudents] = useState([]);
    useEffect(() => {
        let mounted = true;
        if(isAdmin){
            api.get('/admin/students').then((res) => {
                if(mounted){
                    setStudents(res.data);
                }
            });
        }
        return () => mounted = false;
    }, [isAdmin]);

    /**
     * Updates the grades shown to that of the selected student.
     * @param {Event} e 
     */
    function loadStudentData(e){
        api.post('/admin/getStudent', {
            email: e.target.value
        }).then((res) => {
            updateGradeData(res.data);
        });
    }

    return (
        <>
            { isLoading ? 
                (
                    <CircularProgress sx={{position:'absolute',top:'50%', left:'50%', transform:'translate(-50%, -50%)'}} />
                ) : (
                    <Box sx={{ display: 'flex', flexFlow: 'column', height: '100%' }}>
                    {isAdmin &&
                        <Box>
                            <FormControl size='small' sx={{m: 1, minWidth:100}}>
                                <InputLabel id='student-dropdown-label'>Student</InputLabel>
                                <Select
                                    labelId='student-dropdown-label'
                                    id='student-dropdown'
                                    label='student'
                                    onChange={loadStudentData}
                                    defaultValue=''
                                    >
                                        {
                                            students.map((student) => (
                                                <MenuItem key={student[1]} value={student[1]}>{student[0]}</MenuItem>
                                            ))
                                        }
                                    </Select>
                            </FormControl>
                        </Box>
                    }
                    <Box height='100%'>
                        <DataGrid
                        columns={columns}
                        rows={gradeData}
                        pageSize={100}
                        disableSelectionOnClick
                        />
                    </Box>
                    </Box>
                )
            }
        </>
    );
}

export default Home;