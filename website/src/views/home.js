import React from 'react';
import { useState, useEffect } from 'react';
import { Box, FormControl, InputLabel, MenuItem, Select } from '@mui/material';
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

    // Hook for updating grades, calling updateGradeData(var) will make gradeDate = var
    const [gradeData, updateGradeData] = useState([]);

    // User admin status
    const [isAdmin, setAdminStatus] = useState(false);

    useEffect(() => {
        let mounted = true;
        // Initialize grade data
        api.get('/grades').then((res) => {
            if(mounted){
                updateGradeData(res.data);
                setLoading(false);
            }
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