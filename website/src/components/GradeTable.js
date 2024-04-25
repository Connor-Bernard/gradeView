import React from 'react';
import { TableContainer, Table, TableHead, TableRow, TableCell, TableBody, Paper } from '@mui/material';

export default function GradeTable({ assignments, headerLeft, headerRight }) {

    /**
     * Gets the formatting for the font-weight.
     * @param {Float} student 
     * @param {Float} max 
     * @returns {String} 'bold' or 'normal'
     */
    function isBold(student, max) {
        if (student === max) {
            return 'bold';
        }
        return 'normal';
    }

    return (
        <TableContainer component={Paper}>
            <Table aria-label='Grade Table'>
                <TableHead >
                    <TableRow>
                        <TableCell align='left' sx={{ fontSize: 20, padding: 3, borderBottom: 'none' }}>{headerLeft}</TableCell>
                        <TableCell align='right' sx={{ fontSize: 20, padding: 3, borderBottom: 'none' }}>{headerRight}</TableCell>
                    </TableRow>
                </TableHead>

                <TableBody>
                    {
                        Object.entries(assignments).map(([concept, points]) => (
                            <TableRow
                                key={concept}
                                sx={{ '&:last-child td, &:last-child th': { border: 0 } }}>
                                <TableCell component='th' scope='assignment' >{concept}</TableCell>
                                <TableCell align='right' sx={{ fontWeight: isBold(points.student, points.max) }}>
                                    {`${points.student ?? '-'} / ${points.max}`}
                                </TableCell>
                            </TableRow>
                        ))
                    }
                </TableBody>
            </Table>
        </TableContainer>
    );
}
