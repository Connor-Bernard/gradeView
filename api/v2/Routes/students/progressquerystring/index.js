import { Router } from 'express';
import { getEmailFromAuth } from "../../../../lib/googleAuthHelper.mjs";
import { getMaxPointsSoFar, getMaxScores, getStudentScores } from '../../../../lib/redisHelper.mjs';
import ProgressReportData from '../../../../assets/progressReport/CS10.json' assert {type: 'json'};
import 'express-async-errors';

const router = Router({ mergeParams: true });

function getTopicsFromUser(gradeData) {
    const topicsTable = {};
    Object.entries(gradeData).forEach(([assignment, topics]) => {
        Object.entries(topics).forEach(([topic, score]) => {
            if (topic in topicsTable) {
                topicsTable[topic] += +(score ?? 0)
            } else {
                topicsTable[topic] = +(score ?? 0)
            }
        })
    })
    return topicsTable
}

async function getMasteryString(userTopicPoints, maxTopicPoints) {
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
    let masteryNum = Object.values(userTopicPoints).join('');
    return masteryNum;
}

router.get('/', async (req, res) => {
    const { id } = req.params;
    const userGrades = await getStudentScores(id);
    const maxGrades = await getMaxPointsSoFar();
    const userTopicPoints = getTopicsFromUser(userGrades);
    const maxTopicPoints = getTopicsFromUser(maxGrades['Assignments']);
    const masteryNum = await getMasteryString(userTopicPoints, maxTopicPoints);
    return res.status(200).json(masteryNum);
});

export default router;
