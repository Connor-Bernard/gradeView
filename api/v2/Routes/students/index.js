import { Router } from 'express';
import RateLimit from 'express-rate-limit';
import GradesRouter from './grades/index.js';
import ProjectionsRouter from './projections/index.js';
import ProgressQueryStringRouter from './progressquerystring/index.js';
import GetAllStudentsRouter from "./getall/index.js";
import { validateAdminOrStudentMiddleware } from '../../../lib/authlib.mjs';
import 'express-async-errors';

const router = Router({ mergeParams: true });

// Rate limit calls to 100 per 5 minutes
router.use(RateLimit({
    windowMs: 5 * 60 * 1000, // 5 minutes
    max: 100, // 100 requests
}));

// TODO: sanitize email input.
// Ensure the requester has access to the requested student's data.
router.use('/:email', validateAdminOrStudentMiddleware);

router.use('/:id/grades', GradesRouter);
router.use('/:email/projections', ProjectionsRouter);
router.use('/:id/progressquerystring', ProgressQueryStringRouter);
router.use('/getall', GetAllStudentsRouter);


export default router;
