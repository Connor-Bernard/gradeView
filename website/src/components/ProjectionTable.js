import { Box, TableContainer, Paper, Table, TableHead, TableCell, TableBody, TableRow } from '@mui/material';

export default function ProjectionTable({ projections: { zeros, pace, perfect } }){
    return(
        <>
        <Box>
            <TableContainer component={Paper} sx={{width:500, height:'fit-content'}}>
                <Table>
                    <TableHead>
                        <TableRow>
                            <TableCell>Current</TableCell>
                            <TableCell>Maintain Pace</TableCell>
                            <TableCell>Perfect</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        <TableRow>
                            <TableCell>{zeros}</TableCell>
                            <TableCell>{pace}</TableCell>
                            <TableCell>{perfect}</TableCell>
                        </TableRow>
                    </TableBody>
                </Table>
            </TableContainer>
        </Box>
        </>
    )
}