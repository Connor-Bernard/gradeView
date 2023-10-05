import { Box, TableContainer, Paper, Table, TableHead, TableCell, TableBody, TableRow } from '@mui/material';

export default function ProjectionTable({ projections: { zeros, pace, perfect }, gradeData }){
    function getLetterGrade(points){
        for(let i = 0; i < gradeData.length; i++){
            if(points <= +gradeData[i][0]){
                return gradeData[i][1];
            }
        }
        return 'A+';
    }
    return(
        <>
        <Box sx={{width:500, maxWidth:'90%'}}>
            <TableContainer component={Paper} sx={{height:'fit-content'}}>
                <Table>
                    <TableHead>
                        <TableRow>
                            <TableCell align='center'>No further work</TableCell>
                            <TableCell align='center'>Current pace</TableCell>
                            <TableCell align='center'>Maximum possible</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        <TableRow>
                            <TableCell align='center'>{zeros} ({getLetterGrade(zeros)})</TableCell>
                            <TableCell align='center'>{pace} ({getLetterGrade(pace)})</TableCell>
                            <TableCell align='center'>{perfect} ({getLetterGrade(perfect)})</TableCell>
                        </TableRow>
                    </TableBody>
                </Table>
            </TableContainer>
        </Box>
        </>
    )
}