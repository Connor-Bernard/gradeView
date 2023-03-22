import { TableContainer, Table, TableHead, TableRow, TableCell, TableBody, Typography, Paper } from '@mui/material';
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
        <TableContainer sx={{maxWidth: 'md', margin:'auto' }} component={Paper}>
            <Table aria-label='Grade Table'>
                <TableHead>
                    <TableRow>
                        <Toolbar > 
                            <Typography variant="h6" component="div" sx={{ flexGrow: 1  }}>
                                    {headerLeft}
                            </Typography>

                            <Typography variant="h6" component="div"  sx={{ flexGrow: 1  }}>
                                    {headerRight}
                            </Typography>
                        </Toolbar>
                    </TableRow>
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