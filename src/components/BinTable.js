import { TableContainer, Paper, Table, TableHead, TableRow, TableCell, TableBody } from "@mui/material";

export default function BinTable({ col1, col2, rows, keys }){
    return(
        <>
            <TableContainer component={Paper} sx={{width: 500, height:'fit-content'}}>
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
        </>
    )
}