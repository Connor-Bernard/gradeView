import { TableContainer, Paper, Table, TableHead, TableRow, TableCell, TableBody, Typography, Box } from '@mui/material';

export default function BinTable({ title, col1, col2, rows, keys }){
    return(
        <>
<<<<<<< HEAD
            <Box sx={{width:500,maxWidth:'100%'}}>
=======
            <Box sx={{width:500, maxWidth:'100%'}}>
>>>>>>> db7c9636c1fcf39bb584decb00d335503559f756
                <Typography variant='h6' component='div' sx={{ m: 2, fontWeight: 500 }}>{title}</Typography>
                <TableContainer component={Paper} sx={{ maxWidth: 500, height: 'fit-content' }}>
                    <Table>
                        <TableHead>
                            <TableRow>
                                <TableCell>{col1}</TableCell>
                                <TableCell>{col2}</TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {
                                rows.map((row) => (
                                    <TableRow key={row[keys[0]]}>
                                        <TableCell>{row[keys[0]]}</TableCell>
                                        <TableCell>{row[keys[1]]}</TableCell>
                                    </TableRow>
                                ))
                            }
                        </TableBody>
                    </Table>
                </TableContainer>
            </Box>
        </>
    )
}
