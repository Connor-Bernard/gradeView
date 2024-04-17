import { Router } from 'express';
import { getStudentScores } from '../../../../lib/redisHelper.mjs';
import 'express-async-errors';

const router = Router({ mergeParams: true });

router.get('/', async (req, res) => {
    const { id } = req.params;
    res.status(200).json(await getStudentScores(id));
});

export default router;
