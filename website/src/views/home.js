import React from 'react';
import { useState, useEffect } from 'react';
import { Box, FormControl, InputLabel, MenuItem, Select } from '@mui/material';
import { DataGrid } from '@mui/x-data-grid';
import api from '../utils/api';
import Loader from '../components/Loader';

function Home() {

    const [isLoading, setLoading] = useState(true);

    // Hook for updating grades
    const [gradeData, updateGradeData] = useState([]);

    // User admin status
    const [isAdmin, setAdminStatus] = useState(false);

    useEffect(() => {
        let mounted = true;
        // Initialize grade data
        api.get('/grades').then((res) => {
            if(mounted){
                res.data.map((assignment) => {
                    if(!assignment.grade?.studentGrade){
                        return assignment.grade = 'N/A'
                    }
                    return assignment.grade = `${assignment.grade.studentGrade} / ${assignment.grade.maxGrade}`;
                });
                updateGradeData(res.data);
                setLoading(false);
            }
            return () => mounted = false;
        });

        // Update user admin status
        api.get('/isadmin').then((res) => {
            if (mounted) {
                setAdminStatus(res.data);
            }
        });
        return () => mounted = false;
    }, []);

    // Initalize list of students for admin viewership
    const [selectedStudent, setSelectedStudent] = useState('');
    const [students, setStudents] = useState([]);
    useEffect(() => {
        let mounted = true;
        if(isAdmin){
            api.get('/admin/students').then((res) => {
                if(mounted){
                    setStudents(res.data);
                    setSelectedStudent(res.data[0][1]);
                }
            });
        }
        return () => mounted = false;
    }, [isAdmin]);

    const columns = [
        { field: 'assignment', headerName: 'Assignment', width: 400 },
        { field: 'grade', headerName: 'Grade', width: 100 }
    ];

    /**
     * Updates the grades shown to that of the selected student.
     * @param {Event} e 
     */
    function loadStudentData(e){
        setLoading(true);
        api.post('/admin/getStudent', {
            email: e.target.value
        }).then((res) => {
            setSelectedStudent(e.target.value);
            updateGradeData(res.data);
            setLoading(false);
        });
    }

    return (
        <>
            { isLoading ? ( <Loader /> ) : (
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
                                    defaultValue={selectedStudent}
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