import { Router } from 'express';
import { validateAdminOrStudentMiddleware } from '../../../lib/authlib.mjs';
import 'express-async-errors';
import RateLimit from 'express-rate-limit';

const router = Router({ mergeParams: true });

router.use(RateLimit({
    windowMs: 5 * 60 * 1000, // 5 minutes
    max: 100, // 100 requests
}));

router.get('/', validateAdminOrStudentMiddleware, async (_, res) => {
    res.send({ status: true });
}, (error, req, res, next) => {
    // If an error occurs in the middleware, send False
    res.send({ status: false });
});

export default router;
