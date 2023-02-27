import { Accordion, AccordionSummary, Typography, AccordionDetails } from '@mui/material';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import GradeTable from './GradeTable';

export default function GradeAccordion({ category, assignments }) {
    return (
        <>
            <Accordion>
                <AccordionSummary
                    expandIcon={<ExpandMoreIcon />}
                    aria-controls='panel1a-content'
                    id='panel1a-header'>
                    <Typography>{category}</Typography>
                </AccordionSummary>
                <AccordionDetails>
                    <GradeTable assignments={assignments} />
                </AccordionDetails>
            </Accordion>
        </>
    );
}