import { Router } from 'express';

const router = Router({ mergeParams: true });

router.get('/', async (_, res) => {
    return res.status(501).json({ message: 'Not implemented' });
});

export default router;