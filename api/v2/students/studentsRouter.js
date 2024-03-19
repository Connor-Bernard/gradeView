import { Router } from 'express';

import v2Router from '../v2Router';
import {
    getMaxPointsSoFar,
    getStudent,
    getStudentScores,
    getStudentTotalScore,
    getTotalPossibleScore
} from "../../lib/redisHelper.mjs";
import {getEmailFromAuth} from "../../lib/googleAuthHelper.mjs";
import {OAuth2Client} from "google-auth-library";
import AuthenticationError from "../Errors/AuthenticationError.js";

const studentsRouter = Router({ mergeParams: true });

router.use('/students/:email', v2Router);

studentsRouter.get('/bins', async (_, res) => {
    return res.status(501).json({ message: 'Not implemented' });
});

studentsRouter.get('/verifyaccess', async (req, res) => {
    let auth = req.headers['authorization'];
    if (!auth) {
        return res.status(401).send(false);
    }
    auth = auth.split(' ');
    try {
        await getStudent(await getEmailFromAuth(auth))
        return res.status(200).send(true);
    } catch (e) {
        console.log(e);
        return res.status(401).send(false);
    }
});

studentsRouter.get('/grades', async (req, res) => {
    return res.status(200)
        .json(await getStudentScores(await getEmailFromAuth(req.headers['authorization'].split(' ')[1])))
});

studentsRouter.get('/profilepictures', async (req, res) => {
    return res.status(501).json({ message: 'Not implemented' });
});

studentsRouter.get('/projections', async (req, res) => {
    let projections;
    try {
        let maxPoints = getTotalPossibleScore();
        let maxPointsSoFar = getMaxPointsSoFar();
        let userGrades = getStudentTotalScore(await getEmailFromAuth(req.headers['authorization'].split(' ')[1]))

        projections = {
            "zeros": Math.round(userGrades),
            "pace": Math.round((userGrades / maxPointsSoFar) * maxPoints),
            "perfect": Math.round(userGrades + (maxPoints - maxPointsSoFar))
        }
    } catch (e) {
        if (e instanceof AuthenticationError) {
            return res.status(400).json({error: 'User not found'})
        }
    }

    return res.status(200).json(projections);
});

studentsRouter.get('/progressquerystring', async (req, res) => {
    return res.status(501).json({ message: 'Not implemented' });
});
