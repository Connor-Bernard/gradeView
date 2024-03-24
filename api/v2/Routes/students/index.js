import { Router } from 'express';
import GradesRouter from './grades/index.js';
import ProjectionsRouter from './projections/index.js';
import ProgressQueryStringRouter from './progressquerystring/index.js';
import AuthorizationError from '../../Errors/AuthorizationError.js';

const router = Router({ mergeParams: true });

/**
 * Middleware to check if the request has an authorization header.
 */
router.use('/', async (req, _, next) => {
    const { authorization } = req.headers;
    if (!authorization) {
        throw new AuthorizationError('Authorization required');
    }
    const studentEmail = await getEmailFromAuth(authorization);
    if (!studentEmail) {
        throw new AuthorizationError('Bad Authorization Token');
    }
    next();
});

/**
 * Middleware to check if the email in the request is the same as the email in the authorization header.
 */
router.use('/:email', async (req, _, next) => {
    const { email } = req.params;
    const { authorization } = req.headers;
    if (email !== await getEmailFromAuth(authorization)) {
        throw new AuthorizationError('Unauthorized');
    }
    next();
});

router.get('/', async (_, res) => {
    return res.status(501).json({ message: 'Not implemented' });
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