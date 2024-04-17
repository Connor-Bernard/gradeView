import { Router } from 'express';
import { getEmailFromAuth } from '../../../lib/googleAuthHelper.mjs';
import { getStudent } from '../../../lib/redisHelper.mjs';
import 'express-async-errors';

const router = Router();

/**
 * This route is used to verify if the user has access to the system, but it should be done as middleware.
 * @deprecated
 */
router.get('/verifyaccess', async (req, res) => {
    const { authorization } = req.headers;
    if (!authorization) {
        return res.status(200).send(false);
    }
    const auth = authorization.split(' ');
    try {
        await getStudent(await getEmailFromAuth(auth));
        return res.status(200).send(true);
    } catch (e) {
        return res.status(200).send(false);
    }
});

export default router;