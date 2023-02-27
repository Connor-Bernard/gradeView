import React from 'react';
import { useState, useEffect } from 'react';
import { Box, FormControl, InputLabel, MenuItem, Select } from '@mui/material';
import api from '../utils/api';
import Loader from '../components/Loader';
import GradeAccordion from '../components/GradeAccordion';

function Home() {

    const accordionMeta = [
        {tab: 'Homework', filter: 'Homework'},
        {tab: 'Projects', filter: 'Project'},
        {tab: 'Exams', filter: 'i'},
        {tab: 'Extra Credit', filter: 'EC:'}
    ];

    const [isLoading, setLoading] = useState(true);

    // Hook for updating grades, calling updateGradeData(var) will make gradeDate = var
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

    /**
     * Filters the input grade data by the filter string.
     * @param {String} filter 
     * @returns {Array} filtered gradeData
     */
    function filterData(filter){
        return gradeData.filter((row) => row.assignment.includes(filter));
    }

    return (
        <>
            { isLoading ? ( <Loader /> ) : (
                    <Box sx={{ display: 'flex', flexFlow: 'column', height: '100%' }}>
                    {isAdmin &&
                        // student drop-down selection
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
                    {
                        accordionMeta.map((item) => (
                            <GradeAccordion
                                key={item.tab}
                                category={item.tab}
                                assignments={filterData(item.filter)}
                            />
                        ))
                    }
                    </Box>
                )   
            }
        </>
    );
}

export default Home;