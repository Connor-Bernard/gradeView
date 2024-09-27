import { Router } from 'express';
import { getTotalPossibleScore, getMaxScores, getStudentTotalScore, getStudentScores } from '../../../../lib/redisHelper.mjs';
import { getMaxPointsSoFar } from '../../../../lib/studentHelper.mjs';
import 'express-async-errors';
import { isAdmin } from '../../../../lib/userlib.mjs';

const router = Router({ mergeParams: true });

router.get('/', async (req, res) => {
    const { email } = req.params;
    console.debug(email);
    let maxPoints;
    try {
        maxPoints = await getTotalPossibleScore();
    } catch (error) {
        return res.status(500).json({ message: "Bins not found."});
    }
    let maxScores;
    try {
        maxScores = await getMaxScores();
    } catch (error) {
        return res.status(500).json({ message: "Max scores not found."});
    }
    let studentTotalScore;
    let userGrades;
    if (isAdmin(email)) {
        userGrades = maxScores;
        studentTotalScore = getMaxPointsSoFar(maxScores, maxScores);
    } else {
        try {
            userGrades = await getStudentScores(email);
        } catch (error) {
            return res.status(404).json({ message: "Student not found."});
        }
        studentTotalScore = await getStudentTotalScore(email);
    }
    const maxPointsSoFar = getMaxPointsSoFar(userGrades, maxScores);

    return res.status(200).json({
        zeros: Math.round(studentTotalScore),
        pace: Math.round((studentTotalScore / maxPointsSoFar) * maxPoints),
        perfect: Math.round(studentTotalScore + (maxPoints - maxPointsSoFar))
    });
});



export default router;
