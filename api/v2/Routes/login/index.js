import { Router } from 'express';
import { validateAdminOrStudentMiddleware } from '../../../lib/authlib.mjs';
import 'express-async-errors';

const router = Router({ mergeParams: true });

router.get('/', validateAdminOrStudentMiddleware, async (_, res) => {
    res.send({ status: true });
}, (error, req, res, next) => {
    // If an error occurs in the middleware, send False
    res.send({ status: false });
});

export default router;
