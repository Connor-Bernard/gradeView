import { Box, TableContainer, Table, TableHead, TableRow, TableCell, TableBody, Typography, Paper, AppBar  } from '@mui/material';



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
        <TableContainer component={Paper}>
            <Table aria-label='Grade Table'>
                <TableHead >
                            <TableCell align='left' sx={{fontSize:20, padding:3, borderBottom: 'none'}}>{headerLeft}</TableCell>
                            <TableCell align='right'sx={{fontSize:20, padding:3, borderBottom: 'none'}}>{headerRight}</TableCell>
                </TableHead>        

                <TableBody>
                    {
                        assignments.map((assignment) => (
                            <TableRow
                                key={assignment.id + assignment.assignment}
                                sx={{ '&:last-child td, &:last-child th': { border: 0 } }}>
                                <TableCell component='th' scope='assignment' >{assignment.assignment}</TableCell>
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