import { Router } from 'express';
import { getMaxScores, getStudentScores } from '../../../../lib/redisHelper.mjs';
import 'express-async-errors';
import { isAdmin } from '../../../../lib/userlib.mjs';

const router = Router({ mergeParams: true });

router.get('/', async (req, res) => {
    const { id } = req.params; // the id is the student's email
    let maxScores;
    try {
        // Attempt to get max scores, if fails, return 404
        maxScores = await getMaxScores();
    } catch (error) {
        return res.status(404).json({ message: 'Error fetching max scores' });
    }

    let studentScores;
    try {
        if (isAdmin(id)) {
            studentScores = maxScores;
        } else {
            // Attempt to get student scores
            studentScores = await getStudentScores(id);
        }
    } catch (error) {
        return res.status(404).json({ message: `Error fetching scores for student with id ${id}` });
    } finally {
        // record metrics?
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
