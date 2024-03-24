import { Router } from 'express';
import V2Router from './v2/index.js';

const router = Router();
router.use('/v2', V2Router);

export default router;
