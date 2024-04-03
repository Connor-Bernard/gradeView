import { Router } from 'express';
import GradesRouter from './grades/index.js';
import ProjectionsRouter from './projections/index.js';
import ProgressQueryStringRouter from './progressquerystring/index.js';
import AuthorizationError from '../../../lib/HttpErrors/AuthorizationError.js';
import StudentNotFoundError from '../../../lib/HttpErrors/StudentNotFoundError.js';
import { getEmailFromAuth } from '../../../lib/googleAuthHelper.mjs';
import { getStudent } from '../../../lib/redisHelper.mjs';
import config from '../../../config/default.json' assert { type: 'json'};

const router = Router({ mergeParams: true });

/**
 * Middleware to check if the email in the request is the same as the email in the authorization header.
 * TODO: this should be moved to a lib file.
 */
router.use('/:email', async (req, _, next) => {
    const { email } = req.params;
    const { authorization } = req.headers;
    // Allow admins to subvert this check.
    const requesterEmail = await getEmailFromAuth(authorization);
    if (config.admins.includes(requesterEmail)) {
        // TODO: test that this actually checks if the student exists.
        if (!(await getStudent(email))) {
            throw new StudentNotFoundError('requested student does not exist.');
        }
        next();
    }

    if (email !== requesterEmail) {
        throw new AuthorizationError('Unauthorized');
    }
    next();
});

router.get('/:email', async (req, res) => {
    // TODO: implement me.
    const userInfo = {
        email: req.params.email,
        name: '',
        pfp: ''
    };
    return res.status(501).json({ message: 'Not implemented' });
});

router.use('/:id/grades', GradesRouter);
router.use('/:id/projections', ProjectionsRouter);
router.use('/:id/progressquerystring', ProgressQueryStringRouter);

export default router;
