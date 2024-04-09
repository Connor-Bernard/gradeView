import { Router } from 'express';
import RateLimit from 'express-rate-limit';
import GradesRouter from './grades/index.js';
import ProjectionsRouter from './projections/index.js';
import ProgressQueryStringRouter from './progressquerystring/index.js';
import StudentNotFoundError from '../../../lib/HttpErrors/StudentNotFoundError.js';
import { validateAdminOrStudentMiddleware } from '../../../lib/authlib.mjs';
import { isStudent } from '../../../lib/userlib.mjs';

const router = Router({ mergeParams: true });

// Rate limit calls to 100 per 5 minutes
router.use(RateLimit({
    windowMs: 5 * 60 * 1000, // 5 minutes
    max: 100, // 100 requests
});

// Ensure the requester has access to the requested student's data.
router.use('/:email', validateAdminOrStudentMiddleware);

// Ensure the requested student exists.
router.use('/:email', async (req, _, next) => {
    const { email } = req.params;
    if (!(await isStudent(email))) {
        throw new StudentNotFoundError('requested student does not exist');
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

