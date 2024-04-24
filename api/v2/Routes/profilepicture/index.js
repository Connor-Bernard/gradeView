import { Router } from 'express';
import 'express-async-errors';
import { getProfilePictureFromIdToken } from '../../../lib/googleAuthHelper.mjs';

const router = Router({ mergeParams: true });

// Responds with whether or not the current user is an admin
router.get('/', async (req, res) => {
    try {
        const profilePicture = await getProfilePictureFromIdToken(req.headers['authorization']);
        res.status(200).json({picture: profilePicture});
    } catch (error) {
        // If an error occurs during authentication or checking, consider them not an admin
        console.error('Error checking admin status:', error);
        res.status(200).json({picture: ""});
    }
});

export default router;
