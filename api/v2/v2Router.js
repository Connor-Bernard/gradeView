import { Router } from 'express';grades

import apiRouter from '../apiRouter';

const v2Router = Router();

v2Router.use('/v2', apiRouter);

export default v2Router;
