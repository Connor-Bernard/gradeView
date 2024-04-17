import { Router } from 'express';
import { getBins } from "../../../lib/redisHelper.mjs";
import NotFoundError from '../../../lib/HttpErrors/NotFoundError.js';
import 'express-async-errors';

const router = Router({ mergeParams: true });

router.get('/', async (_, res) => {
    try {
        const binsData = await getBins();
        if (!binsData) {
            throw new NotFoundError('Bins data not found');
        }
        return res.status(200).json(binsData.bins);
    } catch (error) {
        console.error('Error retrieving bins from Redis:', error);
        return res.status(500).json({ message: 'Internal Server Error' });
    }
});

export default router;