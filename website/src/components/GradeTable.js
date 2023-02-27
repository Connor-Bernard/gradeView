import { TableContainer, Table, TableHead, TableRow, TableCell, TableBody, Paper } from '@mui/material';

export default function GradeTable({ assignments }) {
    return (
        <TableContainer component={Paper}>
            <Table aria-label='Grade Table'>
                <TableHead>
                    <TableRow>
                        <TableCell>Assignment</TableCell>
                        <TableCell align='right'>Grade</TableCell>
                    </TableRow>
                </TableHead>
                <TableBody>
                    {
                        assignments.map((row) => (
                            <TableRow
                                key={row}
                                sx={{ '&:last-child td, &:last-child th': { border: 0 } }}>
                                <TableCell component='th' scope='row'>{row.assignment}</TableCell>
                                <TableCell align='right'>{row.grade}</TableCell>
                            </TableRow>
                        ))
                    }
                </TableBody>
            </Table>
        </TableContainer>
    );
}