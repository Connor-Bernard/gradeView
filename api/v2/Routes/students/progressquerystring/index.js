import { Router } from 'express';
import {getMaxPointsSoFar, getStudentScores} from "../../../../lib/redisHelper.mjs";
import ProgressReportData from '../../../../assets/progressReport/CS10.json' assert {type: 'json'};
import 'express-async-errors';

const router = Router({ mergeParams: true });

function mapTopicsToGrades(userGradeData) {
    const topicsToGradesTable = {};
    userGradeData.forEach((assignment) => {
        if (!(assignment.assignment in topicsToGradesTable)) {
            topicsToGradesTable[assignment.assignment] = 0;
        }
        topicsToGradesTable[assignment.assignment] += +(assignment.grade ?? 0);
    });
    return topicsToGradesTable;
}

router.get('/', async (req, res) => {
    const { email } = req.params;
    const userGrades = await getStudentScores(email);
    const maxGrades = await getMaxPointsSoFar();
    const userTopicPoints = mapTopicsToGrades(userGrades);
    const maxTopicPoints = mapTopicsToGrades(maxGrades);
    const numMasteryLevels = ProgressReportData['student levels'].length - 2;
    Object.entries(userTopicPoints).forEach(([topic, userPoints]) => {
        const maxAchievablePoints = maxTopicPoints[topic];
        if (userPoints === 0) {
            return;
        }
        if (userPoints >= maxAchievablePoints) {
            userTopicPoints[topic] = numMasteryLevels + 1;
            return;
        }
        const unBoundedMasteryLevel = userPoints / maxAchievablePoints * numMasteryLevels;
        if (unBoundedMasteryLevel === numMasteryLevels) {
            userTopicPoints[topic] = numMasteryLevels;
        } else if (unBoundedMasteryLevel % 1 === 0) {
            // Push them over to the next category if they are exactly on the edge.
            userTopicPoints[topic] = unBoundedMasteryLevel + 1;
        } else {
            userTopicPoints[topic] = Math.ceil(unBoundedMasteryLevel);
        }
    });
    return res.status(200).json(Object.values(userTopicPoints).join(''));
});

export default router;
