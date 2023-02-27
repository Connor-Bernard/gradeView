import React from 'react';
import { useState, useEffect } from 'react';
import { Box, FormControl, InputLabel, MenuItem, Select } from '@mui/material';
import { DataGrid } from '@mui/x-data-grid';
import api from '../utils/api';
import Loader from '../components/Loader';


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

    const [isLoading, setLoading] = useState(true);

    // Hook for updating grades
    // gradeData = state variable
    // updateGradeData = function that updates gradeData
    // calling updateGradeData(var) will make gradeDate = var
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

    function SimpleAccordion(props) {
        const filter = props.filter;
        const category = props.category;
        
        return (
          // all enclosed in a single div
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
               
                {/* TODO: only works when do this */}
                    {/* height={800} */}
                    <Box height={800}>
                        <DataGrid
                            columns={columns}
                            rows={gradeData}
                            pageSize={100}
                            disableSelectionOnClick
                            filterModel={{
                                items: [
                                { columnField: 'assignment', operatorValue: 'contains', value: filter },
                                ],
                            }}         
                        />
                     </Box>
              
                
              </AccordionDetails>
            </Accordion>
          </div>
        );
      }

      function BasicTable(props) {
        // this had to be declared before the return statement
        const rows = gradeData;
        const filter = props.filter;
        const newRows = rows.filter(item=>item.assignment.includes(filter));
        return (
          <TableContainer component={Paper}>
            <Table sx={{ minWidth: 650 }} aria-label="simple table">
              <TableHead>
                <TableRow>
                  <TableCell>Assignment</TableCell>
                  {/* TODO: fix allignment */}
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
          // all enclosed in a single div
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
                        <SimpleTableAccordion category="Homework" filter="Homework" />
                        <SimpleTableAccordion category="Projects" filter="Project" />
                        <SimpleTableAccordion category="Exams" filter="i" />
                        <SimpleTableAccordion category="Extra Credit" filter="EC:" />
                    </Box>
                )   
            }
        </>
    );
}


export default Home;