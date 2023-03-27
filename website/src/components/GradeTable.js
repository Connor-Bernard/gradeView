import { Box, TableContainer, Table, TableHead, TableRow, TableCell, TableBody, Typography, Paper, AppBar  } from '@mui/material';
import Toolbar from '@mui/material/Toolbar';


export default function GradeTable({ assignments, headerLeft, headerRight}) {

    /**
     * Gets the formatting for the font-weight.
     * @param {Float} student 
     * @param {Float} max 
     * @returns {String} 'bold' or 'normal'
     */
    function isBold(student, max){
        if(student === max){
            return 'bold';
        }
        return 'normal';
    }

    return (
        <TableContainer sx={{  backgroundColor: '#c2b9a7'}} component={Paper}>
            {/* not prob with table */}
            <Table aria-label='Grade Table'>
            
                {/* tbale head is what isnot taking full width  */}
                <TableHead >
                        {/* //! this is as wide as I can get it to be */}
                        <Toolbar sx={{postion:'absolute', display:'flex', flexDirection:'row', justifyContent:'space-between', width: '100%', flex:'1 1 0'}}>
                            <Typography variant="h6">{headerLeft}</Typography>
                            <Typography variant="h6">{headerRight}</Typography>
                        </Toolbar>
                </TableHead>        

                <TableBody>
                    {
                        assignments.map((assignment) => (
                            <TableRow
                                key={assignment.id + assignment.assignment}
                                sx={{ '&:last-child td, &:last-child th': { border: 0 } }}>
                                <TableCell component='th' scope='assignment'>{assignment.assignment}</TableCell>
                                <TableCell align='right' sx={{fontWeight: isBold(assignment.grade?.studentGrade, assignment.grade?.maxGrade)}}>
                                    {`${assignment.grade?.studentGrade || 'N/A'} / ${assignment.grade?.maxGrade || 'N/A'}`}
                                </TableCell>
                            </TableRow>
                        ))
                    }
                </TableBody>
            </Table>
        </TableContainer>
    );
}