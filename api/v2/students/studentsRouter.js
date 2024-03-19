import { Router } from 'express';

import v2Router from '../v2Router';

const studentsRouter = Router({ mergeParams: true });

router.use('/students/:email', v2Router);

studentsRouter.get('/bins', async (_, res) => {
    return res.status(501).json({ message: 'Not implemented' });
});

studentsRouter.get('/verifyaccess', async (req, res) => {
    return res.status(501).json({ message: 'Not implemented' });
});

studentsRouter.get('/grades', async (req, res) => {
    return res.status(501).json({ message: 'Not implemented' });
});

studentsRouter.get('/profilepictures', async (req, res) => {
    return res.status(501).json({ message: 'Not implemented' });
});

studentsRouter.get('/projections', async (req, res) => {
    return res.status(501).json({ message: 'Not implemented' });
});

studentsRouter.get('/progressquerystring', async (req, res) => {
    return res.status(501).json({ message: 'Not implemented' });
});
