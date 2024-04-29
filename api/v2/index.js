import { Router } from 'express';

import BinsRouter from './Routes/bins/index.js';
import StudentsRouter from './Routes/students/index.js'; 
import VerifyAccessRouter from './Routes/verifyaccess/index.js';
import IsAdminRouter from './Routes/isadmin/index.js';
import LoginRouter from "./Routes/login/index.js";

const router = Router();

router.use('/bins', BinsRouter);
router.use('/students', StudentsRouter);
router.use('/verifyaccess', VerifyAccessRouter);
router.use('/isadmin', IsAdminRouter);
router.use('/login', LoginRouter);

export default router;
