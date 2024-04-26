import { Router } from 'express';
import { getTotalPossibleScore, getMaxScores, getStudentTotalScore, getStudentScores } from '../../../../lib/redisHelper.mjs';
import { getMaxPointsSoFar } from '../../../../lib/helper.mjs';
import 'express-async-errors';
import { isAdmin } from '../../../../lib/userlib.mjs';

const router = Router({ mergeParams: true });

router.get('/', async (req, res) => {
    const { email } = req.params;
    console.debug(email);
    const maxPoints = await getTotalPossibleScore();
    const maxScores = await getMaxScores();
    let studentTotalScore;
    let userGrades;
    if (isAdmin(email)) {
        userGrades = maxScores;
        studentTotalScore = getMaxPointsSoFar(maxScores, maxScores);
    } else {
        userGrades = await getStudentScores(email);
        studentTotalScore = await getStudentTotalScore(email);
    }
    const maxPointsSoFar = getMaxPointsSoFar(userGrades, maxScores);

    return res.status(200).json({
        "zeros": Math.round(studentTotalScore),
        "pace": Math.round((studentTotalScore / maxPointsSoFar) * maxPoints),
        "perfect": Math.round(studentTotalScore + (maxPoints - maxPointsSoFar))
    });
});



export default router;
