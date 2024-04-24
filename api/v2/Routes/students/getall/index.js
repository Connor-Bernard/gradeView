import { Router } from 'express';
import { getStudents } from '../../../../lib/redisHelper.mjs';
import 'express-async-errors';
import UnauthorizedAccessError from '../../../../lib/HttpErrors/UnauthorizedAccessError.js';
import { isAdmin } from '../../../../lib/userlib.mjs';
import { getEmailFromAuth } from '../../../../lib/googleAuthHelper.mjs';

const router = Router({ mergeParams: true });

router.get('/', async (req, res) => {
    const authEmail = await getEmailFromAuth(req.headers['authorization']);
    try {
        if (isAdmin(authEmail)) {
            const students = await getStudents();
            console.log(students);
            return res.status(200).json({students: students});
        } else {
            throw new UnauthorizedAccessError("You are not an admin");
        }
    } catch (error) {
        console.error('Error retrieving students from Redis:', error);
        return res.status(500).json({ message: 'Internal Server Error' });
    }
});

export default router;
