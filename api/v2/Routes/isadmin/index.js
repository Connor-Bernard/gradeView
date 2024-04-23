import { Router } from 'express';
import 'express-async-errors';
import { isAdmin, isStudent } from '../../../lib/userlib.mjs';
import { getEmailFromAuth } from '../../../lib/googleAuthHelper.mjs';

const router = Router({ mergeParams: true });

// Responds with whether or not the current user is an admin
router.get('/', async (_, res) => {
    return res.status(200).json(true);
});

export default router;
