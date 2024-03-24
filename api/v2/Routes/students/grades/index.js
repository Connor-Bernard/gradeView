import { Router } from 'express';
import { getEmailFromAuth } from '../../../../lib/googleAuthHelper.mjs';
import AuthorizationError from '../../Errors/AuthorizationError.js';

const router = Router({ mergeParams: true });

router.get('/', async (req, res) => {
    const { email } = req.params;
    res.status(200).json(await getStudentScores(email));
});

export default router;
