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

    res.status(200).json(getStudentScoresWithMaxPoints(studentScores, maxScores));
});

/**
 * Gets the student's scores but with the max points added on.
 * @param {object} studentScores the student's scores.
 * @param {object} maxScores the maximum possible scores.
 * @returns {object} students scores with max points.
 */
function getStudentScoresWithMaxPoints(studentScores, maxScores) {
    return Object.keys(studentScores).reduce((assignmentsDict, assignment) => {
        assignmentsDict[assignment] = Object.entries(studentScores[assignment])
            .reduce((scoresDict, [category, pointsScored]) => {
                scoresDict[category] = {
                    student: pointsScored,
                    max: maxScores[assignment][category]
                };
                return scoresDict;
            }, {});
        return assignmentsDict;
    }, {});
}

export default router;
