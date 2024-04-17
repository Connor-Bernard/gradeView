import { Router } from 'express';
import V2Router from './v2/index.js';
import 'express-async-errors';

const router = Router();
router.use('/v2', V2Router);

// Error handling middleware
router.use((err, _, res, next) => {
    res.status(err.status ?? 500).send(err.message);
    next(err);
});

export default router;
