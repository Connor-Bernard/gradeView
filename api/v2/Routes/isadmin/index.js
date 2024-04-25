import { Router } from 'express';
import 'express-async-errors';
import { isAdmin } from '../../../lib/userlib.mjs';
import { getEmailFromAuth } from '../../../lib/googleAuthHelper.mjs';
import AuthorizationError from '../../../lib/HttpErrors/AuthorizationError.js';
const router = Router({ mergeParams: true });

// Responds with whether or not the current user is an admin
router.get('/', async (req, res) => {
    const authHeader = req.headers['authorization'];
    if (!authHeader) {
        throw new AuthorizationError("Authorization Header is empty.");
    }
    const authEmail = await getEmailFromAuth(authHeader);
    const adminStatus = await isAdmin(authEmail);
    res.status(200).json({ isAdmin: adminStatus });
    
});

export default router;
