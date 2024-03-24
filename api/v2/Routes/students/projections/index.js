import { Router } from 'express';
import { getTotalPossibleScore, getMaxPointsSoFar, getStudentTotalScore } from '../../../../lib/redisHelper.mjs';

const router = Router({ mergeParams: true });

router.get('/', async (req, res) => {
    const { email } = req.params;
    let maxPoints = await getTotalPossibleScore();
    let maxPointsSoFar = await getMaxPointsSoFar();
    let userGrades = await getStudentTotalScore(email);

    return res.status(200).json({
        "zeros": Math.round(userGrades),
        "pace": Math.round((userGrades / maxPointsSoFar) * maxPoints),
        "perfect": Math.round(userGrades + (maxPoints - maxPointsSoFar))
    });
});

export default router;
