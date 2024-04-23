import { Router } from 'express';
import { getMaxScores, getStudentScores } from '../../../../lib/redisHelper.mjs';
import 'express-async-errors';
import { isAdmin } from '../../../../lib/userlib.mjs';

const router = Router({ mergeParams: true });

router.get('/', async (req, res) => {
    const { id } = req.params;
    const maxScores = await getMaxScores();
    let studentScores;
    if (isAdmin(id)) {
        studentScores = maxScores;
    } else {
        studentScores = await getStudentScores(id);
    }
    
    Object.keys(studentScores).forEach((assignment) => {
        Object.entries(studentScores[assignment]).forEach(([category, pointsScored]) => {
            studentScores[assignment][category] = {
                student: pointsScored,
                max: maxScores[assignment][category],
            }
        });
    });
    res.status(200).json(studentScores);
});

export default router;
