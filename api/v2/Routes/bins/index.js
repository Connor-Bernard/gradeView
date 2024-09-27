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
        return res.status(200).json(binsData);
    } catch (error) {
        if (error instanceof NotFoundError) {
            console.error('Error: Bins data not found:', error.message);
            return res.status(404).json({ message: error.message });
        }
        console.error('Error retrieving bins from Redis:', error);
        return res.status(500).json({ message: 'Internal Server Error' });
    }
});

export default router;
