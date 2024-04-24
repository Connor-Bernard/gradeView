import { Router } from 'express';
import 'express-async-errors';
import { isAdmin, isStudent } from '../../../lib/userlib.mjs';
import { getEmailFromAuth } from '../../../lib/googleAuthHelper.mjs';

const router = Router({ mergeParams: true });

// Responds with whether or not the current user is an admin
router.get('/', async (req, res) => {
    try {
        const authEmail = await getEmailFromAuth(req.headers['authorization']);
        const adminStatus = await isAdmin(authEmail);
        res.status(200).json({ isAdmin: adminStatus });
    } catch (error) {
        // If an error occurs during authentication or checking, consider them not an admin
        console.error('Error checking admin status:', error);
        res.status(200).json({ isAdmin: false });
    }
});

export default router;
