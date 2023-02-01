import { CircularProgress } from "@mui/material"
export default function Loader(){
    return(
        <>
            <CircularProgress sx={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)' }} />
        </>
    )
}