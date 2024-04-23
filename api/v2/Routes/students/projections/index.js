import { Router } from 'express';
import { getTotalPossibleScore, getMaxScores, getStudentTotalScore, getStudentScores } from '../../../../lib/redisHelper.mjs';
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

/**
 * Gets the max points the user can possibly have achieved.
 * @param {object} studentScores the student's scores in the class.
 * @param {object} maxScores the max scores for assignments in the class.
 * @returns {number} the max points the user could have gotten so far.
 */
function getMaxPointsSoFar(studentScores, maxScores) {
    return Object.keys(studentScores).reduce((acc, assignment) => {
        Object.values(maxScores[assignment]).forEach((catTotal) => {
            acc += +(catTotal ?? 0);
        }, 0);
        return acc;
    }, 0);
}

export default router;
