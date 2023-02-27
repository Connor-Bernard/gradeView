import React from 'react';
import { useState, useEffect } from 'react';
import { Box, FormControl, InputLabel, MenuItem, Select } from '@mui/material';
import api from '../utils/api';
import Loader from '../components/Loader';
import GradeAccordion from '../components/GradeAccordion';


import Accordion from '@mui/material/Accordion';
import AccordionSummary from '@mui/material/AccordionSummary';
import AccordionDetails from '@mui/material/AccordionDetails';
import Typography from '@mui/material/Typography';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';


function Home() {

    const accordionMeta = [
        {tab: 'Homework', filter: 'Homework'},
        {tab: 'Projects', filter: 'Project'},
        {tab: 'Exams', filter: 'i'}
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

      function BasicTable(props) {
        const rows = gradeData;
        const filter = props.filter;
        // filter student grades based off assignment type
        const newRows = rows.filter(item=>item.assignment.includes(filter));
        return (
          <TableContainer component={Paper}>
            <Table sx={{ minWidth: 650 }} aria-label="simple table">
              <TableHead>
                <TableRow>
                  <TableCell>Assignment</TableCell>
                  <TableCell align="right">Grade</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {newRows.map((row) => (
                    <TableRow
                    key={row}
                    sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
                  >
                    <TableCell component="th" scope="row">
                      {row.assignment}
                    </TableCell>
                    <TableCell align="right">{row.grade}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        );
      }

      function SimpleTableAccordion(props) {
        const category = props.category;
        const filter = props.filter;
        return (
          <div>
            <Accordion>
              <AccordionSummary
                expandIcon={<ExpandMoreIcon />}
                aria-controls="panel1a-content"
                id="panel1a-header"
              >
                <Typography>{category}</Typography>
              </AccordionSummary>
              <AccordionDetails>
                <BasicTable filter={filter}/>
              </AccordionDetails>
            </Accordion>
      
          </div>
        );
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