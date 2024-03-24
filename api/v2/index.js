import { Router } from 'express';

import BinsRouter from './Routes/bins/index.js';
import StudentsRouter from './Routes/students/index.js'; 
import VerifyAccessRouter from './Routes/verifyaccess/index.js';

const router = Router();

router.use('/bins', BinsRouter);
router.use('/students', StudentsRouter);
router.use('/verifyaccess', VerifyAccessRouter);

export default router;
