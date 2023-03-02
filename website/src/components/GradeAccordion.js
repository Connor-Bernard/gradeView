import { useState, useEffect } from 'react';
import { Accordion, AccordionSummary, Typography, AccordionDetails } from '@mui/material';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import GradeTable from './GradeTable';

export default function GradeAccordion({ category, assignments }) {

    const [cumGrade, setCumGrade] = useState(0);
    const [cumMaxGrade, setCumMaxGrade] = useState(0);
    const [updatedAssignments, setUpdatedAssignments] = useState([]);

    useEffect(() => {
        let cg = 0;
        let cmg = 0;
        assignments.forEach((assignment) => {
            cg += +(assignment.grade?.studentGrade || 0);
            cmg += +(assignment.grade?.maxGrade || 0);
            assignment.grade = `${assignment.grade?.studentGrade || 'N/A'} / ${assignment.grade?.maxGrade || 'N/A'}`;
        });
        setCumGrade(cg);
        setCumMaxGrade(cmg);
        setUpdatedAssignments(assignments);
    }, [assignments]);

    function isBold(student, max){
        if(student === max){
            return 'bold';
        }
        return 'normal';
    }

    return (
        <>
            <Accordion>
                <AccordionSummary
                    expandIcon={<ExpandMoreIcon />}
                    aria-controls='panel1a-content'
                    id='panel1a-header'>
                    <Typography>{category}</Typography>
                    <Typography sx={{ marginLeft: 'auto', pr: 1, fontWeight: isBold(cumGrade, cumMaxGrade) }}>{cumGrade} / {cumMaxGrade}</Typography>
                </AccordionSummary>
                <AccordionDetails>
                    <GradeTable assignments={updatedAssignments} />
                </AccordionDetails>
            </Accordion>
        </>
    );
}